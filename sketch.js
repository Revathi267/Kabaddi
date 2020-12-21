var player1, player2;
var pl1animation, pl2animation;
var player1Score, player2Score;


function preload(){
    pl1animation = loadAnimation("assests/player1a.png","assests/player1b.png","assests/player1a.png");
    pl2animation = loadAnimation("assests/player2a.png","assests/player2b.png","assests/player2a.png");
}

function setup(){
    createCanvas(600,600);
    database = firebase.database();
    player1 = createSprite(300,250);
    player1.addAnimation("red", pl1animation);
    player1.scale = 0.5;
    player1.debug = true;

    var player1Position = database.ref('player1/position');
    player1Position.on("value", readPosition1, showError);

    player2 = createSprite(300,250);
    player2.addAnimation("red", pl2animation);
    player2.scale = -0.5;

    var player2Position = database.ref('player2/position');
    player2Position.on("value", readPosition2, showError);

    gameState = database.ref('gameState/');
    gameState.on("value", readGameState, showError);

    player1Score = database.ref('player1Score/');
    player1Score.on("value", readScore1, showError);

    player2Score = database.ref('player2Score/');
    player2Score.on("value", readScore2, showError);

} 

function draw(){
    background(255);

    if(gameState===0){
        text("Press space to toss",100,200);
    }

    if(keyDown("space")){
        toss = Math.round(random(1,2));
        if(toss === 1) {
            database.ref('/').update({
                'gameState': 1
            })
            alert("RIDER-RED PLAYER");
        }
        else if(toss === 2) {
            database.ref('/').update({
                'gameState': 2
            })
            alert("RIDER-YELLOW PLAYER");
        }
        database.ref('player1/position').update({
            'x': 150,
            'y': 300
        })
        database.ref('player2/position').update({
            'x': 450,
            'y': 300
        })
    }

    if(gameState === 1) {
        if(keyDown(LEFT_ARROW)){
            writePosition1(-5,0);
        }
        if(keyDown(RIGHT_ARROW)){
            writePosition1(5,0);
        }
        if(keyDown(UP_ARROW)){
            writePosition1(0,-5);
        }
        if(keyDown(DOWN_ARROW)){
            writePosition1(0,5);
        }
        if(keyDown("w")){
            writePosition2(0,-5);
        }
        if(keyDown("d")){
            writePosition2(0,5);
        }
        if(player1.x > 500){
            database.ref('/').update({
                'player1Score' : player1Score - 5,
                'player2Score' : player2Score + 5,
                'gameState': 0
            })
        }
        if(player1.isTouching(player2)){
            database.ref('/').update({
                'player1Score' : player1Score + 5,
                'player2Score' : player2Score - 5,
                'gameState': 0
            })
            alert("RED PLAYER LOST")
        }
    }
    if(gameState === 2) {
        if(keyDown("a")){
            writePosition2(-5,0);
        }
        if(keyDown("s")){
            writePosition2(5,0);
        }
        if(keyDown("w")){
            writePosition2(0,-5);
        }
        if(keyDown("d")){
            writePosition2(0,5);
        }
        if(keyDown("UP_ARROW")){
            writePosition1(0,-5);
        }
        if(keyDown("DOWN_ARROW")){
            writePosition1(0,5);
        }
        if(player2.x < 100){
            database.ref('/').update({
                'player1Score' : player1Score + 5,
                'player2Score' : player2Score - 5,
                'gameState': 0
            })
        }
        if(player2.isTouching(player1)){
            database.ref('/').update({
                'player1Score' : player1Score - 5,
                'player2Score' : player2Score + 5,
                'gameState': 0
            })
            alert("YELLOW PLAYER LOST")
        }
    }
    textSize(18);
    text("RED: "+player1Score,350,15);
    text("YELLOW: "+player2Score,150,15);

    drawSprites();
}

function writePosition1(x,y){
    database.ref('player1/position').set({
        'x': writePosition1.x + x,
        'y': writePosition1.y + y
    })
}

function writePosition2(x,y){
    database.ref('player2/position').set({
        'x': writePosition2.x + x,
        'y': writePosition2.y + y
    })
}

function readPosition1(data){
    position = data.val();
    player1.x = position.x;
    player1.y = position.y;
}
function readPosition2(data){
    position = data.val();
    player2.x = position.x;
    player2.y = position.y;
}
function readGameState(data){
    gameState = data.val();
}

function readScore1(data1){
    player1Score = data1.val();
}

function readScore2(data2){
    player2Score = data2.val();
}

function showError(){
    console.log("Error occured in reading/writing database");
}