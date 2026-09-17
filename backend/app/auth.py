from datetime import datetime, timedelta
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import hashlib

SECRET_KEY = "darukaa-demo-secret"
ALGORITHM = "HS256"


def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()


def check_password(password, hashed_password):
    return hashlib.sha256(password.encode()).hexdigest() == hashed_password


def create_token(email):
    data = {
        "sub": email,
        "exp": datetime.utcnow() + timedelta(hours=12)
    }

    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("sub")

        if not email:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        return email

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )