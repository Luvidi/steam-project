const SIZE = 8;

// 0 = empty
// 1 = Player 1
// 2 = Player 2
let board;

let player = 1;
let gameOver = false;

function resetGame() {
    board = Array.from(
        { length: SIZE },
        () => Array(SIZE).fill(0)
    );

    board[0][0] = 1;

    board[SIZE - 1][SIZE - 1] = 2;

    player = 1;
    gameOver = false;

    render();
}


function render() {
    const boardElement = document.getElementById("board");

    boardElement.innerHTML = "";

    boardElement.style.gridTemplateColumns =
        `repeat(${SIZE}, 1fr)`;

    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {

            const cell = document.createElement("div");

            cell.className = "cell";

            if (board[row][col] === 1) {
                cell.classList.add("player1");
            }
            else if (board[row][col] === 2) {
                cell.classList.add("player2");
            }

            cell.addEventListener("click", () => {
                makeMove(row, col);
            });

            boardElement.appendChild(cell);
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
            r < SIZE &&
            c >= 0 &&
            c < SIZE &&
            board[r][c] === player
        ) {
            count++;
        }
    }

    return count;
}

function makeMove(row, col) {
    if (gameOver || board[row][col]) {
        return;
    }

    if (!countAdj(row, col, player)) {
        return;
    }

    board[row][col] = 3;

    resolveConversions();

    checkGameOver();

    if (!gameOver) {
        player = 3 - player;
    }

    render();
}


function resolveConversions() {
    let changed = true;
    while (changed) {
        changed = false;

        const conversions = [];

        for (let row = 0; row < SIZE; row++) {
            for (let col = 0; col < SIZE; col++) {
                if (board[row][col] !== 3 - player) {
                    continue;
                }

                const count1 = countAdj(row, col, player), count2 = countAdj(row, col, 3);

                if (count1 + count2 >= 2 && count2) {
                    conversions.push({
                        row: row,
                        col: col,
                        newOwner: 3
                    });
                    changed = true;
                }
            }
        }

        for (const conversion of conversions) {
            board[conversion.row][conversion.col] = conversion.newOwner;
        }
    }
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            if (board[row][col] === 3) {
                board[row][col] = player;
            }
        }
    }
}

function checkGameOver() {
    let player1 = 0;
    let player2 = 0;
    let empty = 0;

    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {

            if (board[row][col] === 1) {
                player1++;
            }
            else if (board[row][col] === 2) {
                player2++;
            }
            else {
                empty++;
            }
        }
    }

    if (empty === 0) {
        gameOver = true;

        if (player1 > player2) {
            alert("Player 1 wins!");
        }
        else if (player2 > player1) {
            alert("Player 2 wins!");
        }
        else {
            alert("Draw!");
        }
    }
}


function updateInfo() {

    let player1 = 0;
    let player2 = 0;

    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {

            if (board[row][col] === 1) {
                player1++;
            }

            if (board[row][col] === 2) {
                player2++;
            }
        }
    }

    const info = document.getElementById("info");

    if (gameOver) {
        info.innerHTML =
            `Player 1: ${player1} |
                Player 2: ${player2}`;
    }
    else {
        info.innerHTML =
            `Player 1: ${player1} |
                Player 2: ${player2}
                &nbsp;&nbsp;—&nbsp;&nbsp;
                <strong>Player ${player}'s turn</strong>`;
    }
}

resetGame();