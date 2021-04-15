let colors = ['yellow', 'red', 'blue', 'violet', 'green'];
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let scoreblock = document.getElementById('score');
let scoreWin = document.getElementById('score-win');
let scoreLose = document.getElementById('score-lose');
let missed = 0;
let score = 0;
let total = 10;
let shadow = document.querySelector(".shadow")
let win = document.querySelector(".win");
let lose = document.querySelector(".lose")
let restartbtn = document.getElementsByClassName("restart")
let homebtn = document.getElementsByClassName("gohome")

let home = document.querySelector(".home")
let easybtn = document.querySelector("#easy")
let hardbtn = document.querySelector("#hard")

let intervals = []
easybtn.addEventListener("click",() => easy())
hardbtn.addEventListener("click",() => hard())




function easy() {
    home.style.display = "none"
    let ballooninterval1 = setInterval(createBalloon, 1200);
    intervals = [ballooninterval1];
    total = 35;
    console.log(total);
    
}

function hard() {
    home.style.display = "none"
    let ballooninterval1 = setInterval(createBalloon, 1200);
    let ballooninterval2 = setInterval(createBalloon, 1000);
    intervals = [ballooninterval1, ballooninterval2];
    total = 50;
    console.log(total);
}       

console.log(total);


function createBalloon() { 
    let balloon = document.createElement("div");
    let randomColor = Math.floor(Math.random() * colors.length);
    let randomPos = Math.floor(Math.random() * 95);
    console.log(`balloon-${colors[randomColor]}`);
    balloon.classList.add("balloon", `balloon-${colors[randomColor]}`);
    balloon.style.left = `${randomPos}vw`;
    document.body.appendChild(balloon);
    animateBalloon(balloon);
    balloon.addEventListener("click", () => deleteBalloon(balloon));
}


function animateBalloon(elem) {
    let pos = 100
    let randPos = (Math.random() * (0.3) + 0.3).toFixed(1);
    let interval = setInterval(frame, 10);
    console.log(randPos);
    function frame() {
        if (pos <= -40) {
            clearInterval(interval);
            missed++;
            if (missed > 5) {
                gameOver();
            }
        }
        else {

            pos= pos-randPos;
            elem.style.top = pos + "vh";
        }
    }

}


function deleteBalloon(elem) {
    elem.remove();
    score++;
    scoreblock.innerText = score;
    scoreWin.innerText = score;
    scoreLose.innerText = score;
}

function gameOver() {
    intervals.map((interval) => {
        clearInterval(interval)

    })
    if (score > total) {
        shadow.style.display = "block"
        win.style.display = "block";
        lose.style.display = "none"

    }
    else {
        shadow.style.display = "block"
        lose.style.display = "block";
        win.style.display = "none";

    }
}




for (let i = 0; i < 2; i++){
    restartbtn[i].addEventListener("click", () => {
        score = 0;
        missed = 0;
        scoreblock.innerText = score;
        shadow.style.display = "none";
        console.log("clicked");
        let balooninterval = setInterval(createBalloon, 1200);
        
    })
    homebtn[i].addEventListener("click", () => location.reload())
}



