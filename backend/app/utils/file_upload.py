import os
from typing import List

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf', 'doc', 'docx', 'txt', 'zip'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def is_allowed_extension(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def is_valid_file_size(file_size: int) -> bool:
    return file_size <= MAX_FILE_SIZE

def get_file_extension(filename: str) -> str:
    return filename.rsplit('.', 1)[1].lower() if '.' in filename else ''

def sanitize_filename(filename: str) -> str:
    import re
    filename = re.sub(r'[^\w\s.-]', '', filename)
    return filename.strip()
