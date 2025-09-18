# Exam Management System
Une application pour la gestion d'examens développée avec **Symfony 7** et **Angular 18**.

## Architecture

```
exam-management/
├── backend/           # API Symfony 7 + API Platform
├── frontend/          # Application Angular 18 + Tailwind CSS
├── docker-compose.yml # Orchestration des services
└── README.md
```

## Technologies utilisées

### Backend
- **Symfony 7** - Framework PHP moderne
- **API Platform** - Génération d'APIs REST automatique
- **MariaDB 10.11** - Base de données relationnelle
- **Docker & Nginx** - Containerisation et serveur web

### Frontend
- **Angular 18** - Framework TypeScript avec Signals
- **Tailwind CSS** - Framework CSS utility-first
- **TypeScript** - Typage statique
- **RxJS** - Programmation réactive

## Installation et lancement

### Prérequis
- Docker et Docker Compose
- Git

### Démarrage rapide
```bash
# Cloner le projet
git clone https://github.com/akartisfaniry/exam-management.git
cd exam-management

# Lancer l'application complète
docker-compose up -d

# Créer les tables dans la base (migrations)
docker exec -it exam_backend php bin/console doctrine:migrations:migrate --no-interaction

# Charger les données d'exemple (optionnel)
docker exec -it exam_backend php bin/console doctrine:fixtures:load --no-interaction
```

### Accès aux services
- **Frontend** : http://localhost:8600
- **API Backend** : http://localhost:8400
- **Base de données** : localhost:49170 (user: exam_user, password: exam_password)

## Fonctionnalités

### Implémentées
- [x] **API REST** pour la gestion des examens (GET, POST)
- [x] **Validation automatique** des données (API Platform)
- [x] **Interface utilisateur moderne** avec Tailwind CSS
- [x] **Gestion d'état avec Angular Signals** (Angular 18)
- [x] **Authentification basique**
- [x] **Liste des examens**
- [x] **Ajout d'examens** formulaires réactifs avec validation
- [x] **Architecture containerisée** avec Docker

### Modèle de données
```php
Exam {
    id: integer (auto)
    studentName: string (requis, 2-255 caractères)
    location: string (optionnel, 255 caractères max)
    date: date (requis, >= aujourd'hui)
    time: time (requis)
    status: string (requis, choix: 'Confirmé', 'À organiser', 'Annulé', 'En recherche de place')
}
```

## Tests

### Tests API
```bash
# Via curl
curl -X GET http://localhost:8400/api/exams

# Créer un examen
curl -X POST http://localhost:8400/api/exams \
  -H "Content-Type: application/ld+json" \
  -d '{
    "studentName": "Isabella.S",
    "location": "Martigues.B",
    "date": "2026-06-16",
    "time": "08:30",
    "status": "Confirmé"
  }'
```

### Tests Frontend
L'interface permet de :
- Se connecter via la page de login **(admin@exam.com / password)**
- Visualiser la liste des examens
- Ajouter/Modifier un nouvel examen

## Développement

### Backend (Symfony 7)
```bash
# Entrer dans le container backend
docker exec -it exam_backend bash

# Migrations base de données
php bin/console doctrine:migrations:migrate

# Charger les données d'exemple (fixtures)
php bin/console doctrine:fixtures:load

# Créer une nouvelle migration
php bin/console make:migration
```

### Frontend (Angular 18)
```bash
# Entrer dans le container frontend
docker exec -it exam_frontend_dev bash

# Générer un composant
ng generate component nom-composant
```

## Configuration

### Variables d'environnement Backend (.env)
```env
APP_ENV=dev
DATABASE_URL=mysql://exam_user:exam_password@database:3306/exam_db
CORS_ALLOW_ORIGIN=^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$
```

### Configuration Frontend
```typescript
// src/environments/environment.ts
export const Environment = {
  production: false,
  apiUrl: 'http://localhost:8400/api'
};
```

## Améliorations possibles
- [ ] **Filtres par statut** sur la liste
- [ ] **Suppression d'examens**

### Évolutions futures
- [ ] Tests unitaires et d'intégration
- [ ] Pagination côté serveur
- [ ] Recherche full-text
- [ ] Notifications temps réel (WebSocket)
- [ ] Export PDF/Excel des examens
- [ ] Système de rôles plus avancé

## Développeur

Développé par **Sitraka Ihariantsoa FANIRIANDRANDRAINA** dans le cadre d'un test technique.

**Stack technique** : Symfony 7 + Angular 18 + Tailwind CSS + Docker + MariaDB

---
**Note** : Ce projet démontre la maîtrise des technologies modernes et des bonnes pratiques de développement full-stack.
