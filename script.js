//declaration

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d") // 2d graphics


//set width and height of canvas
canvas.width = 680;
canvas.height = 600;


let showedDialog = false;

let gameOver = false;


let enemyPositions = {x:[],y:[]};

// keys that will be reponse for moving a player
const keys = {
    pressed:{
        keyA:false,
        keyD:false,
    }
}


class Player{
    constructor(x,y,width,height,speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }
    draw() {
        // draw the player
        // set color
        ctx.fillStyle = "#fff";
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }

    move() {
      
        if(keys.pressed.keyA && this.x >0) {
            this.x-=this.speed;
        }
        if(keys.pressed.keyD && this.x < canvas.width-this.width) {
            this.x+=this.speed;
        }
        this.draw();
    }
}

class Enemy{
    constructor(x,y,width,height,amount) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.amount = amount;
    }
    initialize() {
        const rows = 6;
        const colums = this.amount / rows;
        for(let r = 0 ; r<rows;r++) {
            for(let c = 0 ; c<colums;c++) {
                // calculate x and y 
                const x = 15 + c * (this.width + 10);
                const y = 15 + r * (this.height + 10);
                enemyPositions.x.push(x);
                enemyPositions.y.push(y);
            }
        }
    }
    draw() {
        for(let i = 0 ; i<enemyPositions.x.length;i++) {
            ctx.fillStyle = "white";
            ctx.fillRect(enemyPositions.x[i] , enemyPositions.y[i] , this.width,this.height);
        }
    }
}

class Ball{
    constructor(x,y,size,speedX,speedY){
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
    }
    draw() {
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        ctx.fill();
    }
    move() {
       
        this.x +=this.speedX;
        this.y +=this.speedY;
        this.colision();
    }
    colision() {
        if(this.x - this.size <=0 || this.x + this.size >= canvas.width) {
            this.speedX = -this.speedX;
        }
        if(this.y - this.size < 0) {
            this.speedY = -this.speedY;
        }
        if(this.y + this.size >= player.y && this.x >= player.x && this.x <= player.x + player.width) {
            const hitPos = (this.x - (player.x + player.width /2)) / (player.width / 2);
            const angle = hitPos * (Math.PI /4);
            const speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
            this.speedX = speed * Math.sin(angle);
            this.speedY = -speed * Math.cos(angle);
        }
        if(enemyPositions.x.length >0) {
            for(let i = 0 ; i<enemyPositions.x.length;i++) {
                let enemyX = enemyPositions.x[i];
                let enemyY = enemyPositions.y[i];
                if(this.x + this.size > enemyX && this.x - this.size < enemyX + enemy.width &&
                    this.y + this.size > enemyY && this.y - this.size < enemyY + enemy.height){
                        this.speedY = -this.speedY; // change direction(otherwise)
                        enemyPositions.x.splice(i,1);// remove a value in the arraay
                        enemyPositions.y.splice(i,1); // remove a value in the arraay
                        i--;
                        break;  
                    }
                
            }
            if(this.y + this.size >=canvas.height) {
                gameOver = true;
            }
        }

        
        this.draw();
    }
  
    
}

// inicialize classes
const W = 160;
const H = 13;

let player = new Player((canvas.width/2-W/2),canvas.height-H-2,W,H,7); // x,y,w,h,speed
let enemy  = new Enemy(15,10,85,20,40);
let ball = new Ball(40,250,8,4,4);

enemy.initialize();


// event listenrs
addEventListener("keydown" , ({code}) =>{
control(code,true);
})

addEventListener("keyup" , ({code}) =>{
control(code,false);
})


function restart() {
    if(!showedDialog) {
        let q = confirm("Game over , wanna play again?");
        if(q) {
            enemyPositions = {x:[],y:[]};
            gameOver = false;

            showedDialog = true;

             player = new Player((canvas.width/2-W/2),canvas.height-H-2,W,H,4); // x,y,w,h,speed
             enemy  = new Enemy(15,10,85,20,40);
             ball = new Ball(40,250,8,2,2);
             enemy.initialize();
             animate();
        }
    }
}

function control(code,pressedKey) {

    switch(code) {
        case "KeyA":
            keys.pressed.keyA = pressedKey;
            break;
        case "KeyD":
        keys.pressed.keyD = pressedKey;
        break;
    }
}

function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

   
   enemy.draw();
  
   if(!gameOver) {
    player.move();
    ball.move();
   }
   else{
    player.draw();
    ball.draw();
    restart();
   }

    requestAnimationFrame(animate); // interval 
}
animate();  
