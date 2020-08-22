!function() {

const TOTAL_FLAKES = 20;
const INTERVAL = 500;
const BASE_DURATION = 1;
const RANDOM_DURATION = 5;

const bench = document.getElementById("test-bench");
const make = (text) => {
    const ret = document.createElement("div");
    ret.style.left = `${100 * Math.random()}%`;
    ret.style.animationDuration = `${BASE_DURATION + RANDOM_DURATION * Math.random()}s`;
    ret.innerText = text;
    return ret;
}

let start;
const snow = (timestamp) => {
    if(!start) start = timestamp;
    const progress = timestamp - start;

    bench.append(make("💧"));

    if(progress < TOTAL_FLAKES * INTERVAL) {
        setTimeout(() => requestAnimationFrame(snow), INTERVAL);
    }
}

requestAnimationFrame(snow);

}();