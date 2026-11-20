const startButton = document.getElementById("start");
const warningMessage = document.getElementById("warningMessage");

const boardType = document.getElementById("boardType");
const customBoard = document.getElementById("customBoard");

const boardHeight = document.getElementById("boardHeight");
const boardWidth = document.getElementById("boardWidth");

let H = 6, W = 6;

function initBoard() {
    const boardElement = document.getElementById("board");

    boardElement.innerHTML = "";

    const cellSize = Math.min(250 / H, 350 / W);

    boardElement.style.setProperty("--cell-size", `${cellSize}px`);

    boardElement.style.gridTemplateColumns =
        `repeat(${W}, ${cellSize}px)`;

    boardElement.style.gridTemplateRows =
        `repeat(${H}, ${cellSize}px)`;

    for (let row = 0; row < H; row++) {
        for (let col = 0; col < W; col++) {
            const cell = document.createElement("div");

            cell.className = "cell";

            cell.addEventListener("click", () => {
                makeMove(row, col);
            });

            if (row === 0 && col === 0) {
                cell.classList.add("player1");
            }

            if (row === H - 1 && col === W - 1) {
                cell.classList.add("player2");
            }

            boardElement.appendChild(cell);
        }
    }
}

initBoard(H, W);

boardType.addEventListener("change", () => {
    if (boardType.value === "custom") {
        customBoard.classList.remove("d-none");
        H = +boardHeight.value;
        W = +boardWidth.value;
    } else {
        const boardSize = boardType.value.split("x");
        H = +boardSize[0], W = +boardSize[1];

        customBoard.classList.add("d-none");
    }
    initBoard();
});

boardHeight.addEventListener("input", () => {
    H = +boardHeight.value;
    H = Math.min(20, Math.max(H, 4));

    initBoard();
});

boardHeight.addEventListener("change", () => {
    boardHeight.value = H;
});

boardWidth.addEventListener("input", () => {
    W = +boardWidth.value;
    W = Math.min(20, Math.max(W, 4));

    initBoard();
});

boardWidth.addEventListener("change", () => {
    boardWidth.value = W;
});

startButton.addEventListener("click", function () {
    const player1Type = +document.getElementById("player1Type").value;
    const player2Type = +document.getElementById("player2Type").value;

    if (player1Type && player2Type) {
        warningMessage.classList.remove("d-none");
        return;
    }

    warningMessage.classList.add("d-none");
    
    const params = new URLSearchParams({
        player1: player1Type,
        player2: player2Type,
        h: H,
        w: W
    });

    window.location.href = `game.html?${params.toString()}`;
});