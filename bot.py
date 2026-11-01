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
    def __init__(self, depth=2, shuffle=False):
        self.env = Game()
        self.depth = depth
        self.shuffle = shuffle

    def reset(self, board, player):
        self.env.board = board.copy()
        self.env.player = player
        self.env.done = False

    def evaluate(self, player):
        score = self.env.board.sum() * player

        if self.env.done:
            if score > 0:
                score += 100
            elif score < 0:
                score -= 100

        return score

    def minimax(self, board, player, depth):
        self.reset(board, player)

        actions = self.env.get_actions()

        if self.shuffle:
            np.random.shuffle(actions)

        best_action = None
        best_score = -float("inf")

        for action in actions:
            self.reset(board, player)
            self.env.move(action)

            if self.env.done or depth == 1:
                score = self.evaluate(player)
            else:
                _, score = self.minimax(self.env.board.copy(), -player, depth - 1)
                score = -score

            if score > best_score:
                best_score = score
                best_action = action
        return best_action, best_score

    def choose_action(self, board, player):
        board = np.array(board, dtype=np.float32).reshape((8, 8))

        best_action, _ = self.minimax(board, player, self.depth)

        return int(best_action)