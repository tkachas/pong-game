'use strict';
let right = document.querySelector('.rightRocket');
let left = document.querySelector('.leftRocket');
let startButton = document.querySelector('.start-button');
let startButtonAnim = document.querySelectorAll('.anim');
let scoreBoard = document.querySelector('.score');
let info = document.querySelectorAll('.controls');
let fieldStyle = getComputedStyle(document.querySelector('.field'));
let playerInputs = document.querySelectorAll('.player');
let leftControl = document.querySelector('.control1');
let rightControl = document.querySelector('.control2');
// let hitSound = document.getElementById('hit');

let countDown = document.querySelector('.countDown');


const rightStyle = getComputedStyle(right);
const leftStyle = getComputedStyle(left);
const ballStyle = getComputedStyle(document.querySelector('.ball'));
const enlargerStyle = getComputedStyle(document.querySelector('.enlarger'));

// let leftIsUp = false;
// let rightIsUp = false;

let leftRocket = {
    x: parseInt(leftStyle.top),
    element: document.querySelector('.leftRocket')
};
let rightRocket = {
    x: parseInt(rightStyle.top),
    element: document.querySelector('.rightRocket')
};
let ball = {
    x: parseInt(ballStyle.left),
    y: parseInt(ballStyle.top),
    element: document.querySelector('.ball')
};

let score = {
    leftPlayer: 0,
    rightPlayer: 0
};

let enlarger = {
    x: parseInt(enlargerStyle.left),
    y: parseInt(enlargerStyle.top),
    element: document.querySelector('.enlarger')
}

let keyboard = {};

let movement = {};

let colors = ['#fee400', '#8b00fd', '#31b100'];

let randomMove = [['left', 'right'], ['up', 'down']];

let hits = 0;
// let hitSound = new Audio();
// hitSound.src = "hit.wav";

let goalSound = new Howl({
    src: ['goal.wav']
});
let wallHitSound = new Howl({
    src: ['wall-hit.mp3']
});

let ballSpeed = 2;
let rocketSpeed = 3;

let roundEnd = false;

let leftGoalRow = [];
let rightGoalRow = [];
let boostAllow = {
    playerLeft: false,
    playerRight: false
};

window.addEventListener('keydown', function(e){
  keyboard[e.code] = true;
});

window.addEventListener('keyup', function(e){
  keyboard[e.code] = false;
});

function ballMovement() {
    if (movement['left'] && movement['up']) {
        ball.x -= ballSpeed;
        ball.element.style.left = ball.x + 'px';
        ball.y -= ballSpeed;
        ball.element.style.top = ball.y + 'px';
    }
    if (movement['left'] && movement['down']) {
        ball.x -= ballSpeed;
        ball.element.style.left = ball.x + 'px';
        ball.y += ballSpeed;
        ball.element.style.top = ball.y + 'px';
    }
    if (movement['right'] && movement['up']) {
        ball.x += ballSpeed;
        ball.element.style.left = ball.x + 'px';
        ball.y -= ballSpeed;
        ball.element.style.top = ball.y + 'px';
    }
    if (movement['right'] && movement['down']) {
        ball.x += ballSpeed;
        ball.element.style.left = ball.x + 'px';
        ball.y += ballSpeed;
        ball.element.style.top = ball.y + 'px';
    }
}

console.log();

