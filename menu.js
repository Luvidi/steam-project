const startButton = document.getElementById("start");
const warningMessage = document.getElementById("warningMessage");

startButton.addEventListener("click", function() {

    const player1Type = +document.getElementById("player1Type").value;
    const player2Type = +document.getElementById("player2Type").value;
    const boardSize = document.getElementById("boardType").value.split("x");
    const h=boardSize[0], w=boardSize[1];

    if (player1Type && player2Type) {
        warningMessage.classList.remove("d-none");
        return;
    }

    warningMessage.classList.add("d-none");
    console.log(boardSize);
    const params = new URLSearchParams({
        player1: player1Type,
        player2: player2Type,
        h: h,
        w: w
    });

    window.location.href = `game.html?${params.toString()}`;
});