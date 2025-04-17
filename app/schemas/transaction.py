from pydantic import BaseModel
from datetime import date

from typing import Optional


class TransactionBase(BaseModel):
    date: date
    description: str
    montant: float
    type: str  # tu pourras affiner plus tard avec un Enum
    statut: str = "en attente"
    categorie: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionRead(TransactionBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class MonthlyStats(BaseModel):
    mois: str
    total: float
    nombre: int
    récurrent: float
    ponctuel: float
    moyenne: float

class StatutUpdate(BaseModel):
    statut: str

from typing import Dict

class ResumeMensuel(BaseModel):
    mois: str
    par_categorie: Dict[str, float]
    par_type: Dict[str, float]
