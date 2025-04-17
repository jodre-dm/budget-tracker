# Nom du dossier principal
$projectName = "budget_tracker"

# Création des dossiers
New-Item -Path $projectName\app\routes -ItemType Directory -Force | Out-Null
New-Item -Path $projectName\app\models -ItemType Directory -Force | Out-Null
New-Item -Path $projectName\app\schemas -ItemType Directory -Force | Out-Null

# Création des fichiers
$files = @(
    "$projectName\requirements.txt",
    "$projectName\app\__init__.py",
    "$projectName\app\main.py",
    "$projectName\app\routes\__init__.py",
    "$projectName\app\routes\test.py",
    "$projectName\app\models\__init__.py",
    "$projectName\app\schemas\__init__.py",
    "$projectName\app\database.py"
)

foreach ($file in $files) {
    New-Item -Path $file -ItemType File -Force | Out-Null
}

Write-Host "Arborescence du projet '$projectName' créée avec succès."
