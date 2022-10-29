// Great video tutorial I followed: 
// https://www.youtube.com/watch?v=P2TcQ3h0ipQ&t=39s&ab_channel=freeCodeCamp.org
// Objectives:
/* 
    1) Create variables, ability to click a square and show a mark
    2) Add logic to determine the winner and show winning combination
    3) Create basic AI and add code to notify who the winner is
    4) Create the logic for an unbeatable AI using the Minimax algorithm
*/
let origBoard;
const huPlayer = '0';
const aiPlayer = 'X';
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2],
]

// The cells variable stores a reference to each element with the cell class
// in this example it's all the td elements
const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
    document.querySelector(".endgame").style.display = "none";
    // This is a fancy way to make the array be every number from 0-9
    // It will create an array of 9 elements, just the keys for the element, 
    // and create another array from that element.
    // Does that make sense?
    origBoard = Array.from(Array(9).keys());
    // console.log(origBoard);
    // Remove all the X's and O's from the board
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        // Everytime a box is clicked, call turnClick function
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
    // if the id is a number, nobody has played this spot
    if (typeof origBoard[square.target.id] == 'number') {
        // log the id of whatever sqaure was clicked.
        // console.log(square.target.id);
        // the turn function can't be called outright because
        // it can be called by the huPlayer and aiPlayer.
        turn(square.target.id, huPlayer)
        // ai turn
        if (!checkTie()) turn(bestSpot(), aiPlayer);
    }

}

function turn(squareId, player) {
    // This will show which player took a turn in whatever spot
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    // check if the game has been won
    let gameWon = checkWin(origBoard, player);
    // if game is won, game over
    if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
    // Fancy way to find all the places on the board that have
    // been played in
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        // fancy way of saying has the player played in every spot
        // that counts as a win from the winCombos array
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    // highlight all the squares that are apart of the
    // winning combo and make sure player cant click anymore
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player == huPlayer ? "blue" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose!");
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;

}

function emptySquares() {
    return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
    return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
    // if every square is filled and no one has won, it's a tie!
    if (emptySquares().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!");
        return true;
    }
    return false;
}

// Great article explaining Minimax:
// https://www.freecodecamp.org/news/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37
// Brief explanation:
/*
A Minimax algorithm can be best defined as a recursive function that does the following things:
1) Return a value if a terminal state is found (+10, 0, -10)
2) Go through available spots on the board
3) Call the minimax function on each available spot (recursion)
evaluate returning values from function calls
4) and return the best value
*/

function minimax(newBoard, player) {
    // algorithm makes a list of empty spots
    var availSpots = emptySquares();

    // Check for terminal states (conditions in which the problem 'ends')
    if (checkWin(newBoard, huPlayer)) {
        return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }
    var moves = [];
    // loop through every open spot starting at the first one
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        // places aiPlayer in the first empty spot
        newBoard[availSpots[i]] = player;
        // Call itself and wait for the function to return a value
        if (player == aiPlayer) {
            var result = minimax(newBoard, huPlayer);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if (player === aiPlayer) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
            } else { 
                var bestScore = 10000;
                for (var i = 0; i < moves.length; i++) {
                    if (moves[i].score < bestScore) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            }
            return moves[bestMove];
        }

