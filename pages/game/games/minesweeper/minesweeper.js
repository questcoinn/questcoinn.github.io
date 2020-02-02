let util, game;

window.onload = () => {
  util = new Util();
  game = new Game();
}

class Game {
  constructor() {
    this.makeMethods();

    this.container = document.querySelector("#container");
    this.controller = this.container.querySelector("#controller");
    this.info = this.container.querySelector("#info");
    this.board = this.container.querySelector("#board");
    this.result = this.container.querySelector("#result");

    this.init();

    this.info.querySelector("#startBtn").addEventListener("click", this.init)
    this.board.addEventListener("click", this.start);
  }

  _init() {
    const game = this;
    return (e) => {
      game.info.querySelector("#remains").innerText = game.controller.querySelector("#mines").value;
      game.info.querySelector("#time").innerText = 0;
      game.result.innerText = "";
      game.progress = 0; // 0: before, 1: ongoing, 2: finished

      const len = parseInt(game.controller.querySelector("#len").value);
      const minenums = parseInt(game.controller.querySelector("#mines").value);

      game.board.querySelector("tbody").innerHTML = "";
      game.setBoard(len, minenums);
      if(isNaN(game.len) || isNaN(game.minenums)) return;
      game.putBoard();
      game.addEvents();
    }
  }

  _start() {
    const game = this;
    return (e) => {
      // progress가 0일 때만 실행
      const self = e.target;
      
      if(game.progress === 0 && self.tagName === "TD") {
        const [ x, y ] = game.getIndex(self);
        const num = x * game.len + y;
        game.generateMines(num);
        game.makeNumbers();

        game.progress = 1;

        self.click();
        
        // 시간흐르게
        game.info.querySelector("#time").innerText = 1;

        game.timer = setInterval(() => {
          const sec = parseInt(game.info.querySelector("#time").innerText);
          game.info.querySelector("#time").innerText = sec + 1;
        }, 1000);
      }
    }
  }

  makeMethods() {
    this.drag = this._drag();
    this.endDrag = this._endDrag();
    this.init = this._init();
    this.manipulateFlag = this._manipulateFlag();
    this.open = this._open();
    this.openAround = this._openAround();
    this.start = this._start();
  }

  win() {
    this.board.querySelectorAll("td.closed").forEach((x) => x.click());
    this.progress = 2;

    clearInterval(this.timer);
    this.result.innerText = "win!";
  }

  lose(node) {
    this.mines.forEach((x) => {
      x.className = "mineRevealed";
      x.innerText = "*";
    });
    node.className = "mineClicked";
    this.progress = 2;

    clearInterval(this.timer);
    this.result.innerText = "lose...";
  }

  setBoard(len, minenums) {
    if(len <= 0) {
      alert("크기를 0이하로 설정할 수 없습니다.");
      this.len = NaN;

    } else if(len > 16) {
      alert("크기가 너무 큽니다.\n최대크기: 16");
      this.len = NaN;

    } else if(!Number.isInteger(len)) {
      alert("정수로 설정해주세요.");
      this.len = NaN;
    
    } else {
      this.len  = len;
      this.size = len**2;
    }

    if(minenums <= 0) {
      alert("지뢰갯수를 0개 이하로 설정할 수 없습니다.");
      this.minenums = NaN;

    } else if(mines >= len**2) {
      alert("지뢰갯수가 너무 많습니다.");
      this.minenums = NaN;

    } else if(!Number.isInteger(minenums)) {
      alert("정수로 설정해주세요.");
      this.minenums = NaN;

    } else {
      this.minenums = minenums;
    }

    this.mineremains = this.minenums;
  }

  putBoard() {
    this.virtualDOM = document.createElement("div"); // 임시메모리

    for(let i = 0; i < this.len; i++) {
      const row = document.createElement("tr");
      row.setAttribute("num", i); // 필요?

      for(let j = 0; j < this.len; j++) {
        const data = document.createElement("td");
        
        data.setAttribute("num", j); // 필요?
        data.setAttribute("class", "closed");
        data.setAttribute("draggable", "true");
        
        row.appendChild(data);
      }

      this.virtualDOM.appendChild(row);
    }

    [...this.virtualDOM.children].forEach((x) => {
      this.board.querySelector("tbody").appendChild(x);
    });
  }

  generateMines(except) {
    const array = [...Array(this.size).keys()];
    if(Number.isInteger(except)) array.splice(except, 1)[0];
    const mineIndexes = [];
    
    for(let i = 0; i < this.minenums; i++) {
      const randIdx = Math.floor(Math.random() * array.length);
      const el = array.splice(randIdx, 1)[0];
      mineIndexes.push(el);
    }

    mineIndexes.sort((x, y) => x - y);

    this.mineIndexes = mineIndexes.map((x) => [ Math.floor(x / this.len), x % this.len ]);

    const rows = this.board.querySelectorAll("tr");
    
    this.mines = this.mineIndexes.map((a) => {
      const x = a[0], y = a[1];
      return rows[x].querySelectorAll("td")[y];
    });
  }

