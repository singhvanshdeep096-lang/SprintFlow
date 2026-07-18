from typing import Any, Optional
from fastapi import status

def success_response(data: Any = None, message: str = "Success") -> dict:
    return {
        "success": True,
        "message": message,
        "data": data
    }

def error_response(message: str, status_code: int = status.HTTP_400_BAD_REQUEST) -> dict:
    return {
        "success": False,
        "message": message,
        "status_code": status_code
    }

def paginated_response(data: list, total: int, page: int, page_size: int) -> dict:
    return {
        "success": True,
        "data": data,
        "pagination": {
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size
        }
    }
