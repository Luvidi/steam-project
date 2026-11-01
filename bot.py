import numpy as np
import torch
from model import Model
from game import Game


class Bot1:
    def __init__(self):
        self.model = Model()
        self.model.load_state_dict(
            torch.load("models/model_100000.pt", weights_only=True)
        )
        self.model.eval()
        self.env = Game()

    def choose_action(self, board, player):
        self.env.board = np.array(board, dtype=np.float32).reshape((8, 8))
        self.env.player = player

        state = torch.tensor(
                    board,
                    dtype=torch.float32,
                ).unsqueeze(0) * player

        with torch.no_grad():
            q_values = self.model(state).squeeze(0).cpu().numpy()

        actions = self.env.get_actions()

        action = max(actions, key=lambda a: q_values[a])

        return int(action)


class Bot2:
    def __init__(self):
        self.env = Game()

    def reset(self, board, player):
        self.env.board = board.copy()
        self.env.player = player
        self.env.done = False

    def choose_action(self, board, player):
        board = np.array(board, dtype=np.float32).reshape((8, 8))

        self.reset(board, player)
        actions = self.env.get_actions()
        np.random.shuffle(actions)

        best = None
        best_score = -1e9

        for action in actions:
            self.reset(board, player)
            self.env.move(action)

            score = self.env.board.sum() * player

            if self.env.done:
                score += 100 * player

            if score > best_score:
                best_score = score
                best = action

        return int(best)
