from pydantic import BaseModel, Field
from typing import Optional

class CameraCreate(BaseModel):
    source_name: str
    stream_type: str
    stream: str
    location: Optional[str] = None

    class Config:
        from_attributes = True  # For SQLAlchemy compatibility 