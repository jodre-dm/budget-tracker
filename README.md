# 💰 Budget Tracker – API Backend

Application de suivi de budget personnel, construite avec **FastAPI**, **SQLite**, **SQLAlchemy** et **JWT Auth**.

## ✅ Fonctionnalités principales

- Authentification sécurisée avec JWT
- Création et gestion de transactions (CRUD complet)
- Statuts de transaction : prélevé / en attente
- Suivi du solde actuel
- Calcul du solde prévisionnel
- Résumé mensuel des dépenses (type / catégorie)
- Export CSV des transactions

---

## 🚀 Technologies utilisées

- **FastAPI** – Framework web rapide et moderne
- **SQLite** – Base de données légère
- **SQLAlchemy** – ORM relationnel
- **Pydantic** – Validation de données
- **Passlib** – Hash des mots de passe
- **JWT** – Authentification token sécurisée
- **Pandas** – Export CSV

---

## 🔐 Authentification et Token JWT

Une fois connecté via `POST /users/login`, tu reçois un token JWT :

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
````
---

## 📚 Routes principales

### 👤 Utilisateur

| Méthode | Endpoint          | Description                  |
|---------|-------------------|------------------------------|
| POST    | `/users/signup`   | Créer un compte utilisateur  |
| POST    | `/users/login`    | Se connecter et recevoir un token |

---

### 💸 Transactions

| Méthode | Endpoint                          | Description                       |
|---------|-----------------------------------|-----------------------------------|
| GET     | `/transactions/`                 | Liste des transactions (filtrées par user) |
| POST    | `/transactions/`                 | Ajouter une transaction          |
| GET     | `/transactions/{id}`             | Détail d'une transaction         |
| PUT     | `/transactions/{id}`             | Modifier une transaction         |
| DELETE  | `/transactions/{id}`             | Supprimer une transaction        |
| PATCH   | `/transactions/{id}/statut`      | Mettre à jour le statut (prélevé / attente) |
| GET     | `/transactions/balance`          | Calcul du solde total (par type) |
| GET     | `/transactions/stats`            | Statistiques d’un mois donné     |
| GET     | `/transactions/resume`           | Résumé par catégorie/type        |
| GET     | `/transactions/export`           | Export CSV des transactions      |
| GET     | `/transactions/previsionnel`     | Calcul du solde prévisionnel     |

---

### 💶 Solde

| Méthode | Endpoint       | Description                        |
|---------|----------------|------------------------------------|
| POST    | `/solde/`      | Enregistrer / mettre à jour le solde |
| GET     | `/solde/`      | Obtenir le solde actuel            |

---

## 🧪 Test via Swagger

Lance le serveur avec :

```bash
uvicorn main:app --reload

Puis visite :
➡️ http://localhost:8000/docs

