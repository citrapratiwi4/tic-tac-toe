// Deklarasi variabel
const menuPage = document.getElementById('menu-page');
const gamePage = document.getElementById('game-page');
const btnPvp = document.getElementById('btn-pvp');
const btnPvc = document.getElementById('btn-pvc');
const btnStart = document.getElementById('btn-start');
const btnHome = document.getElementById('btn-home');
const btnRestart = document.getElementById('btn-restart');
const scoreXElement = document.getElementById('score-x');
const scoreOElement = document.getElementById('score-o');
const gamePopup = document.getElementById('game-popup');
const popupText = document.getElementById('popup-text');
const btnClosePopup = document.getElementById('btn-close-popup');
const gridSizeInputContainer = document.getElementById('grid-size-container');
const gridSizeInput = document.getElementById('grid-size-input');
const boardContainer = document.getElementById('board-container');

let cells;
let gameMode = 'pvp';
let currentPlayer = 'X';
let boardState = [];
let gameActive = true;
let scores = { x: 0, o: 0 };
let gridSize = 3;

let winConditionLength = 3;

// Fungsi-fungsi game
function updateScoresDisplay() {
    scoreXElement.textContent = `${scores.x} wins`;
    scoreOElement.textContent = `${scores.o} wins`;
}

function handleMenuNavigation() {
    menuPage.classList.remove('hidden');
    gamePage.classList.add('hidden');
    restartGame();
}

function handleStartGame() {
    menuPage.classList.add('hidden');
    gamePage.classList.remove('hidden');
    restartGame();
}

function showPopup(message) {
    popupText.textContent = message;
    gamePopup.classList.remove('hidden');
}

function hidePopup() {
    gamePopup.classList.add('hidden');
}

function handleCellClick(e) {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (boardState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    boardState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(
    currentPlayer === 'X' ? 'text-teal-400' : 'text-yellow-400',
    'font-bold'   // tambah ini supaya huruf X atau O jadi tebal
    );


    checkResult();

    if (gameActive && gameMode === 'pvc' && currentPlayer === 'O') {
        setTimeout(handleComputerTurn, 500);
    }
}

function checkResult() {
    let winningCells = [];

    const checkWin = () => {
        // Horizontal
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j <= gridSize - winConditionLength; j++) {
                const indices = Array.from({ length: winConditionLength }, (_, k) => i * gridSize + j + k);
                const line = indices.map(index => boardState[index]);
                if (line.every(cell => cell === currentPlayer)) {
                    winningCells = indices;
                    return true;
                }
            }
        }

        // Vertikal
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j <= gridSize - winConditionLength; j++) {
                const indices = Array.from({ length: winConditionLength }, (_, k) => (j + k) * gridSize + i);
                const line = indices.map(index => boardState[index]);
                if (line.every(cell => cell === currentPlayer)) {
                    winningCells = indices;
                    return true;
                }
            }
        }

        // Diagonal ↘
        for (let i = 0; i <= gridSize - winConditionLength; i++) {
            for (let j = 0; j <= gridSize - winConditionLength; j++) {
                const indices = Array.from({ length: winConditionLength }, (_, k) => (i + k) * gridSize + j + k);
                const line = indices.map(index => boardState[index]);
                if (line.every(cell => cell === currentPlayer)) {
                    winningCells = indices;
                    return true;
                }
            }
        }

        // Diagonal ↙
        for (let i = 0; i <= gridSize - winConditionLength; i++) {
            for (let j = winConditionLength - 1; j < gridSize; j++) {
                const indices = Array.from({ length: winConditionLength }, (_, k) => (i + k) * gridSize + (j - k));
                const line = indices.map(index => boardState[index]);
                if (line.every(cell => cell === currentPlayer)) {
                    winningCells = indices;
                    return true;
                }
            }
        }

        return false;
    };

    if (checkWin()) {
        gameActive = false;

        // Tampilkan kotak pemenang dulu
        winningCells.forEach(index => {
            cells[index].classList.add('cell-win');
        });

        // Tunggu 500ms lalu tampilkan popup
        setTimeout(() => {
            showPopup(`${currentPlayer} Win!`);
        }, 500);

        scores[currentPlayer.toLowerCase()]++;
        updateScoresDisplay();
        return;
    }

    if (!boardState.includes('')) {
        gameActive = false;
        showPopup('Seri!');
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}


    

   function handleComputerTurn() {
    if (!gameActive) return;

    let bestScore = -Infinity;
    let bestMove = null;

    // Batas kedalaman pencarian (biar nggak lambat di grid besar)
    const depthLimit = gridSize <= 3 ? 9 : gridSize <= 4 ? 6 : 4;

    for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] === '') {
            boardState[i] = 'O';
            let score = minimax(depthLimit, false, -Infinity, Infinity);
            boardState[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    if (bestMove !== null) {
        makeMove(bestMove, 'O');
    }
}

function minimax(depth, isMaximizing, alpha, beta) {
    // Cek kemenangan
    if (checkTempWin('O')) return 1000 + depth; // makin cepat menang makin tinggi
    if (checkTempWin('X')) return -1000 - depth; // makin cepat kalah makin rendah
    if (!boardState.includes('')) return 0; // seri
    if (depth === 0) return evaluateBoard('O') - evaluateBoard('X');

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let i = 0; i < boardState.length; i++) {
            if (boardState[i] === '') {
                boardState[i] = 'O';
                let eval = minimax(depth - 1, false, alpha, beta);
                boardState[i] = '';
                maxEval = Math.max(maxEval, eval);
                alpha = Math.max(alpha, eval);
                if (beta <= alpha) break;
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let i = 0; i < boardState.length; i++) {
            if (boardState[i] === '') {
                boardState[i] = 'X';
                let eval = minimax(depth - 1, true, alpha, beta);
                boardState[i] = '';
                minEval = Math.min(minEval, eval);
                beta = Math.min(beta, eval);
                if (beta <= alpha) break;
            }
        }
        return minEval;
    }
}



