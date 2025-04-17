# Dossier racine
$root = "src"

# Création des dossiers
New-Item -Path "$root\pages" -ItemType Directory -Force | Out-Null
New-Item -Path "$root\components" -ItemType Directory -Force | Out-Null

# Création des fichiers dans pages
New-Item -Path "$root\pages\Login.jsx" -ItemType File -Force | Out-Null
New-Item -Path "$root\pages\Dashboard.jsx" -ItemType File -Force | Out-Null

# Création des fichiers dans components
New-Item -Path "$root\components\Header.jsx" -ItemType File -Force | Out-Null
New-Item -Path "$root\components\TransactionTable.jsx" -ItemType File -Force | Out-Null
New-Item -Path "$root\components\StatCard.jsx" -ItemType File -Force | Out-Null

# Fichiers principaux
New-Item -Path "$root\App.jsx" -ItemType File -Force | Out-Null
New-Item -Path "$root\main.jsx" -ItemType File -Force | Out-Null

Write-Host "Arborescence React créée avec succès dans '$root'."
