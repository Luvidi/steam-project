document.getElementById("singlePlayer").addEventListener("click", () => {
    window.location.href = "game.html?mode=1&bot=1";
});

document.getElementById("twoPlayers").addEventListener("click", () => {
    window.location.href = "game.html?mode=2";
});
