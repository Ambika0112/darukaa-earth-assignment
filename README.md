
# Darukaa.Earth

Darukaa.Earth is a full-stack web application for managing carbon and biodiversity projects and their geographical sites.

The main idea is simple:

- Create a project
- Add sites to the project by drawing polygons on a map
- Store the geographical data in PostgreSQL/PostGIS
- View all sites on a map
- Open a site and view its analytics

## Live Demo

Frontend: https://darukaa-earth-assignment-bay.vercel.app

Backend: https://darukaa-earth-assignment-api.onrender.com

API Docs: https://darukaa-earth-assignment-api.onrender.com/docs

## Tech Stack

### Frontend

- React
- Vite
- Mapbox GL JS
- Mapbox Draw
- Chart.js
- Axios

### Backend

- Python
- FastAPI
- SQLAlchemy
- JWT Authentication

### Database

- PostgreSQL
- PostGIS

### Deployment

- Vercel for frontend
- Render for backend and database
- GitHub Actions for CI

## Main Features

- User registration and login
- JWT based authentication
- Create projects
- View projects
- Add multiple sites to a project
- Draw site boundaries using Mapbox
- Store polygons using PostGIS
- Calculate site area in hectares
- View all saved sites on a map
- View site analytics using charts

## How It Works

The frontend communicates with the FastAPI backend using REST APIs.

The backend stores normal application data in PostgreSQL. Site polygons are stored using PostGIS.

When a user draws a polygon on the map, the polygon is sent to the backend as GeoJSON. The backend converts it into a PostGIS geometry and stores it in the database.

The site area is calculated from the stored geometry.

For analytics, the project uses demo/mock data to show carbon and biodiversity changes over time. The challenge allows the use of mock datasets.

## Database

The main tables are:

### users

Stores registered users.

- id
- email
- password_hash

### projects

Stores projects.

- id
- name
- description

### sites

Stores geographical sites.

- id
- project_id
- name
- description
- geometry
- area_hectares

### site_analytics

Stores analytics data for sites.

- id
- site_id
- year
- carbon
- biodiversity

A project can have multiple sites.

## Project Structure

```text
darukaa-earth/
│
├── backend/
│   └── app/
│       ├── auth.py
│       ├── database.py
│       ├── models.py
│       ├── schemas.py
│       ├── main.py
│       └── routers/
│           ├── auth.py
│           ├── projects.py
│           └── sites.py
│
├── frontend/
│   └── src/
│       ├── main.jsx
│       ├── Map.jsx
│       ├── SiteDetails.jsx
│       └── style.css
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docker-compose.yml
└── README.md
```
