from app.repositories.board_repository import BoardRepository

class BoardService:
    def __init__(self, db):
        self.board_repo = BoardRepository(db)

    def get_board(self, board_id: int):
        return self.board_repo.get_board(board_id)

    def get_boards(self, project_id: int, skip: int = 0, limit: int = 100):
        return self.board_repo.get_boards(project_id, skip, limit)

    def create_board(self, board_data: dict):
        return self.board_repo.create_board(board_data)

    def update_board(self, board_id: int, board_data: dict):
        return self.board_repo.update_board(board_id, board_data)

    def delete_board(self, board_id: int):
        return self.board_repo.delete_board(board_id)
