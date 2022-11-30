'use strict';
let right = document.querySelector('.rightRocket');
let left = document.querySelector('.leftRocket');
let startButton = document.querySelector('.start-button');
let startButtonAnim = document.querySelectorAll('.anim');
let scoreBoard = document.querySelector('.score');
let info = document.querySelectorAll('.controls');

// let hitSound = document.getElementById('hit');

let countDown = document.querySelector('.countDown');


const rightStyle = getComputedStyle(right);
const leftStyle = getComputedStyle(left);
const ballStyle = getComputedStyle(document.querySelector('.ball'));

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

let keyboard = {};

let movement = {};

let colors = ['#fee400', '#8b00fd', '#31b100'];

let randomMove = [['left', 'right'], ['up', 'down']];

let hits = 0;
// let hitSound = new Audio();
// hitSound.src = "hit.wav";

let hitSound = new Howl({
    src: ['hit.wav']
});

let ballSpeed = 2;

let roundEnd = false;


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

function ballMove() {
    if ((ball.y >= rightRocket.x - 20 && ball.y <= rightRocket.x + 80) && ball.x + ballSpeed >= 760) {
        movement['left'] = true;
        movement['right'] = false;
        hitSound.play();

        hits += 1;
        ballMovement();
    }
    if ((ball.y >= leftRocket.x - 20 && ball.y <= leftRocket.x + 80) && ball.x - ballSpeed <= 20) {
        movement['right'] = true;
        movement['left'] = false;
        hits += 1;
        hitSound.play();
        
        ballMovement();
    }
    if (ball.y - ballSpeed <= 0) {
        movement['up'] = false;
        movement['down'] = true;
        ballMovement();
    }
    if (ball.y + ballSpeed >= 480) {
        movement['up'] = true;
        movement['down'] = false;
        ballMovement();
    }
    if (ball.x < 0) {
        score.rightPlayer += 1;
        scoreBoard.innerText = score.leftPlayer + ' : ' + score.rightPlayer;
        startAgain();
    }
    if (ball.x > 780) {
        score.leftPlayer += 1;
        scoreBoard.innerText = score.leftPlayer + ' : ' + score.rightPlayer;
        startAgain();
    }
    if (!roundEnd) {
        ballMovement();
    }
}



function startAgain() {
    ball.x = 390;
    ball.y = 240;
    leftRocket.x = 210;
    rightRocket.x = 210;
    leftRocket.element.style.top = 210 + 'px';
    rightRocket.element.style.top = 210 + 'px';
    ball.element.style.top = ball.y + 'px';
    ball.element.style.left = ball.x + 'px';
    movement['up'] = false;
    movement['down'] = false;
    movement['left'] = false;
    movement['right'] = false;
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
        console.log(getRandomInt(2));
        movement[randomMove[0][getRandomInt(2)]] = true;
        movement[randomMove[1][getRandomInt(2)]] = true;
    }, 3000);
}

function gameLoop() {
    if (score.leftPlayer !== 5 && score.rightPlayer !== 5) {
        ballMove();
        controls();
    } else {
        ballSpeed = 2;
        movement['up'] = false;
        movement['down'] = false;
        countDown.style.display = 'none';
        startButton.style.display = 'block';
        startButton.style.opacity = 1;
        for (let i = 0; i < info.length; i++) {
            info[i].style.display = 'none';
        }
        startPressed();
    }
    if (hits % 5 == 0 && hits != 0 && ballSpeed <= 3) {
        ballSpeed += 0.1;
    }
}


function startPressed() {
    startButton.addEventListener('click', ()=> {
        for (let i = 0; i < info.length; i++) {
            info[i].style.display = 'none';
        }
        scoreBoard.innerText = '0 : 0';
        movement[randomMove[0][getRandomInt(2)]] = true;
        movement[randomMove[1][getRandomInt(2)]] = true;
        setTimeout(()=>{
            startButton.style.opacity = 0;
            setTimeout(()=>{startButton.style.display = 'none'}, 300);
        }, 300);
        score.leftPlayer = 0;
        score.rightPlayer = 0;
    });
}

function controls() {
    if (keyboard["ArrowUp"]) {
        if (rightRocket.x - 3 >= 0) {
            rightRocket.x -= 3;
            rightRocket.element.style.top = rightRocket.x + 'px';
        }
    }
    if (keyboard["KeyA"]) {
        if (leftRocket.x - 3 >= 0) {
            leftRocket.x -= 3;
            leftRocket.element.style.top = leftRocket.x + 'px';
        }
    }
    if (keyboard["ArrowDown"]) {
        if (rightRocket.x + 3 <= 420) {
            rightRocket.x += 3;
            rightRocket.element.style.top = rightRocket.x + 'px';
        }
    }
    if (keyboard["KeyZ"]) {
        if (leftRocket.x + 3 <= 420) {
            leftRocket.x += 3;
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
