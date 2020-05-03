/**
 * @todo
 * 클릭/우클릭과 동시클릭 구분
 * 마우스 객체 하나 만들기 => leftdown, rightdown
 * up 시점에 leftdown, rightdown 보고 행동 결정
 */


/******************************************************************************
 * TEST
 ******************************************************************************/
// const getWhichMouse = (which) => {
//     switch(which) {
//         case 1:
//             return "left";
//         case 2:
//             return "wheel";
//         case 3:
//             return "right";
//         default:
//             return "";
//     } 
// }

// const $test = document.getElementsByClassName("test")[0];

// $test.addEventListener("click", (e) => {
//     console.log(`click`, getWhichMouse(e.which));
// });
// $test.addEventListener("contextmenu", (e) => {
//     e.preventDefault();
//     console.log(`context`, getWhichMouse(e.which));
// });
// $test.addEventListener("mousedown", (e) => {
//     console.log(`down`, getWhichMouse(e.which));
// });
// $test.addEventListener("mouseup", (e) => {
//     console.log(`up`, getWhichMouse(e.which));
// });
// $test.addEventListener("mouseenter", (e) => {
//     console.log("enter");
// });
// $test.addEventListener("mouseleave", (e) => {
//     console.log("leave");
// });