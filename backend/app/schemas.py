from pydantic import BaseModel
from typing import Optional, Any


class UserCreate(BaseModel):
    email: str
    password: str


class LoginData(BaseModel):
    email: str
    password: str


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None


class ProjectResponse(ProjectCreate):
    id: int

    class Config:
        from_attributes = True


class SiteCreate(BaseModel):
    project_id: int
    name: str
    description: Optional[str] = None
    geometry: Any


class SiteResponse(BaseModel):
    id: int
    project_id: int
    name: str
    description: Optional[str]
    area_hectares: float

    class Config:
        from_attributes = True
