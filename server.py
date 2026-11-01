from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import torch

from bot import Bot1, Bot2
from game import Game

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MoveRequest(BaseModel):
    board: list[float] = Field(min_length=64, max_length=64)
    player: int = Field(ge=-1, le=1)


bot = Bot2()


@app.post("/choose_action")
def choose_action(request: MoveRequest):
    action = bot.choose_action(request)

    return {
        "action": action,
    }


@app.get("/")
def home():
    return {"status": "DQN server is running"}
