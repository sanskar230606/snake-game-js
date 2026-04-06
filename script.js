const board = document.querySelector(".board");
const blockHeight = 50;
const blockWidth = 50;
const coloums = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
let snakeSpeed = 200;

let startButton = document.querySelector(".modal .start-game .btn-start");
let reStartButton = document.querySelector(".modal .game-over .btn-restart");
let modal = document.querySelector(".modal");
let startGameModal = document.querySelector(".start-game");
let gameOverModal = document.querySelector(".game-over");
let highScoreElement = document.querySelector(".infos .info #high-score");
let scoreElement = document.querySelector(".infos .info #score");
let timeElement = document.querySelector(".infos .info #time");
highScore = localStorage.getItem("highScore").toString()||0;
score = 0;
time = `00:00`;

// for(let i=0 ;i< rows*coloums; i++){
//     const block = document.createElement("div");
//     block.classList.add("block");
//     board.appendChild(block);
// }
let blocks = [];
let snake = [{ x: 1, y: 3 }];
let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * coloums) };
let intervalId = null;
let countDown = null;


for (let row = 0; row < rows; row++) {
    for (let coloum = 0; coloum < coloums; coloum++) {
        const block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        // block.innerHTML = `${row}-${coloum}`;
        blocks[`${row}-${coloum}`] = block;
    }
}
function render() {
    let head = null;
    blocks[`${food.x}-${food.y}`].classList.add("food");


    if (direction == "left") {
        head = { x: snake[0].x, y: snake[0].y - 1 };
    } else if (direction == "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 };
    } else if (direction == "down") {
        head = { x: snake[0].x + 1, y: snake[0].y };
    }
    else if (direction == "up") {
        head = { x: snake[0].x - 1, y: snake[0].y };
    }

    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= coloums) {
        clearInterval(intervalId);
        modal.style.display = "flex";
        startGameModal.style.display = "none";
        gameOverModal.style.display = "flex";
        return;
    }

    if (head.x == food.x && head.y == food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * coloums) };
        blocks[`${food.x}-${food.y}`].classList.add("food");
        snake.unshift(head);
        score += 10;
        scoreElement.innerText = score;
        if (score > highScore) {
            highScore=score;
            localStorage.setItem("highScore",highScore);
        }
    }

    snake.forEach((segments) => {
        blocks[`${segments.x}-${segments.y}`].classList.remove("fill");
    });
    snake.unshift(head);
    snake.pop();

    snake.forEach((segments) => {
        blocks[`${segments.x}-${segments.y}`].classList.add("fill");
    });
}


let direction = "down";
addEventListener("keydown", (event) => {
    if (event.key == "ArrowUp") {
        direction = "up";
    } else if (event.key == "ArrowDown") {
        direction = "down";
    } else if (event.key == "ArrowLeft") {
        direction = "left";
    } else if (event.key == "ArrowRight") {
        direction = "right";
    }
});

startButton.addEventListener("click", () => {
    intervalId = setInterval(() => {
        render();
    }, snakeSpeed);
    modal.style.display = "none";
    countDown = setInterval(()=>{
        let [min,sec] = time.split(":").map(Number);
        if(sec==59){
            min+=1;
            sec=0;
        }
        else{
            sec+=1;
        }
        time = `${min.toString().padStart(2,"0")}:${sec.toString().padStart(2,"0")}`;
        // time = `${min}:${sec}`;
        timeElement.innerHTML = time;
    },1000);

});
reStartButton.addEventListener("click", restartGAme);

function restartGAme() {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    snake.forEach((segments) => {
        blocks[`${segments.x}-${segments.y}`].classList.remove("fill");
    });
    direction = "down";
    modal.style.display = "none";
    snake = [{ x: 1, y: 3 }];
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * coloums) };
    intervalId = setInterval(() => {
        render();
    }, snakeSpeed);
    
    score = 0;
    time = `00:00`;

    highScoreElement.innerHTML = highScore;
    scoreElement.innerHTML = score;
    timeElement.innerHTML = time;
}


