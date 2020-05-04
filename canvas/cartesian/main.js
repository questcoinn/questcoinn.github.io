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
        this.pointStyle = "black";

        this.lineStyle = "black";
    }

    clear() {
        console.log(this);
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.plotLine([this.limit.x[0], 0], [this.limit.x[1], 0]);
        this.plotLine([0, this.limit.y[0]], [0, this.limit.y[1]]);
        this.drawTick();
    }

    drawTick() {
        if(!this.tickEnabled) return;
        for(let i = 0; i < this.limit.x[1]/this.tickGap.x; i++) {
            this.plotLine(
                [i*this.tickGap.x, this.tickSize],
                [i*this.tickGap.x, -1*this.tickSize]
            );
        }
        for(let i = 1; i < this.limit.x[1]/this.tickGap.x; i++) {
            this.plotLine(
                [-1*i*this.tickGap.x, this.tickSize],
                [-1*i*this.tickGap.x, -1*this.tickSize]
            );
        }
        for(let i = 0; i < this.limit.y[1]/this.tickGap.y; i++) {
            this.plotLine(
                [this.tickSize, i*this.tickGap.y],
                [-1*this.tickSize, i*this.tickGap.y]
            );
        }
        for(let i = 1; i < this.limit.y[1]/this.tickGap.y; i++) {
            this.plotLine(
                [this.tickSize, -1*i*this.tickGap.y],
                [-1*this.tickSize, -1*i*this.tickGap.y]
            );
        }
    }

    convert(point) {
        return {
            x: point[0] + .5*this.width,
            y: -1*point[1] + .5*this.height
        }
    }

    plotPoint(point) {
        const p = this.convert(point);
        this.fillStyle = this.pointStyle;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, this.pointSize, 0, 2*Math.PI);
        this.ctx.fill();
    }

    plotLine(point1, point2) {
        const p1 = this.convert(point1);
        const p2 = this.convert(point2);
        this.ctx.strokeStyle = this.lineStyle;
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
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

system.plotLine([100, 150], [100, 151]);

system.plotPoint([0, 0]);
system.plotPoint([300, 240]);