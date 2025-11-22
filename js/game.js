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

// function loadBackground() {
//     const layers = [
//         // '0_ Background.png',
//         // '1_ Trees Background.png',
//         // '2_ Trees.png',
//         // '3_ Trees.png',
//         // '4_ Trees.png',
//         'Tile (13).png',
//         //'5_ Floor Platform.png'
//     ];

//     const baseSpeeds = [1];

//     layers.forEach((filename, i) => {
//         const img = new Image();
//         img.src = encodeURI('assets/background/' + filename);

//         img.onload = () => {
//             const bmp1 = new createjs.Bitmap(img);
//             const bmp2 = new createjs.Bitmap(img);
//             bmp1.scaleX = 0.5;
//             bmp1.scaleY = 0.5;
//             bmp2.scaleX = 0.5;
//             bmp2.scaleY = 0.5;

//             // alinhamento exato no chão
//             const groundY = 570;
//             const tileHeight = img.height;
//             const yPos = groundY - tileHeight;

//             bmp1.y = bmp2.y = yPos;

//             bmp1.x = 0;
//             bmp2.x = img.width;

//             stage.addChild(bmp1, bmp2);

//             bgLayers.push({
//                 bmp1,
//                 bmp2,
//                 speed: 8,
//                 width: img.width
//             });
//         };
//     });
// }

function loadBackground() {
    const filename = "Tile (13).png";
    const img = new Image();
    img.src = encodeURI("assets/background/" + filename);

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
        const groundY = 513

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
    };
}

// function updateBackground() {
//     bgLayers.forEach(layer => {
//         layer.bmp1.x -= layer.speed;
//         layer.bmp2.x -= layer.speed;

//         const w = layer.width || 960;
//         if (layer.bmp1.x < -w) layer.bmp1.x = layer.bmp2.x + w;
//         if (layer.bmp2.x < -w) layer.bmp2.x = layer.bmp1.x + w;
//     });
// }

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
