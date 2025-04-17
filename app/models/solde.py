from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Solde(Base):
    __tablename__ = "soldes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    montant = Column(Float, nullable=False)
    date_mise_a_jour = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="solde")