function restartGame() {
    gameActive = true;
    currentPlayer = 'X';
    boardState = Array(gridSize * gridSize).fill('');
    boardContainer.innerHTML = '';
    // Atur ulang panjang kemenangan berdasarkan grid size
    if (gridSize === 6) {
    winConditionLength = 5;
} else if (gridSize >= 5) {
    winConditionLength = 4;
} else {
    winConditionLength = 3;
}



boardContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
boardContainer.style.setProperty('--grid-size', gridSize);

// Generate ulang cell sesuai ukuran grid
for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add(
      'grid-cell',
      'bg-transparent',
      'border',
      'border-gray-500',
      'flex',
      'items-center',
      'justify-center',
      'cursor-pointer',
      
      'font-bold' // biar huruf X/O tebal
    );

    // Atur ukuran font berdasarkan ukuran grid
    if (gridSize === 3) {
        cell.classList.add('text-6xl'); // besar untuk 3x3
    } else if (gridSize === 4) {
        cell.classList.add('text-4xl'); // sedikit lebih kecil
    } else {
        cell.classList.add('text-2xl'); // kecil untuk 5x5 ke atas
    }

    cell.setAttribute('data-cell-index', i);
    cell.addEventListener('click', handleCellClick);
    boardContainer.appendChild(cell);
}


cells = document.querySelectorAll('[data-cell-index]');
}

// Event Listeners
btnPvp.addEventListener('click', () => {
    gameMode = 'pvp';
    btnPvp.classList.add('active');
    btnPvc.classList.remove('active');
    gridSizeInputContainer.classList.remove('hidden');
    
});

btnPvc.addEventListener('click', () => {
    gameMode = 'pvc';
    btnPvc.classList.add('active');
    btnPvp.classList.remove('active');
    gridSizeInputContainer.classList.remove('hidden'); // <<< GANTI INI
});


btnStart.addEventListener('click', handleStartGame);
btnHome.addEventListener('click', handleMenuNavigation);
btnRestart.addEventListener('click', restartGame);
btnClosePopup.addEventListener('click', () => {
    hidePopup();
    restartGame(); 
});

gridSizeInput.addEventListener('change', () => {
    gridSize = parseInt(gridSizeInput.value);

    // Batasi antara 3 hingga 6 saja
    if (gridSize < 3) {
        gridSize = 3;
        gridSizeInput.value = 3;
    } else if (gridSize > 6) {
        gridSize = 6;
        gridSizeInput.value = 6;
    }

    // Atur panjang kemenangan berdasarkan ukuran grid
    if (gridSize === 6) {
    winConditionLength = 5;
} else if (gridSize >= 5) {
    winConditionLength = 4;
} else {
    winConditionLength = 3;
}

});



// Panggil inisialisasi
updateScoresDisplay();
restartGame();





