class Animation extends AnimationFrame {
    constructor(game, ctx, $cur, $max) {
        super();
        this.game = game;
        this.ctx = ctx;
        this.$cur = $cur;
        this.$max = $max;
        this.max = 3;
    }

    callback(timestamp) {
        this.step();
        if(!this.starttime) {
            this.starttime = timestamp;
        }
        if(timestamp - this.starttime > 80) {
            this.starttime = timestamp;

            drawFrame(this.game, this.ctx);
            if(this.game.isOnFood()) {
                this.game.grow();
                this.game.spreadFood();
                this.$cur.textContent = this.game.snake.length;
                if(this.max < this.game.snake.length) {
                    this.max = this.game.snake.length;
                    this.$max.textContent = this.max;
                }
            }

            this.game.move();
            if(this.game.collide()) {
                this.stop();
                saveMaxSize(this.max);
                setTimeout(() => alert('lose'), 80);
            }
        }
    }
}

/** @main */
(() => {
    'use strict';

    const $currentSize = document.getElementById('current-size');
    const $maxSize = document.getElementById('max-size');
    const $startBtn = document.getElementById('start-btn');
    const $canvas = document.getElementById('canvas');

    const ctx = $canvas.getContext('2d');
    const game = new Snake();
    const animation = new Animation(game, ctx, $currentSize, $maxSize);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    $maxSize.textContent = loadMaxSize();

    document.addEventListener('keydown', (e) => {
        const { key } = e;
        
        switch(key) {
            case 'ArrowUp':
                game.changeDir(0);
                break;
            case 'ArrowRight':
                game.changeDir(1);
                break;
            case 'ArrowDown':
                game.changeDir(2);
                break;
            case 'ArrowLeft':
                game.changeDir(3);
                break;
            default:
                return;
        }
    });

    $startBtn.addEventListener('click', (e) => {
        animation.stop();
        game.init(parseInt($canvas.width), parseInt($canvas.height), 40);
        animation.start(() => {
            $currentSize.textContent = game.snake.length;
            $maxSize.textContent = loadMaxSize();
        });
    });
})();

function drawFrame(game, ctx) {
    const s = game.segmentSize;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, game.width * s, game.height * s);

    ctx.fillStyle = 'lime';
    ctx.fillRect(game.food.x * s, game.food.y * s, s, s);
    ctx.strokeRect(game.food.x * s, game.food.y * s, s, s);

    ctx.fillStyle = 'white';
    for(let segment of game.snake) {
        ctx.fillRect(segment.x * s, segment.y * s, s, s);
        ctx.strokeRect(segment.x * s, segment.y * s, s, s);
    }

}

function saveMaxSize(size) {
    localStorage?.setItem('snake.max', size);
}

function loadMaxSize() {
    return localStorage?.getItem('snake.max') || 3;
}