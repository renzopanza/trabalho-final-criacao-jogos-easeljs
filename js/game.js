let stage, player, obstacleManager;
let bgLayers = [];
let score = 0;
let gameOver = false;

function init() {
    const canvas = document.getElementById("gameCanvas");
    stage = new createjs.Stage(canvas);

    loadBackground();
    player = new Player(stage);
    obstacleManager = new ObstacleManager(stage);

    createjs.Ticker.framerate = 60;
    createjs.Ticker.on("tick", update);

    document.addEventListener("keydown", (e) => {
        if (e.code === "Space") player.jump();
    });
}

function loadBackground() {
    const layers = [
        '0_ Background.png',
        '1_ Trees Background.png',
        '2_ Trees.png',
        '3_ Trees.png',
        '4_ Trees.png',
        '5_ Floor Platform.png'
    ];

    const baseSpeeds = [0.2, 0.4, 0.8, 1.2, 1.6, 2.4];

    layers.forEach((filename, i) => {
        const img = new Image();
        img.src = encodeURI('assets/background/' + filename);

        img.onload = () => {
            const bmp1 = new createjs.Bitmap(img);
            const bmp2 = new createjs.Bitmap(img);

            bmp1.y = bmp2.y = 0;
            bmp1.x = 0;
            bmp2.x = img.width;

            stage.addChild(bmp1, bmp2);

            bgLayers.push({ bmp1, bmp2, speed: baseSpeeds[i] || (i + 1) * 0.5, width: img.width });
        };
    });
}

function updateBackground() {
    bgLayers.forEach(layer => {
        layer.bmp1.x -= layer.speed;
        layer.bmp2.x -= layer.speed;

        const w = layer.width || 960;
        if (layer.bmp1.x < -w) layer.bmp1.x = layer.bmp2.x + w;
        if (layer.bmp2.x < -w) layer.bmp2.x = layer.bmp1.x + w;
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
