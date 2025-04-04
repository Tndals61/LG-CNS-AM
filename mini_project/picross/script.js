//게임 설정
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

//게임 상태
const gameState = {
	board: [],
	isComplete: false,
};

//게임 초기화 함수
function initGame() {
	// gameState.board = Array(gameConfig.gridSize).fill(null).map(() => Array(gameConfig.gridSize).fill(0));

	gameState.board = Array.from({ length: gameConfig.gridSize }, () => Array(gameConfig.gridSize).fill(0));
    renderGameBoard();
	renderGameBoard();
}

//게임 보드 렌더링
function renderGameBoard() {
	const gameBoard = document.getElementById("game-board");
	gameBoard.innerHTML = "";

    const size = gameConfig.gridSize;
	// gameBoard.style.gridTemplateColumns = `repeat(${size}, 40px)`;
    
    //힌트 계산
    const { rowHints, colHints } = calculateHints(gameConfig.currentPuzzle);
    
	gameBoard.style.display = "grid";
    gameBoard.style.gridTemplateColumns = `auto repeat(${size +1}, 40px)`;
    gameBoard.style.gridTemplateRows = `auto repeat(${size +1}, 40px)`;

    console.log(rowHints);
    console.log(colHints);
    
	//왼쪽 상단에 빈 셀 추가
    const emptyCell = document.createElement('div');
	emptyCell.className = "empty-cell";
    gameBoard.appendChild(emptyCell);
    console.log(gameBoard);
    
	//힌트 열 추가
    for (let col = 0; col < size; col++){
        const hintCol = document.createElement('div');
        hintCol.className = "hint-col";
        colHints[col].forEach(v=> {
            const hintText = document.createElement('span');
            hintText.textContent = v;
            hintCol.appendChild(hintText);
        });
        gameBoard.appendChild(hintCol);
    }
    

	//힌트 행 추가
	for (let row = 0; row < size; row++){
        const hintRow = document.createElement('div');
        hintRow.className = "hint-row";
        rowHints[row].forEach(v=> {
            const hintText = document.createElement('span');
            hintText.textContent = v;
            hintRow.appendChild(hintText);
        });
        gameBoard.appendChild(hintRow);
    }

    
    
	
    //셀 생성
	for (let row = 0; row < size; row++) {
		for (let col = 0; col < size; col++) {
			const cell = document.createElement("div");
			cell.className = "cell";
			cell.dataset.row = row;
			cell.dataset.col = col;

			//셀 클릭 이벤트 핸들러
			cell.addEventListener("click", handleCellClick);
			cell.addEventListener("contextmenu", handleCellRightClick);

			gameBoard.appendChild(cell);
		}
	}

}

//힌트 계산 함수
function calculateHints(solution) {
	const size = gameConfig.gridSize;

	//행과 열 힌트를 저장할 배열 생성
	const rowHints = [];
	const colHints = [];

	//행 힌트 계산

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
		if (count > 0) {
			hints.push(count);
		}
		// rowHints.push(hints.length > 0 ? hints : [0]);
		if (hints.length > 0) {
			rowHints.push(hints);
		} else {
			rowHints.push([0]);
		}
	}
	//열 힌트 계산

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
		if (count > 0) {
			hints.push(count);
		}
		// hintCol.push(hints.length > 0 ? hints : [0]);
		if (hints.length > 0) {
			colHints.push(hints);
		} else {
			colHints.push([0]);
		}
	}

    return {rowHints,colHints};
}

//셀 클릭 처리
function handleCellClick(event) {
	if (gameState.isComplete) return;

	const row = event.target.dataset.row;
	const col = event.target.dataset.col;

	//상태 토글: 0 -> 1 -> 0
	gameState.board[row][col] = gameState.board[row][col] === 1 ? 0 : 1;
	// if (gameState.board[row][col] === 1) {
	//     gameState.board[row][col] = 0;
	// } else {
	//     gameState.board[row][col] = 1;
	// }

	event.target.classList.toggle("filled");

	checkCompletion();
}

// 셀 우클릭 처리 (x)처리
function handleCellRightClick(event) {
	event.preventDefault();
	if (gameState.isComplete) return;

	const row = event.target.dataset.row;
	const col = event.target.dataset.col;

	gameState.board[row][col] = gameState.board[row][col] === 2 ? 0 : 2;
	event.target.classList.toggle("marked");
}

//완성 여부 체크
function checkCompletion() {
	//정답과 비교
	const isCorrect = gameConfig.currentPuzzle.every((row, i) =>
		row.every((cell, j) => cell === gameState.board[i][j])
	);

	if (isCorrect) {
		gameState.isComplete = true;
		alert("🎉 퍼즐 완성! 축하합니다!");
	}
}

//게임 시작
window.onload = initGame;
