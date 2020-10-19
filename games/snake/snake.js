class Snake {
    constructor() {
        this.segmentSize = null;
        this.snake = null;
        this.dir = null;
        this.food = null;
        this.field = null;
    }

    init(width, height, segmentSize) {
        this.segmentSize = segmentSize;
        this.width = Math.floor(width / this.segmentSize);
        this.height = Math.floor(height / this.segmentSize);
        this.dir = 0;
        this.snake = [
            { x: Math.floor(this.width / 2), y: Math.floor(this.height / 2) },
            { x: Math.floor(this.width / 2), y: Math.floor(this.height / 2) + 1 },
            { x: Math.floor(this.width / 2), y: Math.floor(this.height / 2) + 2 }
        ];
        this.food = {};

        this.field = [];
        for(let i = 0; i < this.height; i++) {
            this.field[i] = [];
            for(let j = 0; j < this.width; j++) {
                this.field[i][j] = false;
            }
        }

        for(let { x, y } of this.snake) {
            this.field[y][x] = true;
        }

        this.spreadFood();
    }

    spreadFood() {
        let x;
        let y;

        do {
            x = Math.floor(Math.random() * this.width);
            y = Math.floor(Math.random() * this.height);
        } while(this.field[y][x]);

        this.food.x = x;
        this.food.y = y;
    }

    changeDir(dir) {
        if((dir + 2) % 4 === this.dir) {
            return;
        }
        this.dir = dir;
    }

    move() {
        const head = { x: this.snake[0].x, y: this.snake[0].y };

        switch(this.dir) {
            case 0:
                this.snake = [
                    { x: head.x, y: head.y - 1 },
                    ...this.snake.slice(0, -1)
                ];
                break;
            case 1:
                this.snake = [
                    { x: head.x + 1, y: head.y },
                    ...this.snake.slice(0, -1)
                ];
                break;
            case 2:
                this.snake = [
                    { x: head.x, y: head.y + 1 },
                    ...this.snake.slice(0, -1)
                ];
                break;
            case 3:
                this.snake = [
                    { x: head.x - 1, y: head.y },
                    ...this.snake.slice(0, -1)
                ];
                break;
            default:
                return;
        }

        const newHead = this.snake[0];
        const newTail = this.snake.slice(-1)[0];
        try {
            this.field[newHead.y][newHead.x] = true;
            this.field[newTail.y][newTail.x] = false;
        } catch(err) {
            return;
        }
    }

    grow() {
        const [ frontTail, backTail ] = this.snake.slice(-2);
        if(frontTail.x === backTail.x) {
            this.snake.push({
                x: backTail.x,
                y: backTail.y + (frontTail.y < backTail.y ? 1 : -1)
            });
        } else {
            this.snake.push({
                x: backTail.x + (frontTail.x < backTail.x ? 1 : -1),
                y: backTail.y
            });
        }
    }

    collide() {
        const x0 = this.snake[0].x;
        const y0 = this.snake[0].y;
        if(x0 < 0 || x0 >= this.width || y0 < 0 || y0 >= this.height) {
            return true;
        }
        for(let { x, y } of this.snake.slice(1)) {
            if(x0 === x && y0 === y) {
                return true;
            }
        }
        return false;
    }

    isOnFood() {
        return this.snake[0].x === this.food.x && this.snake[0].y === this.food.y;
    }
}