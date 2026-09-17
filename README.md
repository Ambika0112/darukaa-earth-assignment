# Darukaa Earth

A simple full-stack geospatial dashboard for managing carbon and biodiversity projects.

## Features

- User registration and login
- Project creation
- Geographical site storage using PostGIS
- Polygon/GeoJSON support
- Site area calculation
- React dashboard
- GitHub Actions CI

## Architecture

React frontend -> FastAPI backend -> PostgreSQL/PostGIS

## Database

### users
Stores login information.

### projects
Stores environmental projects.

### sites
Stores sites belonging to projects. The `geometry` column stores a PostGIS polygon.

### site_analytics
Stores historical carbon and biodiversity values.

## Local setup

### Database

```bash
docker compose up -d
```

PostgreSQL is available on port 5433 on the host.

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API docs:

http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Notes

The map integration uses Mapbox and requires a Mapbox access token.

## Trade-offs

The project intentionally uses a simple monolithic FastAPI backend because the challenge is a small application. PostgreSQL and PostGIS are used together so normal project data and geographical data can stay in one database.
