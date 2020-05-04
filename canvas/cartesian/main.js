class Polynomial {
    constructor(equation) {

    }

    stripParentheses(equation) {

    }
}

class CartesianCoordinate {
    constructor(canvasElement) {
        this.initializeCoordinate(canvasElement);
        this.clear();
    }

    initializeCoordinate(canvasElement) {
        this.$ = canvasElement;
        this.ctx = canvasElement.getContext("2d");
        this.width = canvasElement.clientWidth;
        this.height = canvasElement.clientHeight;

        this.limit = {
            x: [-.5*this.width, .5*this.width],
            y: [-.5*this.height, .5*this.height]
        }

        this.tickEnabled = true;
        this.tickGap = { x: 20, y: 20 }
        this.tickSize = 5;

        this.pointSize = 3;
        this.pointStyle = {
            fillStyle: "black"
        }

        this.lineStyle = {
            strokeStyle: "black"
        };

        this.labelStyle = {
            fillStyle: "grey",
            font: "16px Arial"
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.plotLine([this.limit.x[0], 0], [this.limit.x[1], 0], { strokeStyle: "lightgrey" });
        this.plotLine([0, this.limit.y[0]], [0, this.limit.y[1]], { strokeStyle: "lightgrey" });
        if(this.tickEnabled) this.drawTick();
    }

    drawTick() {
        for(let i = 0; i < this.limit.x[1]/this.tickGap.x; i++) {
            this.plotLine(
                [i*this.tickGap.x, this.tickSize],
                [i*this.tickGap.x, -1*this.tickSize],
                { strokeStyle: "lightgrey" }
            );
        }
        for(let i = 1; i < this.limit.x[1]/this.tickGap.x; i++) {
            this.plotLine(
                [-1*i*this.tickGap.x, this.tickSize],
                [-1*i*this.tickGap.x, -1*this.tickSize],
                { strokeStyle: "lightgrey" }
            );
        }
        for(let i = 0; i < this.limit.y[1]/this.tickGap.y; i++) {
            this.plotLine(
                [this.tickSize, i*this.tickGap.y],
                [-1*this.tickSize, i*this.tickGap.y],
                { strokeStyle: "lightgrey" }
            );
        }
        for(let i = 1; i < this.limit.y[1]/this.tickGap.y; i++) {
            this.plotLine(
                [this.tickSize, -1*i*this.tickGap.y],
                [-1*this.tickSize, -1*i*this.tickGap.y],
                { strokeStyle: "lightgrey" }
            );
        }
    }

    convert(point) {
        return {
            x: point[0] + .5*this.width,
            y: -1*point[1] + .5*this.height
        }
    }

    plotPoint(point, style = {}) {
        const p = this.convert(point);
        for (let [key, value] of Object.entries({...this.pointStyle, ...style})) {
            this.ctx[key] = value;
        }
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, this.pointSize, 0, 2*Math.PI);
        this.ctx.fill();
    }

    plotLine(point1, point2, style = {}) {
        const p1 = this.convert(point1);
        const p2 = this.convert(point2);
        for (let [key, value] of Object.entries({...this.lineStyle, ...style})) {
            this.ctx[key] = value;
        }
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
    }

    label(text, point, style = {}) {
        const p = this.convert(point);
        for (let [key, value] of Object.entries({...this.labelStyle, ...style})) {
            this.ctx[key] = value;
        }
        this.ctx.fillText(text, p.x, p.y);
    }

    plot() {

    }
}

/******************************************************************************
 * Plotting Test
 ******************************************************************************/
const $canvas = document.getElementById("canvas");
const system = new CartesianCoordinate($canvas);

system.plotLine(
    [system.limit.x[0], system.limit.y[0]],
    [system.limit.x[1], system.limit.y[1]]
);

system.plotLine([100, 150], [101, 200]);

system.plotPoint([0, 0]);
system.plotPoint([300, 240]);
system.label("test", [300, 240]);