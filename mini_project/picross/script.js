//게임 설정
const gameConfig = {
    gridSize: 5,
        currentPuzzle: [
            [0, 1, 0, 1, 0],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [0, 1, 1, 1, 0],
            [0, 0, 1, 0, 0]
    ]
};

//게임 상태
const gameState = {
    board: [],
    isComplete: false
};

//게임 초기화 함수
function initGame() {
    gameState.board = Array(gameConfig.gridSize).fill(null).map(() => Array(gameConfig.gridSize).fill(0));

    renderGameBoard();

}

//게임 보드 렌더링
function renderGameBoard(){
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    gameBoard.style.gridTemplateColumns = `repeat(${gameConfig.gridSize}, 40px)`;

    //셀 생성
    for (let row = 0; row < gameConfig.gridSize; row++){
        for (let col = 0; col < gameConfig.gridSize; col++){
            const cell = document.createElement('div');
            cell.className = 'cell'
            cell.dataset.row = row;
            cell.dataset.col = col;

            //셀 클릭 이벤트 핸들러
            cell.addEventListener('click', handleCellClick);
            cell.addEventListener('contextmenu', handleCellRightClick);

            gameBoard.appendChild(cell)
        }
    }
}

//셀 클릭 처리
function handleCellClick(event){
    if (gameState.isComplete) return;

    const row = event.target.dataset.row;
    const col = event.target.dataset.col;

    //상태 토글: 0 -> 1 -> 0
    gameState.board[row][col] = gameState.board[row][col] === 1?0:1;
    // if (gameState.board[row][col] === 1) {
    //     gameState.board[row][col] = 0;
    // } else {
    //     gameState.board[row][col] = 1;
    // }

    event.target.classList.toggle('filled');

    checkCompletion();
}

// 셀 우클릭 처리 (x)처리

function handleCellRightClick(event) {
    event.preventDefault();
    if (gameState.isComplete) return;

    const row = event.target.dataset.row;
    const col = event.target.dataset.col;

    gameState.board[row][col] = gameState.board[row][col] ===2?0:2;
    event.target.classList.toggle("marked");
}

//완성 여부 체크
function checkCompletion(){
    //정답과 비교
    const isCorrect = gameConfig.currentPuzzle.every((row,i) => row.every((cell,j) => cell === gameState.board[i][j]));

    if (isCorrect) {
        gameState.isComplete = true;
        alert('🎉 퍼즐 완성! 축하합니다!');
    }
}

//게임 시작
window.onload = initGame;