  makeNumbers() {
    const rows = this.board.querySelectorAll("tr");
    const nums = [];

    for(let i = 0; i < this.len; i++) {
      const numEl = [];

      for(let j = 0; j < this.len; j++) {
        const cell = rows[i].querySelectorAll("td")[j];
        let num;

        if(this.mines.includes(cell)) {
          num = -1;

        } else {
          const around = this.getAround([ i, j ]);
          num = around.reduce((acc, cur) => this.mines.includes(cur) ? ++acc : acc, 0);
        }

        numEl.push(num);
      }

      nums.push(numEl);
    }

    this.nums = nums;
  }

  addEvents() {
    this.board.addEventListener("dragstart", this.hideDragPreview);
    this.board.addEventListener("contextmenu", this.forbidCtxmenu);

    this.board.addEventListener("mousedown", this.drag);
    this.board.addEventListener("dragenter", this.drag);
    this.board.addEventListener("dragleave", this.endDrag);

    this.board.addEventListener("click", this.open);
    this.board.addEventListener("click", this.openAround);

    this.board.addEventListener("contextmenu", this.manipulateFlag)
  }

  getAround(pos) {
    const x = pos[0], y = pos[1];
    const rows = this.board.querySelectorAll("tr");
    const newArray = [];
    
    for(let i = x-1; i <= x+1; i++) {
      if(i < 0 || i >= this.len) continue;

      for(let j = y-1; j <= y+1; j++) {
        if(j < 0 || j >= this.len) continue;
        if(i === x && j === y) continue;

        newArray.push(rows[i].querySelectorAll("td")[j]);
      }
    }

    return newArray;
  }

  getIndex(node) {
    const rowNum  = parseInt(node.parentElement.getAttribute("num"));
    const dataNum = parseInt(node.getAttribute("num"));

    return [ rowNum, dataNum ];
  }

  getColor(num) {
    return num === 1 ? "blue"
         : num === 2 ? "green"
         : num === 3 ? "red"
         : num === 4 ? "purple"
         : num === 5 ? "maroon"
         : num === 6 ? "turquoise"
         : num === 7 ? "black"
         : num === 8 ? "gray" : "black";
  }

  /** events **/
  hideDragPreview(e) {
    const self = e.target;
    
    if(self.tagName === "TD") {
      var preview = self.cloneNode(true);
      preview.style.display = "none";
      document.body.appendChild(preview);
      e.dataTransfer.setDragImage(preview, 0, 0);
      document.body.removeChild(preview);
    }
  }

  _drag() {
    const game = this;
    return (e) => {
      if(game.progress === 2) return;
      const self = e.target;
      
      if(self.tagName === "TD" && self.classList.contains("closed")) {
        if(util.mouseStatus === 2) {
          self.classList.add("dragging");
        }
      }
    }
  }

  _endDrag() {
    const game = this;
    return (e) => {
      if(game.progress === 2) return;
      const self = e.target;
      
      if(self.tagName === "TD" && self.classList.contains("closed")) {
        if(util.mouseStatus === 2 || util.mouseStatus === 3) {
          self.classList.remove("dragging");
        }
      }
    }
  }

  _open() {
    const game = this;
    return (e) => {
      if(game.progress === 2) return;
      const self = e.target;
      
      if(game.progress === 1 && self.tagName === "TD") {
        if(self.classList.contains("closed")) {
          if(e.which === 1 && (util.mouseStatus === 0 || util.mouseStatus === 1)) {

            const [ x, y ] = game.getIndex(self);
            const _ = game.nums[x][y];
            const num = _ === -1 ? "*" : _ === 0 ? "" : _;
            self.className = "opened";
            self.style.color = game.getColor(num);
            self.innerText = num;

            if(num === "*") {
              game.lose(self);
            }
            
            if(num === "") {
              const around = game.getAround([ x, y ]);
              around.forEach((a) => a.click());
            }

          }
        }
      }
    }
  }

  _openAround() {
    const game = this;
    return (e) => {
      if(game.progress === 2) return;
      const self = e.target;
      
      if(game.progress === 1 && self.tagName === "TD") {
        if(self.className === "opened") {
          if((e.which === 1 && util.mouseStatus === 1) || (e.which === 3 && util.mouseStatus === 2)) {

            // 동시처리
            const [ x, y ] = game.getIndex(self);
            const around = game.getAround([ x, y ]);
            
            const n = game.nums[x][y];
            const flags = around.reduce((acc, cur) => cur.className === "flagged" ? ++acc : acc, 0);
            const opens = around.reduce((acc, cur) => cur.className === "opened" ? ++acc : acc, 0);
            const allOpened = around.length === flags + opens;
            
            if(!allOpened && n === flags) {
              around.forEach((a) => {
                if(a.className !== "flagged")
                  a.click();
              });
            }

          }
        }
      }
    }
  }

  _manipulateFlag() {
    const game = this;
    return (e) => {
      e.preventDefault();
      if(game.progress === 2) return;
      const self = e.target;
      
      if(self.tagName === "TD") {
        if(e.which === 3 && util.mouseStatus === 0) {

          if(self.classList.contains("closed")) {
            self.className = "flagged";
            game.mineremains--;

          } else if(self.className === "flagged") {
            self.className = "closed";
            game.mineremains++;
          }

          game.info.querySelector("#remains").innerText = game.mineremains;

          if(game.mineremains === 0) {
            if(game.mines.every((x) => x.className === "flagged"))
              game.win();
          }

        }
      }
    }
  }
}