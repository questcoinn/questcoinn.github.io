const DOM = {
    id: {},
    class: {}
}

DOM.id['hour'] = document.getElementById('hour');
DOM.id['min'] = document.getElementById('min');
DOM.id['sec'] = document.getElementById('sec');
DOM.id['btn-sync'] = document.getElementById('btn-sync');

let hour;
let min;
let sec;

const updateTime = () => {
    const time = new Date();
    hour = time.getHours() % 12;
    min = time.getMinutes();
    sec = time.getSeconds();
}

const updateDOM = () => {
    DOM.id['hour'].style.transform = `translate(-50%, 50%) rotate(${360 * (3600*hour + 60*min + sec)/43200}deg)`;
    DOM.id['min'].style.transform = `translate(-50%, calc(2 * var(--clock-font-size))) rotate(${(60*min + sec) / 10}deg)`;
    DOM.id['sec'].style.transform = `translate(-50%, var(--clock-font-size)) rotate(${6 * sec}deg)`;
}

let prevTimestamp;

const updateClock = (timestamp) => {
    if(!prevTimestamp) prevTimestamp = timestamp;

    requestAnimationFrame(updateClock);

    if(timestamp - prevTimestamp >= 250) {
        prevTimestamp = timestamp;
        updateTime();
        updateDOM();
    }
}

window.onload = () => {
    requestAnimationFrame(updateClock);

    DOM.id['btn-sync'].addEventListener('click', updateTime);

    console.log(`I'm a clock!`);
}
