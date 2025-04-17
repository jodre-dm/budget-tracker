from pydantic import BaseModel, EmailStr

# Base commune à tous les schémas utilisateur
class UserBase(BaseModel):
    email: EmailStr
    prenom: str  # ✅ ajout du prénom ici pour le partage

# Schéma utilisé lors de l'inscription
class UserCreate(UserBase):
    password: str

# Schéma utilisé pour lire les infos utilisateur
class UserRead(UserBase):
    id: int

    class Config:
        from_attributes = True
