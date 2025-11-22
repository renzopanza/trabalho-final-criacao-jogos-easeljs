let stage, player, obstacleManager;
let bgLayers = [];
let score = 0;
let gameOver = false;

let bgContainer, gameContainer, uiContainer;

function init() {
    const canvas = document.getElementById("gameCanvas");
    stage = new createjs.Stage(canvas);

    bgContainer = new createjs.Container();
    gameContainer = new createjs.Container();
    uiContainer = new createjs.Container();

    stage.addChild(bgContainer, gameContainer, uiContainer);

    loadBackground();

    player = new Player(gameContainer);
    obstacleManager = new ObstacleManager(gameContainer);

    createjs.Ticker.framerate = 60;
    createjs.Ticker.on("tick", update);

    document.addEventListener("keydown", (e) => {
        if (e.code === "Space") player.jump();
    });
}


function loadBackground() {
    const filenames = ["fundo.png", "chao.png"];
    
    filenames.forEach(file => {
        const img = new Image();
        img.src = encodeURI("assets/background/" + file);
        img.onload = () => {
        const scale = 0.5;

        const bmp1 = new createjs.Bitmap(img);
        const bmp2 = new createjs.Bitmap(img);

        bmp1.scaleX = bmp1.scaleY = scale;
        bmp2.scaleX = bmp2.scaleY = scale;

        // altura REAL após escala
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;

        // altura onde o chão deve ficar
        const groundY = 502

        // posiciona certinho encostado no chão
        const yPos = groundY - scaledHeight;
        bmp1.y = bmp2.y = yPos;

        // posicionamento horizontal correto
        bmp1.x = 0;
        bmp2.x = scaledWidth;

        stage.addChild(bmp1, bmp2);

        bgLayers.push({
            bmp1,
            bmp2,
            speed: 8,
            width: scaledWidth
        });

        bgContainer.addChild(bmp1, bmp2);

        };
    })
}

function updateBackground() {
    bgLayers.forEach(layer => {
        layer.bmp1.x -= layer.speed;
        layer.bmp2.x -= layer.speed;

        const w = layer.width;

        if (layer.bmp1.x <= -w) {
            layer.bmp1.x = layer.bmp2.x + w;
        }
        if (layer.bmp2.x <= -w) {
            layer.bmp2.x = layer.bmp1.x + w;
        }
    });
}

function update() {
    if (gameOver) return;

    updateBackground();
    player.update();
    obstacleManager.update();

    obstacleManager.obstacles.forEach(o => {
        if (Collision.checkRect(player, o)) {
            gameOver = true;
            alert("Game Over! Pontuação: " + Math.floor(score));
        }
    });

    score += 0.1;

    stage.update();
}

window.onload = init;
