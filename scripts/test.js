!function() {

const bench = document.getElementById("test-bench");
const make = (text) => {
    const ret = document.createElement("div");
    ret.style.left = `${100 * Math.random()}%`;
    ret.style.animationDuration = `${10 + 40 * Math.random()}s`;
    ret.innerText = text;
    return ret;
}
const totalFlakes = 50;
const interval = 2000;
let start;

const snow = (timestamp) => {
    if(!start) start = timestamp;
    const progress = timestamp - start;

    bench.append(make("❄️"));

    if(progress < totalFlakes * interval) {
        setTimeout(() => requestAnimationFrame(snow), interval);
    }
}

requestAnimationFrame(snow);

}();