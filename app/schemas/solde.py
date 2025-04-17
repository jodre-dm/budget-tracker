from pydantic import BaseModel
from datetime import datetime

class SoldeBase(BaseModel):
    montant: float

class SoldeCreate(SoldeBase):
    pass

class SoldeRead(SoldeBase):
    id: int
    date_mise_a_jour: datetime

    class Config:
        from_attributes = True
