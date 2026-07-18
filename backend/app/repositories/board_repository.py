from sqlalchemy.orm import Session
from app.models.board import Board
from typing import Optional, List

class BoardRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_board(self, board_id: int) -> Optional[Board]:
        return self.db.query(Board).filter(Board.id == board_id).first()

    def get_boards(self, project_id: int, skip: int = 0, limit: int = 100) -> List[Board]:
        return self.db.query(Board).filter(Board.project_id == project_id).offset(skip).limit(limit).all()

    def create_board(self, board_data: dict) -> Board:
        board = Board(**board_data)
        self.db.add(board)
        self.db.commit()
        self.db.refresh(board)
        return board

    def update_board(self, board_id: int, board_data: dict) -> Optional[Board]:
        board = self.get_board(board_id)
        if board:
            for key, value in board_data.items():
                setattr(board, key, value)
            self.db.commit()
            self.db.refresh(board)
        return board

    def delete_board(self, board_id: int) -> bool:
        board = self.get_board(board_id)
        if board:
            self.db.delete(board)
            self.db.commit()
            return True
        return False
