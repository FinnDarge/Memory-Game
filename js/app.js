//Global Variables
const deck = document.querySelector(".deck");
let moves = 0;
let digits;
let matchedCards = 0;
let second = 0;
let minute = 0;
let timer = document.querySelector(".timer");
let interval;
let flippedCards = [];

/*
 * Create a list that holds all of your cards
 */
const cards = [
    "fa-diamond",
    "fa-diamond",
    "fa-paper-plane-o",
    "fa-paper-plane-o",
    "fa-anchor",
    "fa-anchor",
    "fa-bolt",
    "fa-bolt",
    "fa-cube",
    "fa-cube",
    "fa-leaf",
    "fa-leaf",
    "fa-bicycle",
    "fa-bicycle",
    "fa-bomb",
    "fa-bomb"
];

// function to generate the card element in html
function makeCard(card) {
    return `<li class="card"><i class="fa ${card}"></i></li>`;
}

//function to initialize the game
function initGame() {
    shuffle(cards);
    const deck = document.querySelector(".deck");
    deck.innerHTML = "";
    const cardHTML = cards.map(function (card) {
        return makeCard(card);
    });
    deck.innerHTML = cardHTML.join("");
}

initGame();

//function to add moves and start the timer after first move
function addMove() {
    moves++;
    const movesText = document.querySelector(".moves");
    movesText.innerHTML = moves;
    checkScore();
    if (moves == 1) {
        startTimer();
    }
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

deck.addEventListener("click", event => {
    const clickedCard = event.target;
    if (clickedCard.classList.contains("card") && flippedCards.length < 2 && !flippedCards.includes(clickedCard) && !clickedCard.classList.contains("match")) {
        flipCard(clickedCard);
        flippedCards.push(clickedCard);
        if (flippedCards.length === 2) {
            checkForMatch();
            addMove();
            endGame();
        }
    }
});

function flipCard(clickTarget) {
    clickTarget.classList.toggle("open");
    clickTarget.classList.toggle("show");
}

//check if there is a match and add cards to toggledCards
function checkForMatch() {
    if (
        flippedCards[0].firstElementChild.className ===
        flippedCards[1].firstElementChild.className
    ) {
        flippedCards[0].classList.toggle("match");
        flippedCards[1].classList.toggle("match");
        flippedCards = [];
        matchedCards++;
    } else {
        setTimeout(() => {
            flipCard(flippedCards[0]);
            flipCard(flippedCards[1]);
            flippedCards = [];
        }, 800);
    }
}

//Timer with count of minutes and seconds
function startTimer() {
    interval = setInterval(function () {
        timer.innerHTML = minute + " mins " + second + " secs";
        second++;
        if (second == 60) {
            minute++;
            second = 0;
        }
    }, 1000);
}

// Star Rating after each given count of moves there will be a star removed from the panel
function checkScore() {
    if (moves === 9) {
        hideStar();
    }
    else if (moves === 17) {
        hideStar();
    }
}

//hiding the star that doesen´t have the display none but break afterwards so just one star gets deleted
function hideStar() {
    const starList = document.querySelectorAll(".stars li");
    for (star of starList) {
        if (star.style.display !== "none") {
            star.style.display = "none";
            break
        }
    }
}

//same as hideStar but this time all the stars without the display none get counted.
function starCounter() {
    const stars = document.querySelectorAll(".stars li");
    let starModal = 0;
    for (star of stars) {
        if (star.style.display !== "none") {
            starModal++;
        }
    }
    if (starModal > 1) {
        return starModal + " stars";
    }
    else {
        return starModal + " star";
    }
}

//ending the game when all cards are matched, stop the timer and toggle the modal with input
function endGame() {
    if (matchedCards === 8) {
        clearInterval(interval);
        toggleModal();
        modalInput();
    }
}

//resetting the game by refreshing the page
function resetGame() {
    location.reload(true)
}

//reset the game with the button in the panel
document.querySelector(".restart").addEventListener("click", resetGame);

//Modal
let modal = document.querySelector(".modal");

function toggleModal() {
    modal.classList.toggle("show-modal");
}

function modalInput() {
    const timestamp = document.querySelector(".timestamp");
    timestamp.innerHTML = "Time = " + minute + " minutes " + second + " seconds";

    const ratingModal = document.querySelector(".rating");
    ratingModal.innerHTML = "Your Score = " + starCounter();

    const movesModal = document.querySelector(".moveCounter");
    movesModal.innerHTML = "Moves = " + moves;
}

document.querySelector(".restartButton").addEventListener("click", resetGame);
document.querySelector(".closeButton").addEventListener("click", toggleModal);
