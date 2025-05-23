from fastapi import FastAPI
from app.routes.test import router as test_router
from app.routes.transaction import router as transaction_router
from app.routes.user import router as user_router
from app.routes.solde import router as solde_router
from app.database import engine, Base
from app.models import transaction, user, solde  # important pour que SQLAlchemy voie le modèle

from fastapi.middleware.cors import CORSMiddleware


# Création de la base si elle n'existe pas encore
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # autorise React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Inclusion des routes
app.include_router(test_router)
app.include_router(transaction_router)
app.include_router(user_router)
app.include_router(solde_router)
