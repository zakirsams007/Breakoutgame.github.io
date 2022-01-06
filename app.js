
const ruleBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rule = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//Rules section open close-------------
ruleBtn.addEventListener('click', ()=>rule.classList.add('show'));
closeBtn.addEventListener('click', ()=>rule.classList.remove('show'));


let score = 0;

const brickRowCount = 9;
const brickColumnCount = 5;

//create ball props------------

const ball ={
    x:canvas.width / 2,
    y:canvas.height / 2,
    size:10,
    sped:5,
    dx:4,
    dy:-4
}

//create paddle------------

const paddle = {
    x:canvas.width / 2 -40,
    y:canvas.height - 20,
    w:80, h:10,
    speed:10,
    dx:0
}

//creating bricks props-----------------------------

const brickInfo={
    w:70,h:20,
    padding:10,
    offsetX:45,
    offsetY:60,
    visible:true
}

//creating Bricks---------------------------

const bricks=[]
for(let i=0;i<brickRowCount;i++){
    bricks[i]=[]

    for(let j=0;j<brickColumnCount;j++){
        const x = i*(brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y = j*(brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        bricks[i][j]={x,y, ...brickInfo}
    }
}

// Draw balls in canvas---------------

function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI*2);
    ctx.fillStyle='#652cc7';
    ctx.fill();
    ctx.closePath()
}

//Draw paddle on canvas-----------------

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w , paddle.h);
    ctx.fillStyle ='#491d88';
    ctx.fill();
    ctx.closePath()
}

//Draw Score on canvas----------

function drawScore(){
    ctx.font='20px Arial';
    ctx.fillText(` Your score : ${score}`, canvas.width - 140,30);
}

//Draw bricks on canvas------------

function drawBricks(){
    bricks.forEach(column=>{
        column.forEach(brick=>{
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle=brick.visible ? '#cf0060' : 'transparent';
            ctx.fill();
            ctx.closePath();
        });
    });
}

//moving paddle on canvas------------

function movingPaddle(){
    paddle.x += paddle.dx;

    //wall detection------
    if(paddle.x + paddle.w > canvas.width){
        paddle.x = canvas.width - paddle.w;
    }

    if(paddle.x < 0){
        paddle.x = 0;
    }
}

//moving ball on canvas---------------------

function movingBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // wall collision (right/left)
    if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0){
        ball.dx *= -1; //  ball.dx = ball.dx * -1
    }

    // wall collision (top/bottom)
    if(ball.y + ball.size > canvas.height || ball.y - ball.size < 0){
        ball.dy *= -1;

    }
    //paddle collision ---------------------
    if(  ball.x - ball.size > paddle.x && 
          ball.x + ball.size < paddle.x + paddle.w &&
          ball.y + ball.size > paddle.y )
          {
            ball.dy = - ball.sped;
          }

    // brick collision----------
    bricks.forEach(column=>{
      column.forEach(brick=>{
          if(brick.visible){
              if(
                  ball.x - ball.size > brick.x && // left side brick check;
                  ball.x + ball.size < brick.x + brick.w && // check right side brick;
                  ball.y + ball.size > brick.y && // top side check;
                  ball.y - ball.size < brick.y + brick.h // bottom check; 
                  ){
                      ball.dy *= -1;
                      brick.visible = false ;
                      increaseScore();
              }
          }
      });
    });

    // Hit bottom -lose
    if(ball.y + ball.size > canvas.height){
        showAllBricks();
         score = 0;
    }
}

// increase Score ---------------
function increaseScore(){
    score++;
    if(score % (brickRowCount * brickRowCount)===0){
        showAllBricks();
    }
}
// make all bricks appears---------------
function  showAllBricks(){
    bricks.forEach(column=>{
        column.forEach(brick=>{
            brick.visible=true;
        });
    });
}

// Draw Everything-------------------

function draw(){

    //clear canvas-----
    ctx.clearRect(0,0,canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawScore();
    drawBricks()
}

//update canvas drawing animation---------

function update(){
  movingPaddle();
  movingBall();

  //Drawing everything-------------
  draw();
  requestAnimationFrame(update);
}
update();

// keydown events

function keyDown(e){
    if(e.key === 'Right' || e.key === 'ArrowRight'){
        paddle.dx = paddle.speed
    }
    else if(e.key === 'Left' || e.key==='ArrowLeft'){
        paddle.dx = -paddle.speed;
       }
  }

// keyUp event 
function keyUp(e){
    if(
        e.key === 'Left' ||
        e.key === 'ArrowLeft' ||
        e.key === 'Right' ||
        e.key === 'ArrowRight'
    ){
        paddle.dx = 0;
    }
   }
// keyboard event handler-----------------

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
