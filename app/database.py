from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# URL de connexion SQLite (fichier local)
DATABASE_URL = "sqlite:///./budget.db"

# Création de l'engine
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# Session locale pour interagir avec la DB
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Classe de base pour les modèles
Base = declarative_base()
