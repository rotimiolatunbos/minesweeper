

(function () {
	let mines;
	let flaggedCells;
	let revealedCells;
	let timer;
	let timerId;

	const COLOR_CODE = {
		1 : 'blue', 2 : 'green', 3 : 'red', 4 : 'purple', 
		5 : 'maroon', 6 : 'turquoise', 7 : 'black', 8 : 'gray'
	}

	const board = document.querySelector('#board');
	const minesLabel = document.querySelector('#mines').querySelector('.value');
	const timerLabel = document.querySelector('#timer').querySelector('.value');
	const flaggedCellsLabel = document.querySelector('#flagged-cells').querySelector('.value');
	const messageLabel = document.querySelector('.message');

	// buttons
	const burstBtn = document.querySelector('#burst');
	const newGameBtn = document.querySelector('#new-game');

	burstBtn.onclick = function (event) {
		const r = Math.random();
		const i = Math.floor((minesweeper.emptyCells.length*r))

		const cellIndex = minesweeper.emptyCells[i];

		const elem = getElementFromIndex(cellIndex);
		startTimer();
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

	function updateMessage(msg, type) {
		messageLabel.innerText = msg;

		if (type == 'alert') {
			messageLabel.style.color = 'red';
		} else if (type == undefined) {
			messageLabel.style.color = 'blue'
		}
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

	function revealBlownMine(elem) {
		elem.style.backgroundColor = 'red';
	}

	function revealCell(cellElem) {
		const value = parseInt(cellElem.dataset.cellValue);

		if (value > 0) {
			cellElem.style.color = COLOR_CODE[value];
			cellElem.innerText = value;
		} else if (value == -1) {
			const bomb = newBomb();
			cellElem.appendChild(bomb);
		}

		revealedCells += 1;
		cellElem.setAttribute('class', 'revealed');
	}

	function revealEmptyCells(cellElem) {
		const queue = [cellElem];
		const NEIGHBORS = [
			[-1, -1], [-1, 0], [-1, 1],
			[0, -1], [0, 1], [1, -1], 
			[1, 0], [1, 1]
		];

		while (queue.length != 0) {
			const elem = queue.shift();
			const value = getCellValueFromElement(elem);

			revealCell(elem);

			if (value == 0) {
				const [rw, cl] = getCellIndexFromElement(elem);

				NEIGHBORS.forEach(function (n) {
					const ro = rw+n[0];
					const co = cl+n[1];

					const validRow = 0 <= ro && ro < minesweeper.rows;
					const validCol = 0 <= co && co < minesweeper.columns;

					if (validRow && validCol) {
						const el = getElementFromIndex([ro, co]);
						if (el.className == 'covered' && queue.indexOf(el) == -1) {
							queue.push(el);
						}
					}		
				})
			}
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

	function getCellIndexFromElement(elem) {
		const [ro, co] = elem.dataset.cellIndex.split(',');
		return [parseInt(ro), parseInt(co)]
	}

	function getElementFromIndex(index) {
		const [row, col] = index;
		return document.getElementById(`c${row}-${col}`);
	}

	function startTimer() {
		if (!timerId) {
			timerId = setInterval(updateTimerLabel, 1000);
		}
	}

	function stopTimer() {
		if (timerId) {
			clearInterval(timerId);
			timerId = undefined;
		}
	}

	function updateTimerLabel() {
		timer += 1;
		timerLabel.innerText = timer;
	}

	function updateFlaggedCellsLabel(num) {
		if (flaggedCells > -1) {
			flaggedCells += num;
			flaggedCellsLabel.innerText = flaggedCells;

			if (flaggedCells > minesweeper.mines) {
				flaggedCellsLabel.style.color = 'red';
				updateMessage('You have flagged more cells than is necessary! ?? :|', 'alert');
			} else {
				flaggedCellsLabel.style.color = 'black';
				updateMessage('');
			}
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

	function checkForWin() {
		if (flaggedCells == minesweeper.mines && 
			(flaggedCells+revealedCells) == minesweeper.area) {
			stopTimer();
			updateMessage('You win! GREAT :)');
		}	
	}

	function initialize(lvl) {
		stopTimer();
		updateMessage('');
		minesweeper.newGame(lvl);

		revealedCells = 0;
		flaggedCells = 0;
		timer = 0;
		mines = minesweeper.mines;
		
		timerLabel.innerText = timer;
		flaggedCellsLabel.innerText = flaggedCells;
		flaggedCellsLabel.style.color = 'black';
		minesLabel.innerText = mines;

		board.innerHTML = '';

		board.style.gridTemplateColumns = `repeat(${minesweeper.columns}, 30px)`;
		board.style.gridTemplateRows = `repeat(${minesweeper.rows}, 30px)`;

		if (burstBtn.disabled) {
			burstBtn.disabled = false;
		}
	}

	function createBoard(lvl) {
		initialize(lvl);

		for (var i=0; i<minesweeper.rows; i++) {
			for (var j=0; j<minesweeper.columns; j++) {
				const cell = createCell(i, j);

				cell.onclick = function (event) {
					event.preventDefault();

					const cellValue = parseInt(event.target.dataset.cellValue);

					startTimer();
					
					if (event.target.className == 'covered') {
						if (cellValue == 0) {
							revealEmptyCells(event.target)
						} else if (cellValue == -1) {
							stopTimer();
							updateMessage('You blew a mine! GAME OVER :(', 'alert')
							revealCell(event.target);
							revealBlownMine(event.target);
							revealAllCells();
						} else {
							revealCell(event.target);	
						}

						checkForWin();
					}	

					if (!burstBtn.disabled) {
						burstBtn.disabled = true;
					}
				}

				cell.oncontextmenu = function (event) {
					event.preventDefault();

					startTimer();
					toggleFlag(event.target);
					checkForWin();
				}
				
				board.appendChild(cell);
			}
		}
	}
})()	