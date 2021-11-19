

(function () {
	let mines;
	let flaggedCells;
	let timer;

	const board = document.querySelector('#board');
	const minesLabel = document.querySelector('#mines').querySelector('.value');
	const timerLabel = document.querySelector('#timer').querySelector('.value');
	const flagedCellsLabel = document.querySelector('#flagged-cells').querySelector('.value');

	// buttons
	const burstBtn = document.querySelector('#burst');
	const newGameBtn = document.querySelector('#new-game');

	burstBtn.onclick = function (event) {
		const r = Math.random();
		const i = Math.floor((minesweeper.emptyCells.length*r))

		const cellIndex = minesweeper.emptyCells[i];

		const elem = getElementFromIndex(cellIndex);
		revealEmptyCells(elem);

		burstBtn.disabled = true;
	}	

	newGameBtn.onclick = function (event) {
		createBoard(minesweeper.level);
	}


	const levels = document.querySelectorAll('input[name="gameLevel"]');

	for (let node of levels) {
		if (node.checked) {
			createBoard(node.value);
		}

		node.onchange = function (event) {
			if (event.target.checked) {
				createBoard(event.target.value);
			}
		}
	}

	function newBomb() {
		const bomb = document.createElement('img');

		bomb.src = 'assets/images/bomb.png';

		bomb.style.height = '18px';
		bomb.style.width = '18px';

		return bomb;
	}

	function toggleFlag(cellElem) {
		if (cellElem.className == 'covered') {
			updateFlaggedCellsLabel(1)
			cellElem.className = 'flagged';
		} else if (cellElem.className == 'flagged') {
			updateFlaggedCellsLabel(-1)
			cellElem.className = 'covered';
		}
	}

	function revealCell(cellElem) {
		const value = parseInt(cellElem.dataset.cellValue);

		if (value > 0) {
			cellElem.innerText = value;
		} else if (value == -1) {
			const bomb = newBomb();
			cellElem.appendChild(bomb);
		}

		cellElem.setAttribute('class', 'revealed');
	}

	function revealEmptyCells(cellElem) {
		const NEIGHBORS = [
			[-1, -1], [-1, 0], [-1, 1],
			[0, -1], [0, 1], [1, -1], 
			[1, 0], [1, 1]
		];
		
		const index = cellElem.dataset.cellIndex.split(',');
		const cellsToCheck = [index,];

		while (cellsToCheck.length != 0) {
			const i = cellsToCheck.shift();
			const em = getElementFromIndex(i);

			revealCell(em);

			NEIGHBORS.forEach(function (n) {
				const ro = parseInt(i[0])+n[0];
				const co = parseInt(i[1])+n[1];

				const validRow = 0 <= ro && ro < minesweeper.rows;
				const validCol = 0 <= co && co < minesweeper.columns;

				if (validRow && validCol) {
					const el = getElementFromIndex([ro, co]);
					if (el.className == 'covered') {
						const val = getCellValueFromElement(el);

						if (val > 0 || val == -1) {
							revealCell(el);
						} else {
							cellsToCheck.push([ro, co]);
						}
					}
				}		
			})
		}
	}

	function revealAllCells() {
		const allCells = board.querySelectorAll('span');

		for (let cell of allCells) {
			if (cell.className == 'covered' || cell.className == 'flagged') {
				revealCell(cell);
			}
		}
	}

	function getCellValueFromElement(elem) {
		return parseInt(elem.dataset.cellValue);
	}

	function getElementFromIndex(index) {
		const [row, col] = index;
		return document.getElementById(`c${row}-${col}`);
	}

	function updateFlaggedCellsLabel(num) {
		if (flaggedCells > -1) {
			flaggedCells += num;
			flagedCellsLabel.innerText = flaggedCells;
		}
	}

	function createCell(row, col) {
		const cellValue = minesweeper.getCell(row, col);
		const cell = document.createElement('span');

		cell.setAttribute('id', `c${row}-${col}`);
		cell.setAttribute('class', 'covered');
		cell.setAttribute('data-cell-value', cellValue);
		cell.setAttribute('data-cell-index', `${row},${col}`);

		cell.style.gridRowStart = row+1;
		cell.style.gridColumnStart = col+1;

		return cell;
	}

	function createBoard(lvl) {
		minesweeper.newGame(lvl);

		flaggedCells = 0;
		timer = 0;
		mines = minesweeper.mines;

		timerLabel.innerText = timer;
		flagedCellsLabel.innerText = flaggedCells;
		minesLabel.innerText = mines;

		board.innerHTML = '';

		board.style.gridTemplateColumns = `repeat(${minesweeper.columns}, 30px)`;
		board.style.gridTemplateRows = `repeat(${minesweeper.rows}, 30px)`;

		if (burstBtn.disabled) {
			burstBtn.disabled = false;
		}

		for (var i=0; i<minesweeper.rows; i++) {
			for (var j=0; j<minesweeper.columns; j++) {
				const cell = createCell(i, j);

				cell.onclick = function (event) {
					event.preventDefault();

					const cellValue = parseInt(event.target.dataset.cellValue);

					if (event.target.className == 'covered') {
						if (cellValue == 0) {
							revealEmptyCells(event.target)
						} else if (cellValue == -1) {
							revealCell(event.target);
							revealAllCells();
						} else {
							revealCell(event.target);	
						}	
					}	

					if (!burstBtn.disabled) {
						burstBtn.disabled = true;
					}
				}

				cell.oncontextmenu = function (event) {
					event.preventDefault();

					toggleFlag(event.target);
				}
				
				board.appendChild(cell);
			}
		}
	}
})()	