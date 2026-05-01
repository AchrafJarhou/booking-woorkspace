# Backend Tasks - Workly (Reservation de salles)

## 1) Etat actuel apres scan

### Deja en place
- API Express demarree via `src/server.js`
- Connexion MySQL via pool (`src/config/db.js`)
- Migration SQL existante avec tables:
  - `types`
  - `equipements`
  - `utilisateurs`
  - `salles` (inclut `latitude`, `longitude`)
  - `reservations`
  - `salle_equipements`
  - `salle_photos`
- Seed SQL present
- CRUD partiel pour:
  - types
  - equipements
  - users
  - rooms (liste, detail, creation)
- Architecture POO demarree (BaseModel + modeles)

### Manques et points a corriger
- Pas de couche `services` (la logique est encore dans controllers/models)
- Pas de module complet `reservations` (modele, service, controller, routes)
- Pas de validations metier robustes (payloads, formats, bornes)
- Pas d'auth solide (hash mot de passe, JWT, roles admin/user)
- Routes salles incompletes (pas de update/delete)
- Pas de verification de conflit de reservation (overlap horaire)
- Pas de gestion centralisee des erreurs
- Seed utilisateur avec mot de passe en clair
- Geolocalisation: pas de validation stricte latitude/longitude avant insertion

---

## 2) Regles fonctionnelles a verrouiller (backend)

- Latitude obligatoire pour une salle:
  - nombre decimal
  - borne: -90 a 90
- Longitude obligatoire pour une salle:
  - nombre decimal
  - borne: -180 a 180
- Une salle ne peut pas etre reservee si un autre booking chevauche le meme slot horaire
- Role admin requis pour creation/modification/suppression de salle/type/equipement
- Role user autorise a creer/annuler ses propres reservations

---

## 3) Backlog backend par fonctionnalite (ordre recommande)

## Tache 1 - Poser la structure Services + Middlewares

### Objectif
Refactorer l'architecture pour que le controller ne fasse que recevoir/repondre et delegue la logique metier aux services.

### A faire
- Creer dossiers:
  - `src/services`
  - `src/middlewares`
  - `src/utils`
- Ajouter un pattern commun:
  - `controller -> service -> model`
- Ajouter gestion d'erreurs centralisee:
  - middleware `errorHandler`
  - classe `AppError` (ou equivalent)
- Mettre a jour `server.js` pour brancher middleware erreur

### Definition of done
- Aucun controller ne contient de logique SQL/metier complexe
- Les erreurs metier sont normalisees (code HTTP + message clair)

---

## Tache 2 - Validation des entrees (dont latitude/longitude)

### Objectif
Securiser les endpoints avec validation systematique avant appel service.

### A faire
- Utiliser `express-validator` sur toutes les routes POST/PUT/PATCH
- Salle: validation stricte champs obligatoires (`nom`, `type_id`, `capacite`, `latitude`, `longitude`)
- Latitude: float entre -90 et 90
- Longitude: float entre -180 et 180
- Email utilisateur: format valide + unicite
- Password: longueur minimum + politique simple

### Definition of done
- Une requete invalide retourne 400 avec details des champs en erreur
- Impossible d'inserer une salle sans coordonnees valides

---

## Tache 3 - Authentification et autorisation

### Objectif
Ajouter login/register robustes et protection des routes sensibles.

### A faire
- Hash du mot de passe avec bcrypt a la creation/update user
- Creer endpoints auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- JWT:
  - generation token
  - middleware `authRequired`
- Roles:
  - middleware `requireRole('admin')`
- Exclure `password` des reponses API

### Definition of done
- Login renvoie token + profil sans mot de passe
- Routes admin inaccessibles sans role admin

---

## Tache 4 - Finaliser module Salles

### Objectif
Completer le CRUD salles et relations photos/equipements.

### A faire
- Ajouter endpoints manquants:
  - `PUT /api/rooms/:id`
  - `DELETE /api/rooms/:id`
- Gerer relation `salle_equipements` (ajout/suppression/maj)
- Gerer galerie (`salle_photos`) en create/update
- Filtres listing salles:
  - ville
  - capacite min
  - type
  - equipements
- Tri listing:
  - prix
  - capacite

### Definition of done
- CRUD salle complet et coherent
- Listing filtrable pour futur ecran carte Leaflet

---

## Tache 5 - Construire module Reservations (priorite haute)

### Objectif
Rendre possible la reservation d'une salle avec verification de disponibilite.

### A faire
- Creer:
  - `src/models/Reservation.js`
  - `src/services/reservationService.js`
  - `src/controllers/reservationController.js`
  - `src/routes/reservationRoutes.js`
- Endpoints minimum:
  - `GET /api/reservations` (admin)
  - `GET /api/reservations/me` (user courant)
  - `POST /api/reservations`
  - `PATCH /api/reservations/:id/cancel`
- Regles metier:
  - `heure_fin` > `heure_debut`
  - pas de chevauchement sur meme salle/date
  - calcul `prix_total` selon type reservation

### Definition of done
- Impossible de creer une reservation en conflit horaire
- Un user ne voit que ses reservations (sauf admin)

---

## Tache 6 - Endpoints pour calendrier frontend

### Objectif
Preparer backend pour affichage agenda (FullCalendar ou equivalent gratuit).

### A faire
- Ajouter endpoint agenda salle:
  - `GET /api/rooms/:id/calendar?start=YYYY-MM-DD&end=YYYY-MM-DD`
- Ajouter endpoint agenda utilisateur:
  - `GET /api/users/me/calendar?start=...&end=...`
- Formater la reponse pour consommation simple frontend:
  - `id`, `title`, `start`, `end`, `status`, `roomId`

### Definition of done
- Le front peut afficher un agenda sans transformation lourde cote client

---

## Tache 7 - Qualite, securite, documentation

### Objectif
Stabiliser le backend avant demarrage front complet.

### A faire
- Ajouter protections basiques:
  - `helmet`
  - `cors` configure
  - rate limiting (optionnel mais recommande)
- Uniformiser reponses API
- Ajouter fichier de tests API (minimum smoke tests)
- Documenter API (README backend ou spec simple)

### Definition of done
- API documentee et testable rapidement
- Parcours critiques verifies (auth, salles, reservations)

---

## 4) Plan d'execution propose (tache par tache)

1. Tache 1 - Structure services + erreurs
2. Tache 2 - Validations globales + latitude/longitude
3. Tache 3 - Auth/JWT/roles
4. Tache 4 - CRUD salles complet
5. Tache 5 - Module reservations complet
6. Tache 6 - Endpoints agenda pour front
7. Tache 7 - durcissement + tests + doc

---

## 5) Notes front liees au backend (pour plus tard)

- Carte: Leaflet est un bon choix gratuit.
- Agenda: FullCalendar version open source est un bon choix.
- Alternative gratuite possible: React Big Calendar.
- Quel que soit le choix front, le backend doit exposer des events normalises (Tache 6).
