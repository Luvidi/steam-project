from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import torch

from model import Model

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

device = torch.device("cpu")

model = Model().to(device)
model.load_state_dict(
    torch.load(
        "models/model_100000.pt",
        map_location=device,
        weights_only=True
    )
)
model.eval()


class MoveRequest(BaseModel):
    state: list[float] = Field(min_length=64, max_length=64)
    actions: list[int] = Field(min_length=1, max_length=64)


@app.post("/choose_action")
def choose_action(request: MoveRequest):
    state = torch.tensor(
        request.state,
        dtype=torch.float32,
        device=device
    ).unsqueeze(0)

    # Calculate Q-values without updating the model
    with torch.no_grad():
        q_values = model(state).squeeze(0).cpu().numpy()

    # Restrict selection to legal moves
    actions = request.actions

    if any(a < 0 or a >= len(q_values) for a in actions):
        return {"error": "Invalid action index"}

    action = max(actions, key=lambda a: q_values[a])

    return {
        "action": int(action),
        "q_values": q_values.tolist()
    }


@app.get("/")
def home():
    return {"status": "DQN server is running"}
