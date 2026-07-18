from fastapi import APIRouter, UploadFile, File

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    return {"filename": file.filename}

@router.get("/{attachment_id}")
async def get_attachment(attachment_id: int):
    return {"id": attachment_id}

@router.delete("/{attachment_id}")
async def delete_attachment(attachment_id: int):
    return {"message": "Deleted"}
