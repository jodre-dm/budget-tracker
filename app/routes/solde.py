from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.solde import Solde
from app.schemas.solde import SoldeCreate, SoldeRead
from app.routes.transaction import get_current_user
from app.models.user import User

router = APIRouter(prefix="/solde", tags=["solde"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=SoldeRead)
def set_solde(mise_a_jour: SoldeCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing = db.query(Solde).filter(Solde.user_id == current_user.id).first()
    if existing:
        existing.montant = mise_a_jour.montant
    else:
        existing = Solde(user_id=current_user.id, montant=mise_a_jour.montant)
        db.add(existing)

    db.commit()
    db.refresh(existing)
    return existing

@router.get("/", response_model=SoldeRead)
def get_solde(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    solde = db.query(Solde).filter(Solde.user_id == current_user.id).first()
    if not solde:
        raise HTTPException(status_code=404, detail="Solde non défini")
    return solde
