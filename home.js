const tutorialPages = [
    {
        title: "Introduction",
        content: `
            <h3>Welcome to Territory Game!</h3>
            <p>
                This is a turn-based strategy game where two players
                compete to control as many cells as possible.
            </p>
        `
    },
    {
        title: "Game Mechanics",
        content: `
        <div class="row align-items-center g-3">
            <div class="col-7">
                <img src="tutorial1.png"
                     class="img-fluid"
                     alt="Territory expansion example">
            </div>

            <div class="col-5 ps-3">
                <h3>Expand Territory</h3>
                <p>
                    Players take turns clicking an empty cell
                    adjacent to their territory.
                </p>
            </div>
        </div>
    `
    },
    {
        title: "Game Mechanics",
        content: `
        <div class="row align-items-center g-3">
            <div class="col-7">
                <img src="tutorial2.png"
                     class="img-fluid"
                     alt="Territory expansion example">
            </div>

            <div class="col-5 ps-3">
                <h3>Capture Opponent Cells</h3>
            <p>
                An opponent's cell is captured if it is adjacent to at least two of your cells, including at least one newly claimed cell.
            </p>
            </div>
        </div>
    `
    },
    {
        title: "Game Mechanics",
        content: `
        <div class="row align-items-center g-3">
            <div class="col-7">
                <img src="tutorial3.png"
                     class="img-fluid"
                     alt="Territory expansion example">
            </div>

            <div class="col-5 ps-3">
           <h3>Finalize Turn</h3>
            <p>
                All newly claimed cells become part of the player's territory.
            </p>
            </div>
        </div>
    `
    },
    {
        title: "Winning",
        content: `
            <h3>How to Win</h3>
            <p>
                If a player has no valid moves, their turn is skipped. The game ends when neither player can make a valid move. The player controlling the most cells wins!
            </p>
        `
    }
];

let currentPage = 0;

const tutorialDialog = document.getElementById("tutorialDialog");
const tutorialTitle = document.getElementById("tutorialTitle");
const tutorialContent = document.getElementById("tutorialContent");

const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");


function updateTutorial() {
    const page = tutorialPages[currentPage];

    tutorialTitle.textContent =
        `Tutorial (${currentPage + 1}/5) - ${page.title}`;

    tutorialContent.innerHTML = page.content;

    // Hide Previous on first page
    prevPage.style.visibility = currentPage === 0 ? "hidden" : "visible";

    // Change Next to Finish on last page
    nextPage.textContent =
        currentPage === 4 ? "Finish" : "Next";
}


// Previous button
prevPage.addEventListener("click", () => {
    if (currentPage > 0) {
        currentPage--;
        updateTutorial();
    }
});


// Next button
nextPage.addEventListener("click", () => {
    if (currentPage < 4) {
        currentPage++;
        updateTutorial();
    } else {
        tutorialDialog.close();
    }
});


// Reset to first page whenever dialog opens
tutorialDialog.addEventListener("close", () => {
    currentPage = 0;
    updateTutorial();
});

updateTutorial();