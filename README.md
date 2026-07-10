# Grp-2-module6

# Cocktail Finder App

Cocktail Finder is a full-stack web application built with **React**, **Vite**, **Flask**, **SQLAlchemy**, and **PostgreSQL**. The application allows users to sign up, log in, browse, search, create, edit, and delete cocktail recipes, manage notes, and save favorite drinks tied to their own account.


## Features

* User signup, login, and logout with token-based authentication
* Per-user notes and favorites (each user only sees and manages their own)
* Browse cocktail recipes, seeded from TheCocktailDB API
* Search cocktails by name or category
* View cocktail details
* Add, edit, and delete cocktails
* Add, edit, and delete notes
* Save and remove favorite cocktails
* Responsive user interface
* RESTful Flask API
* PostgreSQL database with Flask-Migrate


## Technologies Used

### Frontend

* React
* React Router DOM
* JavaScript (ES6+)
* CSS
* Vite

### Backend

* Flask
* Flask-CORS
* Flask-SQLAlchemy
* Flask-Migrate
* Flask-Bcrypt

### Database

* PostgreSQL

### External API

* TheCocktailDB API (cocktail seed data)


## Authentication

Authentication is token-based: on signup/login the backend creates a row in a `sessions` table with a random hex token and returns it to the client. The frontend stores the token in `localStorage` and sends it as `Authorization: Bearer <token>` on every request. Passwords are hashed with Flask-Bcrypt and never stored in plain text.

All `/api/cocktails`, `/api/cocktails/:id/notes`, `/api/notes`, and `/api/favorites` routes require a valid token. Write operations (create/update/delete) are scoped to the authenticated user; read operations for cocktails also return cocktails seeded for all users.


## Installation

```bash
git clone <repository-url>
cd Grp-2-module6/cocktail-finder
```

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd cocktail-finder/backend

python3 -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt

python3 -m flask db upgrade
python3 seed.py
python3 app.py
```

Open the React application at the Vite URL (usually `http://localhost:5173`). You'll need to sign up for an account before the app will load any data.


## Project Structure

```text
cocktail-finder/
│
├── backend/
│   ├── views/
│   ├── routes/
│   ├── migrations/
│   ├── instance/
│   ├── app.py
│   ├── config.py
│   ├── extensions.py
│   ├── models.py
│   ├── requirements.txt
│   └── seed.py
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── public/
├── package.json
└── README.md
```

## API Endpoints

All routes below require an `Authorization: Bearer <token>` header, except signup/login.

### Auth

* POST `/api/auth/signup`
* POST `/api/auth/login`
* POST `/api/auth/logout`
* GET `/api/auth/me`

### Cocktails

* GET `/api/cocktails/`
* GET `/api/cocktails/:id`
* POST `/api/cocktails/`
* PUT `/api/cocktails/:id`
* DELETE `/api/cocktails/:id`

### Notes

* GET `/api/cocktails/:cocktailId/notes`
* POST `/api/cocktails/:cocktailId/notes`
* PUT `/api/notes/:id`
* DELETE `/api/notes/:id`

### Favorites

* GET `/api/favorites`
* POST `/api/favorites`
* DELETE `/api/favorites/:id`

## React Concepts

* Functional Components
* React Hooks (`useState`, `useEffect`)
* React Router
* Controlled Forms
* Async/Await
* REST API Integration
* Dynamic Rendering
* Component Reusability

## Authors

* Ouko Sharon
* Robert Tumsifu
* Beatrice Kogei
* Timothy Kangangi
* Cedrick Meka

**React Front-End Development Project © 2026**
