

var num_mines = {'easy': 10, 'medium': 40, 'hard': 99};
var dimensions = {'easy': [8, 8], 'medium': [16, 16], 'hard': [16, 30]};

function createBoard(level) {
	var board = [];
	var indices = [];
	var mines_found = 0;
	var neighbors = [
		[-1, -1], [-1, 0], [-1, 1],
		[0, -1], [0, 1], [1, -1], 
		[1, 0], [1, 1]
	];
	var boardInString = '';

	var row = dimensions[level][0];
	var col = dimensions[level][1];
	var mines = num_mines[level];

	for (var i=0; i<row; i++) {
		var c = []
		for (var j=0; j<col; j++) {
			c.push(0);
			indices.push([i, j])
		}
		board.push(c);
	}

	while (mines_found < mines) {
		var r = Math.random();
		var i = Math.floor(((indices.length-1)*r));

		var ro = indices[i][0];
		var co = indices[i][1];

		board[ro][co] = -1;

		indices = indices.filter(function (item, index, arr) {
			return arr.indexOf(item) != i;
		});

		mines_found += 1;
	}

	for (var i=0; i<row; i++) {
		for (var j=0; j<col; j++) {
			var mines_around = 0;

			if (board[i][j] != -1) {
				neighbors.forEach(function (n) {
					var rw = n[0]+i;
					var cl = n[1]+j;

					var isValidRow = 0 <= rw && rw < row;
					var isValidCol = 0 <= cl && cl < col;

					if (isValidRow && isValidCol) {
						// console.log(`${rw} ${cl}`)
						if (board[rw][cl] == -1) {
							// console.log(board[rw][cl])
							mines_around += 1
						}
					}
				})
			}

			//console.log(mines_around)

			if (mines_around > 0) {
				// console.log(mines_around)
				board[i][j] = mines_around
				// console.log(mines_around)
			}
		}
	}

	board.forEach(function (rw, ind, arr) {
		rw.forEach(function (cl, id, ar) {
			if (id == (arr.length-1)) {
				boardInString += `\t${cl}\n`;
			} else {
				boardInString += `\t${cl}`;
			}
		})
	})

	return boardInString;
}


console.log(createBoard('medium'))