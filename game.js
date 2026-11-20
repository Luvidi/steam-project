async function chooseAction() {
    const response = await fetch(
        "http://127.0.0.1:8000/choose_action",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                board: board,
                player: player
            })
        }
    );

    if (!response.ok) {
        throw new Error(
            `API error: ${response.status}`
        );
    }

    const result = await response.json();

    return result.action;
}

let board, changed;

let player = -1;
let gameOver = false;
let allowMove = true;

const params = new URLSearchParams(window.location.search);
const p1Bot = +params.get("player1"), p2Bot = +params.get("player2");
const H = +params.get("h"), W = +params.get("w");

const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));

function resetGame() {
    board = Array.from(
        { length: H },
        () => Array(W).fill(0)
    );

    changed = Array.from(
        { length: H },
        () => Array(W).fill(0)
    );

    board[0][0] = -1;

    board[H - 1][W - 1] = 1;

    player = -1;
    gameOver = false;

    render();

    if (p1Bot) {
        botTurn();
    }
}

const cells = [];

function initBoard() {
    const boardElement = document.getElementById("board");

    boardElement.style.gridTemplateColumns =
        `repeat(${W}, 1fr)`;

    for (let row = 0; row < H; row++) {
        cells[row] = [];

        for (let col = 0; col < W; col++) {
            const cell = document.createElement("div");

            cell.className = "cell";

            cell.addEventListener("click", () => {
                makeMove(row, col);
            });

            cells[row][col] = cell;
            boardElement.appendChild(cell);
        }
    }
}

function render(isTransition = false) {
    for (let row = 0; row < H; row++) {
        for (let col = 0; col < W; col++) {
            const cell = cells[row][col];
            const value = board[row][col];

            cell.className = "cell";

            cell.classList.toggle(
                "player1",
                value === -1 || (value === 3 && player === -1)
            );

            cell.classList.toggle(
                "player2",
                value === 1 || (value === 3 && player === 1)
            );

            cell.classList.toggle("changed", value === 3);

            const active =
                !isTransition &&
                value === 0 &&
                countAdj(row, col, player);
            if (active) {
                console.log(`${row} ${col}`);
            }
            cell.classList.toggle("active", active);
        }
    }

    updateInfo();
}

function countAdj(row, col, player) {
    const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ];

    let count = 0;

    for (const [dr, dc] of directions) {
        const r = row + dr;
        const c = col + dc;

        if (
            r >= 0 &&
            r < H &&
            c >= 0 &&
            c < W &&
            board[r][c] === player
        ) {
            count++;
        }
    }

    return count;
}

function getBoard() {
    return board
        .flat();
}


async function botTurn() {
    // const board = getBoard();

    // const action = await chooseAction(board, player);
    const action = await chooseAction();

    const row = Math.floor(action / W);
    const col = action % W;

    makeMove(row, col);
}


async function makeMove(row, col) {
    console.log(`Move ${row} ${col}`);
    if (gameOver || board[row][col] || !countAdj(row, col, player) || !allowMove) {
        console.log("Invalid");
        return;
    }
    allowMove = false;

    board[row][col] = 3;

    const conversions = resolveConversions();

    for (const conversion of conversions) {
        board[conversion.row][conversion.col] = -player;
    }

    board[row][col] = 3;
    render(true);
    await sleep(200);

    for (const conversion of conversions) {
        board[conversion.row][conversion.col] = 3;
        render(true);
        await sleep(200);
    }

    board[row][col] = player;
    for (const conversion of conversions) {
        board[conversion.row][conversion.col] = player;
    }

    const conversions2 = checkGameOver();

    if (!gameOver) {
        player = -player;
    }

    for (const conversion of conversions2) {
        board[conversion.row][conversion.col] = 0;
    }

    for (const conversion of conversions2) {
        board[conversion.row][conversion.col] = conversion.owner;
        render(true);
        await sleep(200);
    }

    if (!gameOver && (player == -1 && p1Bot || player == 1 && p2Bot)) {
        render(true);
        await sleep(200);
        botTurn();
    } else {
        render();
    }

    allowMove = true;
}


function resolveConversions() {
    let changed = true;
    const conversions = [];

    while (changed) {
        changed = false;

        for (let row = 0; row < H; row++) {
            for (let col = 0; col < W; col++) {
                if (board[row][col] !== -player) {
                    continue;
                }

                const count1 = countAdj(row, col, player), count2 = countAdj(row, col, 3);

                if (count1 + count2 >= 2 && count2) {
                    conversions.push({
                        row: row,
                        col: col,
                    });
                    board[row][col] = 3;
                    changed = true;
                }
            }
        }
    }

    return conversions;
}

function checkGameOver() {
    let ss = 0;
    let empty = 0;

    let found1 = false, found2 = false;
    for (let row = 0; row < H; row++) {
        for (let col = 0; col < W; col++) {
            if (board[row][col] === -1) {
                if (countAdj(row, col, 0)) {
                    found1 = true;
                }
            } else if (board[row][col] === 1) {
                if (countAdj(row, col, 0)) {
                    found2 = true;
                }
            }
        }
    }

    const conversions = [];

    if (!found1) {
        for (let row = 0; row < H; row++) {
            for (let col = 0; col < W; col++) {
                if (board[row][col] === 0) {
                    conversions.push({
                        row: row,
                        col: col,
                        owner: 1,
                    });
                    board[row][col] = 1;
                }
            }
        }
    }

    if (!found2) {
        for (let row = 0; row < H; row++) {
            for (let col = 0; col < W; col++) {
                if (board[row][col] === 0) {
                    conversions.push({
                        row: row,
                        col: col,
                        owner: -1,
                    });
                    board[row][col] = -1;
                }
            }
        }
    }

    for (let row = 0; row < H; row++) {
        for (let col = 0; col < W; col++) {
            if (board[row][col] === 0) {
                empty++;
            } else {
                ss += board[row][col];
            }
        }
    }

    if (empty === 0) {
        gameOver = true;
    }

    return conversions;
}


function updateInfo() {
    let player1 = 0;
    let player2 = 0;

    for (let row = 0; row < H; row++) {
        for (let col = 0; col < W; col++) {

            if (board[row][col] === -1) {
                player1++;
            }

            if (board[row][col] === 1) {
                player2++;
            }
        }
    }

    const p1Score = document.getElementById("player1Score");
    const p2Score = document.getElementById("player2Score");
    const p1Box = document.getElementById("player1Box");
    const p2Box = document.getElementById("player2Box");

    p1Score.textContent = player1;
    p2Score.textContent = player2;

    if (gameOver) {
        p1Box.classList.toggle("border-black", false);
        p2Box.classList.toggle("border-black", false);
    }
    else {
        p1Box.classList.toggle("border-black", player == -1);
        p2Box.classList.toggle("border-black", player == 1);
    }
}

initBoard();
resetGame();