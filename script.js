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

    // 1. Menang jika bisa
    for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] === '') {
            boardState[i] = 'O';
            if (checkTempWin('O')) {
                boardState[i] = '';
                makeMove(i, 'O');
                return;
            }
            boardState[i] = '';
        }
    }

    // 2. Blokir jika pemain hampir menang
    for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] === '') {
            boardState[i] = 'X';
            if (checkTempWin('X')) {
                boardState[i] = '';
                makeMove(i, 'O');
                return;
            }
            boardState[i] = '';
        }
    }

    // 3. Ambil tengah
    const center = Math.floor((gridSize * gridSize) / 2);
    if (boardState[center] === '') {
        makeMove(center, 'O');
        return;
    }

    // 4. Ambil corner
    const corners = [
        0,
        gridSize - 1,
        gridSize * (gridSize - 1),
        gridSize * gridSize - 1
    ];
    for (let corner of corners) {
        if (boardState[corner] === '') {
            makeMove(corner, 'O');
            return;
        }
    }

    // 5. Gunakan heuristik
    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] === '') {
            boardState[i] = 'O';
            let score = evaluateBoard('O') - evaluateBoard('X');
            boardState[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    if (bestMove !== null) {
        makeMove(bestMove, 'O');
    } else {
        // fallback: pilih random
        const available = boardState.reduce((acc, val, idx) => {
            if (val === '') acc.push(idx);
            return acc;
        }, []);

        if (available.length > 0) {
            const randomMove = available[Math.floor(Math.random() * available.length)];
            makeMove(randomMove, 'O');
        }
    }
}

function makeMove(index, player) {
    if (boardState[index] !== '' || !gameActive) return;

    boardState[index] = player;
    cells[index].textContent = player;
    cells[index].classList.add(
        player === 'X' ? 'text-teal-400' : 'text-yellow-400',
        'font-bold'
    );

    currentPlayer = player;
    checkResult();
}

function checkTempWin(player) {
    const checkWin = () => {
        // Horizontal
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j <= gridSize - winConditionLength; j++) {
                const indices = Array.from(
                    { length: winConditionLength },
                    (_, k) => i * gridSize + j + k
                );
                if (indices.every(index => boardState[index] === player)) return true;
            }
        }

        // Vertical
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j <= gridSize - winConditionLength; j++) {
                const indices = Array.from(
                    { length: winConditionLength },
                    (_, k) => (j + k) * gridSize + i
                );
                if (indices.every(index => boardState[index] === player)) return true;
            }
        }

        // Diagonal ↘
        for (let i = 0; i <= gridSize - winConditionLength; i++) {
            for (let j = 0; j <= gridSize - winConditionLength; j++) {
                const indices = Array.from(
                    { length: winConditionLength },
                    (_, k) => (i + k) * gridSize + j + k
                );
                if (indices.every(index => boardState[index] === player)) return true;
            }
        }

        // Diagonal ↙
        for (let i = 0; i <= gridSize - winConditionLength; i++) {
            for (let j = winConditionLength - 1; j < gridSize; j++) {
                const indices = Array.from(
                    { length: winConditionLength },
                    (_, k) => (i + k) * gridSize + (j - k)
                );
                if (indices.every(index => boardState[index] === player)) return true;
            }
        }

        return false;
    };

    return checkWin();
}

function evaluateBoard(player) {
    let score = 0;

    const directions = [
        [1, 0],  // horizontal
        [0, 1],  // vertikal
        [1, 1],  // diagonal kanan bawah
        [1, -1], // diagonal kiri bawah
    ];

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            for (let [dx, dy] of directions) {
                let count = 0;
                let blocked = false;

                for (let k = 0; k < winConditionLength; k++) {
                    const x = i + dx * k;
                    const y = j + dy * k;
                    const idx = x * gridSize + y;

                    if (x >= gridSize || x < 0 || y >= gridSize || y < 0) {
                        blocked = true;
                        break;
                    }

                    const cell = boardState[idx];

                    if (cell === player) {
                        count++;
                    } else if (cell !== '') {
                        blocked = true;
                        break;
                    }
                }

                if (!blocked && count > 0) {
                    score += Math.pow(10, count);
                }
            }
        }
    }

    return score;
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







