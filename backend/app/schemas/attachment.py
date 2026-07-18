from pydantic import BaseModel
from datetime import datetime

class AttachmentBase(BaseModel):
    filename: str
    file_size: int

class AttachmentResponse(AttachmentBase):
    id: int
    file_path: str
    task_id: int
    uploaded_by: int
    created_at: datetime

    class Config:
        from_attributes = True
