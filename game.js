let colors = ['yellow', 'red', 'blue', 'violet', 'green'];
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let scoreblock = document.getElementById('score');
let scoreWin = document.getElementById('score-win');
let scoreLose = document.getElementById('score-lose');


function createBalloon() {
    let balloon = document.createElement("div");
    let randomColor = Math.floor(Math.random() * colors.length);
    let randomPos = Math.floor(Math.random() * 95);
    console.log(`balloon-${colors[randomColor]}`);
    balloon.classList.add("balloon", `balloon-${colors[randomColor]}`);
    balloon.style.left = `${randomPos}vw`;
    document.body.appendChild(balloon)
    animateBalloon(balloon);
}

    let balooninterval = setInterval(createBalloon,1200)

function animateBalloon(elem) {
    let pos = 100
    let randPos = (Math.random() * (0.4) + 0.3).toFixed(1);
    let interval = setInterval(frame,10)
    console.log(randPos);
    function frame() {
        if (pos <= -40) {
            clearInterval(interval)
        }
        else {

            pos= pos-randPos;
            elem.style.top =  pos + "vh"
        }
    }

}
let score = 0;
let total = 10;

function deleteBalloon(elem) {
    elem.remove();
    score++;
    scoreblock.innerText = score;
    scoreWin.innerText = score;
    scoreLose.innerText = score;
}

// let balloons = document.querySelector(".balloon");
// for (let i = 0; i < balloons.length; i++) {
//     balloons[i].addEventListener("click", () => deleteBalloon(balloons[i]));
// }

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("balloon")) {
        deleteBalloon(event.target);
    }
})



