class Stopwatch extends AnimationFrame {
    constructor(game, $time) {
        super();
        this.game = game;
        this.$time = $time;
    }

    callback(timestamp) {
        if(this.game.status !== 'ended') {
            this.step();
        }
        if(!this.starttime) {
            this.starttime = timestamp;
        }
        this.$time.innerText = ((timestamp - this.starttime) / 1000).toFixed(2);
    }
}

/** @main */
(() => {
    'use strict';

    const $width = document.getElementById('width');
    const $height = document.getElementById('height');
    const $numOfMines = document.getElementById('num-of-mines');

    const $time = document.getElementById('time');
    const $startBtn = document.getElementById('start-btn');
    const $minesLeft = document.getElementById('mines-left');
    const $board = document.getElementById('board');

    const game = new Minesweeper();
    const stopwatch = new Stopwatch(game, $time);

    window.addEventListener('load', (e) => {
        stopwatch.stop();
        setBoard($width.value, $height.value, $board);
        game.init($width.value, $height.value, $numOfMines.value);
        $time.innerText = 0;
        $minesLeft.innerText = game.numOfMines;
    });
    
    $startBtn.addEventListener('click', (e) => {
        stopwatch.stop();
        setBoard($width.value, $height.value, $board);
        game.init($width.value, $height.value, $numOfMines.value);
        $time.innerText = 0;
        $minesLeft.innerText = game.numOfMines;
    });

    $board.addEventListener('click', (e) => {
        const $target = e.target;
        
        if(!$target.classList.contains('cell')) {
            return false;
        }

        if(game.status === 'ended') {
            return false;
        }
        
        const { i, j } = $target.dataset;
        
        if(game.status === 'initialized') {
            game.generateMines(i, j);
            stopwatch.start();
        }

        if(game.status === 'ongoing') {
            if(!game.isMine(i, j)) {
                for(let idx of game.propagate(i, j)) {
                    const x = Math.floor(idx / game.width);
                    const y = idx % game.width;
                    open(game, getCell($board, x, y));
                };
            } else {
                stopwatch.stop();
                open(game, getCell($board, i, j), true);
                end(game, 'lose', document.getElementsByClassName('cell'));
            }

            if(game.numOfOpened + game.numOfMines === game.numOfCells) {
                stopwatch.stop();
                end(game, 'win', document.getElementsByClassName('cell'));
            }
        }
    });

    $board.addEventListener('contextmenu', (e) => {
        const $target = e.target;
        
        if(!$target.classList.contains('cell')) {
            return false;
        }

        if(game.status !== 'ongoing') {
            return false;
        }

        e.preventDefault();
        toggleFlag(game, $target);

        const prev = parseInt($minesLeft.innerText);
        if($target.classList.contains('closed')) {
            $minesLeft.innerText = prev + 1;
        }
        if($target.classList.contains('flagged')) {
            $minesLeft.innerText = prev - 1;
        }

        if(game.leftMines === 0) {
            stopwatch.stop();
            end(game, 'win', document.getElementsByClassName('cell'));
        }
    });
})();

function setBoard(width, height, $target) {
    $target.innerHTML = '';

    for(let i = 0; i < parseInt(height); i++) {
        const row = document.createElement('div');
        row.classList.add('row');

        for(let j = 0; j < parseInt(width); j++) {
            const cell = document.createElement('span');
            cell.classList.add('cell', 'closed');
            cell.dataset.i = i;
            cell.dataset.j = j;
            row.appendChild(cell);
        }

        $target.appendChild(row);
    }
}

function open(game, $target, error = false) {
    if($target.classList.contains('opened')) {
        return;
    }

    const { i, j } = $target.dataset;
    const num = game.getNumber(i, j);

    $target.classList.remove('closed', 'flagged');
    $target.classList.add(error ? 'error' : 'opened');
    game.checkOpened();

    if(num > 0) {
        $target.innerText = num;
        $target.classList.add(`num-${num}`);
    }
    if(num === -1) {
        $target.classList.add('mine');
    }
}

function toggleFlag(game, $target) {
    if($target.classList.contains('opened')) {
        return;
    }

    const { i, j } = $target.dataset;

    $target.classList.toggle('closed');
    $target.classList.toggle('flagged');
    game.checkFlag(i, j);
}

function getCell($board, i, j) {
    return $board.querySelector(`[data-i="${i}"][data-j="${j}"]`);
}

function end(game, prompt, cells) {
    alert(prompt);
    for(let $cell of cells) {
        if($cell.classList.contains('opened') || $cell.classList.contains('error')) {
            continue;
        }
        if($cell.classList.contains('closed')) {
            open(game, $cell);
        }
        if($cell.classList.contains('flagged')) {
            const { i, j } = $cell.dataset;
            if(!game.isMine(i, j)) {
                open(game, $cell, true);
            }
        }
    }
    game.setStatus('ended');
}