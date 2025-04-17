from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    description = Column(String, nullable=False)
    montant = Column(Float, nullable=False)
    type = Column(String, nullable=False)  # "ponctuelle" ou "récurrente"
    categorie = Column(String, nullable=True)
    statut = Column(String, nullable=False, default="en attente")
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    user = relationship("User", backref="transactions")
