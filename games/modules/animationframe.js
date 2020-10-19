class AnimationFrame {
    constructor() {
        if(!window?.requestAnimationFrame) {
            throw new Error(`This runtime doesn't support the window.requestAnimationFrame`);
        }

        this.id = null;
        this.starttime = null;
        this.callback = this.callback.bind(this);
    }

    callback(timestamp) {}

    start(init) {
        if(typeof init === 'function') {
            init();
        }
        this.id = window.requestAnimationFrame(this.callback);
    }

    step() {
        this.id = window.requestAnimationFrame(this.callback);
    }

    stop() {
        window.cancelAnimationFrame(this.id);
        this.starttime = null;
    }
}