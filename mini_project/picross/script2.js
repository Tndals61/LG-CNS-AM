// 게임 설정
const gameConfig = {
    gridSize: 5,
    currentPuzzle: [
        [0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0],
    ],
};

// 게임 상태
const gameState = {
    board: [],
    isComplete: false,
};

// 게임 초기화 함수
function initGame() {
    gameState.board = Array.from({ length: gameConfig.gridSize }, () => Array(gameConfig.gridSize).fill(0));
    renderGameBoard();
}

// 게임 보드 렌더링
function renderGameBoard() {
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = "";

    const size = gameConfig.gridSize;
    const { rowHints, colHints } = calculateHints(gameConfig.currentPuzzle);

    gameBoard.style.display = "grid";
    gameBoard.style.gridTemplateColumns = `repeat(${size + 1}, 40px)`; // 수정: 힌트 포함 크기 조정
    gameBoard.style.gridTemplateRows = `repeat(${size + 1}, 40px)`;

    // 왼쪽 상단 빈 셀
    const emptyCell = document.createElement("div");
    emptyCell.className = "empty-cell";
    gameBoard.appendChild(emptyCell);

    // 열 힌트 추가
    for (let col = 0; col < size; col++) {
        const hintCol = document.createElement("div");
        hintCol.className = "hint-col";
        colHints[col].forEach(v => {
            const hintText = document.createElement("span");
            hintText.textContent = v;
            hintCol.appendChild(hintText);
        });
        gameBoard.appendChild(hintCol);
    }

    // 행 힌트 및 셀 추가
    for (let row = 0; row < size; row++) {
        // 행 힌트 추가
        const hintRow = document.createElement("div");
        hintRow.className = "hint-row";
        rowHints[row].forEach(v => {
            const hintText = document.createElement("span");
            hintText.textContent = v;
            hintRow.appendChild(hintText);
        });
        gameBoard.appendChild(hintRow);

        // 게임 셀 추가
        for (let col = 0; col < size; col++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener("click", handleCellClick);
            cell.addEventListener("contextmenu", handleCellRightClick);
            gameBoard.appendChild(cell);
        }
    }
}

// 힌트 계산 함수
function calculateHints(solution) {
    const size = gameConfig.gridSize;
    const rowHints = [];
    const colHints = [];

    for (let row = 0; row < size; row++) {
        const hints = [];
        let count = 0;
        for (let col = 0; col < size; col++) {
            if (solution[row][col] === 1) {
                count++;
            } else if (count > 0) {
                hints.push(count);
                count = 0;
            }
        }
        if (count > 0) hints.push(count);
        rowHints.push(hints.length ? hints : [0]);
    }

    for (let col = 0; col < size; col++) {
        const hints = [];
        let count = 0;
        for (let row = 0; row < size; row++) {
            if (solution[row][col] === 1) {
                count++;
            } else if (count > 0) {
                hints.push(count);
                count = 0;
            }
        }
        if (count > 0) hints.push(count);
        colHints.push(hints.length ? hints : [0]);
    }

    return { rowHints, colHints };
}

// 셀 클릭 처리
function handleCellClick(event) {
    if (gameState.isComplete) return;
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;
    gameState.board[row][col] = gameState.board[row][col] === 1 ? 0 : 1;
    event.target.classList.toggle("filled");
    checkCompletion();
}

// 셀 우클릭 처리 (X 마킹)
function handleCellRightClick(event) {
    event.preventDefault();
    if (gameState.isComplete) return;
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;
    gameState.board[row][col] = gameState.board[row][col] === 2 ? 0 : 2;
    event.target.classList.toggle("marked");
}

// 퍼즐 완성 여부 체크
function checkCompletion() {
    const isCorrect = gameConfig.currentPuzzle.every((row, i) =>
        row.every((cell, j) => cell === gameState.board[i][j])
    );
    if (isCorrect) {
        gameState.isComplete = true;
        alert("🎉 퍼즐 완성! 축하합니다!");
    }
}

// 게임 시작
window.onload = initGame;
