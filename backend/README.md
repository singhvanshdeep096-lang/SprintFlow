# SprintFlow Backend

FastAPI backend for SprintFlow project management application.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Copy env.example to env:
```bash
cp env.example env
```

3. Run migrations:
```bash
alembic upgrade head
```

4. Run the server:
```bash
uvicorn app.main:app --reload
```

## API Documentation

Once running, visit http://localhost:8000/docs for interactive API documentation.