function ballMove() {
    if ((ball.y >= rightRocket.x - parseInt(ballStyle.width) && ball.y <= rightRocket.x + parseInt(rightStyle.height)) && ball.x + ballSpeed >= 750) {
        if (ball.y >= rightRocket.x - (parseInt(ballStyle.width) + 1) && ball.y <= rightRocket.x + 1) {
            movement['down'] = false;
            movement['up'] = true;
        }
        if (ball.y >= rightRocket.x + (parseInt(rightStyle.height) - 1) && ball.y <= rightRocket.x + parseInt(rightStyle.height)) {
            movement['down'] = true;
            movement['up'] = false;
        }
        movement['left'] = true;
        movement['right'] = false;
        wallHitSound.play();

        hits += 1;
        ballMovement();
    }
    if ((ball.y >= leftRocket.x - parseInt(ballStyle.width) && ball.y <= leftRocket.x + parseInt(leftStyle.height)) && ball.x - ballSpeed <= 30) {
        if (ball.y >= leftRocket.x - (parseInt(ballStyle.width) + 1) && ball.y <= leftRocket.x + 1) {
            movement['down'] = false;
            movement['up'] = true;
        }
        if (ball.y >= leftRocket.x + (parseInt(leftStyle.height) - 1) && ball.y <= leftRocket.x + parseInt(leftStyle.height)) {
            movement['down'] = true;
            movement['up'] = false;
        }
        movement['right'] = true;
        movement['left'] = false;
        hits += 1;
        wallHitSound.play();
        
        ballMovement();
    }
    if (ball.y - ballSpeed <= 0) {
        movement['up'] = false;
        movement['down'] = true;
        wallHitSound.play();
        ballMovement();
    }
    if (ball.y + ballSpeed >= 480) {
        movement['up'] = true;
        movement['down'] = false;
        wallHitSound.play();
        ballMovement();
    }
    if (ball.x < 0) {
        goalSound.play();
        score.rightPlayer += 1;
        rightGoalRow.push(1);
        leftGoalRow = [];
        if (rightGoalRow.length == 2) {
            boostAllow.playerRight = true;
            rightGoalRow = [];
        }
        scoreBoard.innerText = score.leftPlayer + ' : ' + score.rightPlayer;
        ballSpeed = 2;
        rocketSpeed = 3;
        startAgain();
    }
    if (ball.x > 780) {
        goalSound.play();
        score.leftPlayer += 1;
        rightGoalRow = [];
        leftGoalRow.push(1);
        if (leftGoalRow.length == 2) {
            boostAllow.playerLeft = true;
            leftGoalRow = [];
        }
        scoreBoard.innerText = score.leftPlayer + ' : ' + score.rightPlayer;
        ballSpeed = 2;
        rocketSpeed = 3;
        startAgain();
    }
    if (!roundEnd) {
        ballMovement();
    }
}



function startAgain() {
    ball.x = 390;
    ball.y = 240;
    leftRocket.x = ((500 - parseInt(leftStyle.height))/2);
    rightRocket.x = ((500 - parseInt(rightStyle.height))/2);
    leftRocket.element.style.top = ((500 - parseInt(leftStyle.height))/2) + 'px';
    rightRocket.element.style.top = ((500 - parseInt(rightStyle.height))/2) + 'px';
    ball.element.style.top = ball.y + 'px';
    ball.element.style.left = ball.x + 'px';
    movement['up'] = false;
    movement['down'] = false;
    movement['left'] = false;
    movement['right'] = false;
    if (score.leftPlayer !== 5 && score.rightPlayer !== 5) {
        ballSpeed = 2;
        setTimeout(()=>{
            countDown.style.display = 'flex';
            countDown.innerText = '3';
        }, 0);
        setTimeout(()=>{
            countDown.innerText = '2';
        }, 1000);
        setTimeout(()=>{
            countDown.innerText = '1';
        }, 2000);
        setTimeout(()=>{
            countDown.style.display = 'none';
            movement[randomMove[0][getRandomInt(2)]] = true;
            movement[randomMove[1][getRandomInt(2)]] = true;
            boostAction(enlarger);
        }, 3000);
    }
}

function gameLoop() {
    if (score.leftPlayer !== 5 && score.rightPlayer !== 5) {
        ballMove();
        controls();
    } else {
        makeBlocksAppear();
    }
    if (hits == 5 && hits != 0 && ballSpeed <= 4) {
        ballSpeed += 0.5;
        hits = 0;
        if (ballSpeed >= 3) {
            rocketSpeed += 1;
        }
    }
}


