import torch
from model import Model


class Bot1:
    def __init__(self):
        self.model = Model()
        self.model.load_state_dict(
            torch.load("models/model_100000.pt", weights_only=True)
        )
        self.model.eval()

    def choose_action(self, request):
        state = torch.tensor(
                    request.board,
                    dtype=torch.float32,
                ).unsqueeze(0) * request.player

        with torch.no_grad():
            q_values = self.model(state).squeeze(0).cpu().numpy()

        actions = request.actions

        action = max(actions, key=lambda a: q_values[a])

        return int(action)
