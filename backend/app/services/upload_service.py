import os
import uuid
from fastapi import UploadFile
from app.core.config import settings

class UploadService:
    def __init__(self):
        self.upload_dir = settings.UPLOAD_DIR

    async def upload_file(self, file: UploadFile, subfolder: str = "attachments") -> dict:
        file Extension = file.filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(self.upload_dir, subfolder, filename)
        
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        return {
            "filename": file.filename,
            "file_path": file_path,
            "file_size": len(content)
        }

    def delete_file(self, file_path: str) -> bool:
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
        return False
