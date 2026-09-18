from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import auth, projects, sites

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Darukaa Earth API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"
        "https://darukaa-earth-assignment-bay.vercel.app",],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(sites.router)


@app.get("/health")
def health():
    return {"status": "ok"}