import numpy as np
from scipy.signal import convolve2d

class Game:
    def __init__(self, size=8):
        self.size = size
        self.dd = [(0, -1), (0, 1), (-1, 0), (1, 0)]
        self.nb = np.array([[0, 1, 0], [1, 0, 1], [0, 1, 0]])
        self.reset()

    def reset(self):
        self.board = np.zeros((self.size, self.size), np.float32)
        self.board[0, 0] = -1
        self.board[-1, -1] = 1
        self.player = -1
        self.done = False

    def check_reward(self):
        if not (
            (self.board == 0) & (convolve2d(self.board == 1, self.nb, mode="same") > 0)
        ).any():
            self.board[self.board == 0] = -1
        if not (
            (self.board == 0) & (convolve2d(self.board == -1, self.nb, mode="same") > 0)
        ).any():
            self.board[self.board == 0] = 1
        if (self.board != 0).all():
            self.done = 1
            return self.board.sum()

        return 0

    def get_actions(self):
        rr, cc = np.where(
            (self.board == 0)
            & (convolve2d(self.board == self.player, self.nb, mode="same") > 0)
        )
        return self.size * rr + cc

    def get_state(self):
        return (self.board * self.player).flatten().astype(np.float32)

    def move(self, action):
        assert action in self.get_actions()

        row, col = divmod(action, self.size)

        self.board[row, col] = 2

        cnt1 = convolve2d((self.board == self.player), self.nb, mode="same")
        cnt2 = np.zeros((self.size, self.size))

        st = [(row, col)]
        while st:
            r, c = st.pop()
            for dx, dy in self.dd:
                r2, c2 = r + dx, c + dy
                if (
                    0 <= r2
                    and r2 < self.size
                    and 0 <= c2
                    and c2 < self.size
                    and self.board[r2, c2] == -self.player
                ):
                    cnt2[r2, c2] += 1
                    if cnt1[r2, c2] + cnt2[r2, c2] >= 2:
                        self.board[r2, c2] = 2
                        st.append((r2, c2))

        self.board[self.board == 2] = self.player

        reward = self.check_reward() * self.player

        if self.done:
            return reward

        self.player = -self.player

        return 0

    def print(self):
        symbols = "⬜🟥🟦"
        for row in self.board:
            print(" ".join(symbols[int(cell)] for cell in row))
        print(flush=True)