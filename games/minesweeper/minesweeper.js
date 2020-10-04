class Minesweeper {
    constructor() {
        this.width = null;
        this.height = null;
        this.numOfCells = null;
        this.numOfMines = null;
        this.leftMines = null;
        this.numOfOpened = null;
        this.board = null;
        this.flaggedBoard = null;
        this.setStatus('uninitialized');
    }

    init(width = 9, height = 9, numOfMines = 12) {
        if(parseInt(numOfMines) >= parseInt(width) * parseInt(height)) {
            throw new Error('Please check the number of mines.');
        }

        this.width = parseInt(width);
        this.height = parseInt(height);
        this.numOfCells = this.width * this.height;
        this.numOfMines = parseInt(numOfMines);
        this.leftMines = this.numOfMines;
        this.numOfOpened = 0;

        this.board = [];
        this.flaggedBoard = [];
        for(let i = 0; i < this.height; i++) {
            this.board[i] = [];
            this.flaggedBoard[i] = [];
            for(let j = 0; j < this.width; j++) {
                this.board[i][j] = 0;
                this.flaggedBoard[i][j] = false;
            }
        }

        this.setStatus('initialized');
    }

    setStatus(status) {
        switch(status) {
            case 'uninitialized':
            case 'initialized':
            case 'ongoing':
            case 'ended':
                this.status = status;
                break;
            default:
                throw new TypeError(`The status(${status}) is unknown.`);
        }
    }

    generateMines(x, y) {
        if(!this.width || !this.height || !this.numOfMines) {
            throw new Error('You should call Minesweeper.init() first.');
        }

        const tmp = [];
        const mineIdxs = [];

        for(let i = 0; i < this.width * this.height; i++) {
            if(i === this.width * parseInt(x) + parseInt(y)) {
                continue;
            }
            tmp.push(i);
        }

        for(let i = 0, j; i < this.numOfMines; i++) {
            j = Math.floor(Math.random() * tmp.length);
            mineIdxs.push(tmp.splice(j, 1)[0]);
        }

        for(let idx of mineIdxs) {
            const i = Math.floor(idx / this.width);
            const j = idx % this.width;
            this.board[i][j] = -1;
        }

        for(let i = 0; i < this.height; i++) {
            for(let j = 0; j < this.width; j++) {
                if(this.board[i][j] === 0) {
                    this.board[i][j] = this.lookAround(i, j);
                }
            }
        }

        this.setStatus('ongoing');
    }

    lookAround(x, y) {
        let cnt = 0;
        for(let i = x - 1; i <= x + 1; i++) {
            for(let j = y - 1; j <= y + 1; j++) {
                if(i === x && j === y) {
                    continue;
                }
                if(i < 0 || j < 0 || i >= this.height || j >= this.width) {
                    continue;
                }
                if(this.board[i][j] === -1) {
                    cnt++;
                }
            }
        }
        return cnt;
    }

    propagate(x, y, idxs = []) {
        x = parseInt(x);
        y = parseInt(y);

        if(this.isMine(x, y) || this.isFlagged(x, y)) {
            return idxs;
        }

        idxs.push(this.width * x + y);
        if(this.getNumber(x, y) > 0) {
            return idxs;
        }

        for(let i = x - 1; i <= x + 1; i++) {
            for(let j = y - 1; j <= y + 1; j++) {
                if(i === x && j === y) {
                    continue;
                }
                if(i < 0 || j < 0 || i >= this.height || j >= this.width) {
                    continue;
                }

                if(idxs.includes(this.width * i + j)) {
                    continue;
                }
                this.propagate(i, j, idxs);
            }
        }
        return idxs;
    }

    checkOpened() {
        this.numOfOpened++;
    }

    checkFlag(x, y) {
        x = parseInt(x);
        y = parseInt(y);

        if(x < 0 || y < 0 || x >= this.height || y >= this.width) {
            throw new RangeError('Please check the range.');
        }

        this.flaggedBoard[x][y] ^= true;
        if(this.isMine(x, y)) {
            if(this.isFlagged(x, y)) {
                this.leftMines--;
            } else {
                this.leftMines++;
            }
        }
    }

    getNumber(x, y) {
        x = parseInt(x);
        y = parseInt(y);

        if(x < 0 || y < 0 || x >= this.height || y >= this.width) {
            throw new RangeError('Please check the range.');
        }
        return this.board[x][y];
    }

    isMine(x, y) {
        return this.getNumber(x, y) === -1;
    }

    isFlagged(x, y) {
        x = parseInt(x);
        y = parseInt(y);

        if(x < 0 || y < 0 || x >= this.height || y >= this.width) {
            throw new RangeError('Please check the range.');
        }
        return this.flaggedBoard[x][y];
    }

    debugLogBoard() {
        for(let i = 0; i < this.height; i++) {
            let log = '';
            for(let j = 0; j < this.width; j++) {
                log += `  ${this.board[i][j]}`.slice(-3);
            }
            console.log(log);
        }
    }
}
