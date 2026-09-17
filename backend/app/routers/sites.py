from fastapi import APIRouter, Depends, HTTPException
import json
from sqlalchemy.orm import Session
from geoalchemy2.shape import from_shape
from shapely.geometry import shape
from sqlalchemy import func

from app.auth import get_current_user

from ..database import get_db
from ..models import Site, Project
from ..schemas import SiteCreate

router = APIRouter(prefix="/sites", tags=["Sites"])

@router.get("/")
def get_all_sites(db: Session = Depends(get_db), current_user: int = Depends(get_current_user)):
    sites = (
        db.query(
            Site.id,
            Site.project_id,
            Site.name,
            Site.description,
            (
                func.ST_Area(
                    func.ST_Transform(Site.geometry, 6933)
                ) / 10000
            ).label("area_hectares"),
            func.ST_AsGeoJSON(Site.geometry).label("geometry")
        )
        .all()
    )

    return [
        {
            "id": site.id,
            "project_id": site.project_id,
            "name": site.name,
            "description": site.description,
            "area_hectares": round(float(site.area_hectares), 2),
            "geometry": json.loads(site.geometry)
        }
        for site in sites
    ]
    
    
@router.post("/")
def create_site(data: SiteCreate, db: Session = Depends(get_db), current_user: int = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == data.project_id).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    polygon = shape(data.geometry)

    if polygon.geom_type != "Polygon":
        raise HTTPException(status_code=400, detail="Only Polygon geometry is allowed")

    site = Site(
        project_id=data.project_id,
        name=data.name,
        description=data.description,
        geometry=from_shape(polygon, srid=4326)
    )

    db.add(site)
    db.commit()
    db.refresh(site)

    area = db.query(
        func.ST_Area(
            func.ST_Transform(site.geometry, 6933)
        )
    ).scalar()

    site.area_hectares = round(area / 10000, 2)
    db.commit()

    return {
        "id": site.id,
        "project_id": site.project_id,
        "name": site.name,
        "description": site.description,
        "area_hectares": site.area_hectares
    }

@router.get("/project/{project_id}")
def get_sites(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user)
):
    sites = (
        db.query(
            Site.id,
            Site.name,
            Site.description,
            (
                func.ST_Area(
                    func.ST_Transform(Site.geometry, 6933)
                ) / 10000
            ).label("area_hectares"),
            func.ST_AsGeoJSON(Site.geometry).label("geometry")
        )
        .filter(Site.project_id == project_id)
        .all()
    )

    return [
        {
            "id": site.id,
            "name": site.name,
            "description": site.description,
            "area_hectares": round(float(site.area_hectares), 2),
            "geometry": json.loads(site.geometry)
        }
        for site in sites
    ]