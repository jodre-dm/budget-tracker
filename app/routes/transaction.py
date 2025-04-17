from datetime import datetime, timedelta
from typing import Optional, List
import pandas as pd

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import SessionLocal
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas.transaction import TransactionCreate, TransactionRead, MonthlyStats, StatutUpdate, ResumeMensuel
from app.utils.jwt import verify_token

from io import StringIO, BytesIO

router = APIRouter(prefix="/transactions", tags=["transactions"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

# 🔌 DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 🔐 Utilisateur courant
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token invalide")
    
    user_id = int(payload.get("sub"))
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return user

# 📊 Statistiques mensuelles
@router.get("/stats", response_model=MonthlyStats)
def get_monthly_stats(
    mois: str = Query(..., description="Format attendu : AAAA-MM"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        date_debut = datetime.strptime(mois, "%Y-%m").date()
        date_fin = (date_debut.replace(day=1) + timedelta(days=32)).replace(day=1)
    except ValueError:
        raise HTTPException(status_code=400, detail="Format attendu : AAAA-MM")

    query = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.date >= date_debut,
        Transaction.date < date_fin
    )

    transactions = query.all()

    total = sum(t.montant for t in transactions)
    nombre = len(transactions)
    récurrent = sum(t.montant for t in transactions if t.type == "récurrente")
    ponctuel = sum(t.montant for t in transactions if t.type == "ponctuelle")
    moyenne = total / nombre if nombre else 0.0

    return {
        "mois": mois,
        "total": round(total, 2),
        "nombre": nombre,
        "récurrent": round(récurrent, 2),
        "ponctuel": round(ponctuel, 2),
        "moyenne": round(moyenne, 2)
    }

# 💰 Solde
@router.get("/balance")
def get_balance(
    type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Transaction).filter(Transaction.user_id == current_user.id)

    if type:
        query = query.filter(Transaction.type == type)

    total = query.with_entities(func.sum(Transaction.montant)).scalar() or 0.0
    return {"solde": total}

# ➕ Créer une transaction
@router.post("/", response_model=TransactionRead)
def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_transaction = Transaction(**transaction.dict(), user_id=current_user.id)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

# 📋 Liste des transactions
@router.get("/", response_model=List[TransactionRead])
def get_transactions(
    type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Transaction).filter(Transaction.user_id == current_user.id)
    if type:
        query = query.filter(Transaction.type == type)
    return query.all()

@router.get("/previsionnel")
def get_previsionnel(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    from app.models.solde import Solde  # importer ici si pas encore global

    solde = db.query(Solde).filter(Solde.user_id == current_user.id).first()
    if not solde:
        raise HTTPException(status_code=404, detail="Solde non défini")

    total_en_attente = db.query(func.sum(Transaction.montant)).filter(
        Transaction.user_id == current_user.id,
        Transaction.statut == "en attente"
    ).scalar() or 0.0

    previsionnel = solde.montant - total_en_attente

    return {
        "solde_actuel": round(solde.montant, 2),
        "en_attente": round(total_en_attente, 2),
        "previsionnel": round(previsionnel, 2)
    }

@router.get("/export")
def export_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()

    if not transactions:
        raise HTTPException(status_code=404, detail="Aucune transaction à exporter")

    data = [{
        "Date": t.date,
        "Description": t.description,
        "Montant": t.montant,
        "Type": t.type,
        "Statut": t.statut,
        "Catégorie": t.categorie or ""
    } for t in transactions]

    df = pd.DataFrame(data)

    # 👉 Encode en UTF-8 avec BOM dans un buffer binaire
    buffer = BytesIO()
    df.to_csv(buffer, index=False, encoding="utf-8-sig")
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=transactions.csv"}
    )

@router.get("/resume", response_model=ResumeMensuel)
def get_resume_mensuel(
    mois: str = Query(..., description="Format AAAA-MM"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        date_debut = datetime.strptime(mois, "%Y-%m").date()
        date_fin = (date_debut.replace(day=1) + timedelta(days=32)).replace(day=1)
    except ValueError:
        raise HTTPException(status_code=400, detail="Format attendu : AAAA-MM")

    transactions = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.date >= date_debut,
        Transaction.date < date_fin
    ).all()

    par_categorie = {}
    par_type = {}

    for t in transactions:
        if t.categorie:
            par_categorie[t.categorie] = par_categorie.get(t.categorie, 0) + t.montant
        par_type[t.type] = par_type.get(t.type, 0) + t.montant

    return {
        "mois": mois,
        "par_categorie": {k: round(v, 2) for k, v in par_categorie.items()},
        "par_type": {k: round(v, 2) for k, v in par_type.items()}
    }

# 🔍 Détail transaction
@router.get("/{transaction_id}", response_model=TransactionRead)
def get_transaction(transaction_id: int, db: Session = Depends(get_db)):
    transaction = db.query(Transaction).get(transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction non trouvée")
    return transaction

# ✏️ Modifier une transaction
@router.put("/{transaction_id}", response_model=TransactionRead)
def update_transaction(transaction_id: int, updated: TransactionCreate, db: Session = Depends(get_db)):
    transaction = db.query(Transaction).get(transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction non trouvée")
    for key, value in updated.dict().items():
        setattr(transaction, key, value)
    db.commit()
    db.refresh(transaction)
    return transaction

@router.patch("/{transaction_id}/statut", response_model=TransactionRead)
def update_transaction_statut(
    transaction_id: int,
    statut_update: StatutUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transaction = db.query(Transaction).get(transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction non trouvée")
    
    transaction.statut = statut_update.statut
    db.commit()
    db.refresh(transaction)
    return transaction

# ❌ Supprimer une transaction
@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    transaction = db.query(Transaction).get(transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction non trouvée")
    db.delete(transaction)
    db.commit()
    return {"message": f"Transaction {transaction_id} supprimée"}

