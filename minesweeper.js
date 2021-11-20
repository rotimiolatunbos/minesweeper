 

 const minesweeper = (function (obj) {
 	const NUM_MINES = {'easy': 10, 'medium': 40, 'hard': 99};
 	const DIMENSIONS = {'easy': [8, 8], 'medium': [16, 16], 'hard': [16, 30]};
 	const NEIGHBORS = [
		[-1, -1], [-1, 0], [-1, 1],
		[0, -1], [0, 1], [1, -1], 
		[1, 0], [1, 1]
	];


	obj.board = null;
	obj.mines = null;
	obj.rows = null;
	obj.columns = null;
	obj.mineCells = null;
	obj.emptyCells = null;
	obj.level = null;


 	obj.newGame = function (level) {
 		obj.board = [];
 		obj.mineCells = [];
 		obj.emptyCells = [];
 		obj.level = level;
 		obj.rows = DIMENSIONS[level][0];
		obj.columns = DIMENSIONS[level][1];
		obj.mines = NUM_MINES[level];
		obj.area = obj.rows*obj.columns;

		let indices = [];
		let mines_found = 0;

		for (let i=0; i<obj.rows; i++) {
			let c = [];
			for (let j=0; j<obj.columns; j++) {
				c.push(0);
				indices.push([i, j])
			}
			obj.board.push(c);
		}

		while (mines_found < obj.mines) {
			const r = Math.random();
			const i = Math.floor(((indices.length-1)*r));

			const ro = indices[i][0];
			const co = indices[i][1];

			obj.board[ro][co] = -1;
			obj.mineCells.push(indices[i]);

			indices = indices.filter(function (item, index, arr) {
				return arr.indexOf(item) != i;
			});

			mines_found += 1;
		}

		for (let i=0; i<obj.rows; i++) {
			for (let j=0; j<obj.columns; j++) {
				var mines_around = 0;

				if (obj.board[i][j] != -1) {
					NEIGHBORS.forEach(function (n) {
						let rw = n[0]+i;
						let cl = n[1]+j;

						var isValidRow = 0 <= rw && rw < obj.rows;
						var isValidCol = 0 <= cl && cl < obj.columns;

						if (isValidRow && isValidCol) {
							if (obj.board[rw][cl] == -1) {
								mines_around += 1
							}
						}
					})
				}

				if (mines_around > 0) {
					obj.board[i][j] = mines_around
				} else {
					if (obj.board[i][j] == 0) {
						obj.emptyCells.push([i, j]);
					}		
				}
			}
		}
 	}

 	obj.getCell = function (row, col) {
 		if (obj.board != [] || obj.board != null) {
 			return obj.board[row][col];
 		}

 		return null;
 	}

 	return obj;
 })({})