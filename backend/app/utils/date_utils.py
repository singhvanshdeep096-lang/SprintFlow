from datetime import datetime, timedelta
from typing import Optional

def format_datetime(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%d %H:%M:%S")

def get_current_datetime() -> datetime:
    return datetime.utcnow()

def add_days(dt: datetime, days: int) -> datetime:
    return dt + timedelta(days=days)

def add_hours(dt: datetime, hours: int) -> datetime:
    return dt + timedelta(hours=hours)

def is_future_date(dt: datetime) -> bool:
    return dt > datetime.utcnow()

def is_past_date(dt: datetime) -> bool:
    return dt < datetime.utcnow()