function startPressed() {
    startButton.addEventListener('click', ()=> {
        makeBlocksDisappear();
        movement['left'] = true;
        movement['up'] = true;
        setTimeout(()=>{
            startButton.style.opacity = 0;
            setTimeout(()=>{startButton.style.display = 'none'}, 300);
        }, 300);
        score.leftPlayer = 0;
        score.rightPlayer = 0;
    });
}

function makeBlocksDisappear() {
    scoreBoard.classList.remove('result');
    document.querySelector('.field').style.cursor = 'none';
    leftControl.style.display = 'none';
    rightControl.style.display = 'none';
    for (let i = 0; i< playerInputs.length; i++) {
        playerInputs[i].readOnly = true;
        playerInputs[i].classList.add('started');
    }
    startButton.style.cursor = 'none';
    for (let i = 0; i < info.length; i++) {
        info[i].style.display = 'none';
    }
    scoreBoard.innerText = '0 : 0';
}

function makeBlocksAppear() {
    document.querySelector('.field').style.cursor = 'auto';
    startButton.style.cursor = 'auto';
    ballSpeed = 2;
    rocketSpeed = 3;
    movement['up'] = false;
    movement['down'] = false;
    countDown.style.display = 'none';
    startButton.style.display = 'block';
    startButton.style.opacity = 1;
    for (let i = 0; i< playerInputs.length; i++) {
        playerInputs[i].readOnly = false;
        playerInputs[i].classList.remove('started');
    }
    scoreBoard.classList.add('result');
    for (let i = 0; i < info.length; i++) {
        info[i].style.display = 'none';
    }
}

console.log(parseInt(enlargerStyle.left));

function boostAction(boost) {
    let text = enlarger.element.innerText;
    let countDown;
    if (boostAllow.playerRight) {
        boost.element.style.display = 'flex';
        rightRocket.element.style.height = 200 +'px';
        setTimeout(()=>{
            rightRocket.element.style.height = 100 +'px';
            boost.element.style.display = 'none';
        }, 10000);
        countDown = 10;
        for (let i = 0; i <= 10000; i += 1000) {
            setTimeout(()=>{
                enlarger.element.innerText = text;
                enlarger.element.innerText += ` - ${countDown}`;
                countDown--;
                console.log('haha');
            }, i);
        }
        boostAllow.playerRight = false;
    }
    if(boostAllow.playerLeft) {
        boost.element.style.display = 'flex';
        leftRocket.element.style.height = 200 +'px';
        setTimeout(()=>{
            leftRocket.element.style.height = 100 +'px';
            boost.element.style.display = 'none';
        }, 10000);
        countDown = 10;
        for (let i = 0; i <= 10000; i += 1000) {
            setTimeout(()=>{
                enlarger.element.innerText = text;
                enlarger.element.innerText += ` - ${countDown}`;
                countDown--;
                console.log('haha');
            }, i);
        }
        boostAllow.playerLeft = false;
    }
    
}

function controls() {
    if (keyboard["ArrowUp"]) {
        if (rightRocket.x - rocketSpeed > 0) {
            rightRocket.x -= rocketSpeed;
            rightRocket.element.style.top = rightRocket.x + 'px';
        }
    }
    if (keyboard["KeyA"]) {
        if (leftRocket.x - rocketSpeed > 0) {
            leftRocket.x -= rocketSpeed;
            leftRocket.element.style.top = leftRocket.x + 'px';
        }
    }
    if (keyboard["ArrowDown"]) {
        if (rightRocket.x + rocketSpeed <= (500 - parseInt(rightStyle.height))) {
            rightRocket.x += rocketSpeed;
            rightRocket.element.style.top = rightRocket.x + 'px';
        }
    }
    if (keyboard["KeyZ"]) {
        if (leftRocket.x + rocketSpeed <= (500 - parseInt(leftStyle.height))) {
            leftRocket.x += rocketSpeed;
            leftRocket.element.style.top = leftRocket.x + 'px';
        }
    }
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

let speed = 200;

startPressed();
setInterval(function(){gameLoop();}, 1000 / speed)
