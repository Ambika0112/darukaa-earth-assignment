from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://darukaa:darukaa@localhost:5433/darukaa"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
