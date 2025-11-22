let stage, player, obstacleManager;
let bgLayers = [];
let score = 0;
let highscore = 0;
let gameOver = false;
let scoreText, highscoreText, hudBg;
let gameOverContainer;
let bgContainer, gameContainer, uiContainer;
let difficulty = 1;

let musicInstance = null;
let musicOn = true; // música começa ligada

function init() {
    const canvas = document.getElementById("gameCanvas");
    stage = new createjs.Stage(canvas);
    highscore = Number(localStorage.getItem("highscore")) || 0;

    bgContainer = new createjs.Container();
    gameContainer = new createjs.Container();
    uiContainer = new createjs.Container();

    stage.addChild(bgContainer, gameContainer, uiContainer);

    // 🔊 REGISTRA SONS
    createjs.Sound.registerSound("assets/sound effects/ES_Trilha sonora 2.mp3", "bgm");
    createjs.Sound.registerSound("assets/sound effects/ES_jump.mp3", "jump");
    createjs.Sound.registerSound("assets/sound effects/ES_Damage.mp3", "hit");

    // Quando o arquivo da música carregar → começar música
    createjs.Sound.on("fileload", startMusic);

    loadBackground();

    player = new Player(gameContainer);
    obstacleManager = new ObstacleManager(gameContainer);

    hudBg = new createjs.Shape();
    hudBg.graphics.beginFill("rgba(0,0,0,0.4)").drawRoundRect(10, 10, 220, 80, 10);
    uiContainer.addChild(hudBg);

    scoreText = new createjs.Text("Pontuação: 0", "24px Arial", "#ffffff");
    scoreText.x = 25;
    scoreText.y = 25;
    scoreText.outline = 1;
    scoreText.shadow = new createjs.Shadow("#000", 2, 2, 4);
    uiContainer.addChild(scoreText);

    highscoreText = new createjs.Text("Recorde: " + highscore, "20px Arial", "#ffd700");
    highscoreText.x = 25;
    highscoreText.y = 55;
    highscoreText.shadow = new createjs.Shadow("#000", 2, 2, 4);
    uiContainer.addChild(highscoreText);

    // Criar o botão de música
    createMusicButton();

    // Garante que UI sempre fica por cima
    stage.setChildIndex(uiContainer, stage.numChildren - 1);

    createjs.Ticker.framerate = 60;
    createjs.Ticker.on("tick", update);

    // Pulo + som de pulo
    document.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            player.jump();
            createjs.Sound.play("jump", { volume: 0.6 });
        }
    });

    createGameOverScreen();
}

function toggleMusic(e) {
    const label = e.currentTarget.getChildByName("label");

    if (musicOn) {
        if (musicInstance) musicInstance.stop();
        musicOn = false;
        label.text = "Música: OFF";
    } else {
        musicInstance = createjs.Sound.play("bgm", { loop: -1, volume: 0.3 });
        musicOn = true;
        label.text = "Música: ON";
    }

    stage.update();
}

function createMusicButton() {
    const button = new createjs.Container();
    button.x = stage.canvas.width - 160;
    button.y = 20;

    const bg = new createjs.Shape();
    bg.graphics.beginFill("#333").drawRoundRect(0, 0, 140, 40, 10);

    const label = new createjs.Text("Música: ON", "20px Arial", "#fff");
    label.name = "label";
    label.x = 15;
    label.y = 8;

    button.addChild(bg, label);
    button.cursor = "pointer";

    button.on("click", toggleMusic);

    uiContainer.addChild(button);

    uiContainer.setChildIndex(button, uiContainer.numChildren - 1);
}

function startMusic() {
    if (!musicOn) return;

    musicInstance = createjs.Sound.play("bgm", {
        loop: -1,
        volume: 0.3
    });
}

function createGameOverScreen() {
    gameOverContainer = new createjs.Container();
    gameOverContainer.visible = false;

    const bg = new createjs.Shape();
    bg.graphics.beginFill("rgba(0,0,0,0.6)").drawRect(0, 0, stage.canvas.width, stage.canvas.height);
    gameOverContainer.addChild(bg);

    const title = new createjs.Text("GAME OVER", "60px Arial", "#ff4444");
    title.textAlign = "center";
    title.x = stage.canvas.width / 2;
    title.y = 150;
    title.shadow = new createjs.Shadow("#000", 3, 3, 10);
    gameOverContainer.addChild(title);

    const scoreMsg = new createjs.Text("", "32px Arial", "#ffffff");
    scoreMsg.textAlign = "center";
    scoreMsg.x = stage.canvas.width / 2;
    scoreMsg.y = 260;
    scoreMsg.name = "scoreMsg";
    gameOverContainer.addChild(scoreMsg);

    const restartMsg = new createjs.Text("Pressione ESPAÇO para reiniciar", "28px Arial", "#ffffff");
    restartMsg.textAlign = "center";
    restartMsg.x = stage.canvas.width / 2;
    restartMsg.y = 360;
    restartMsg.shadow = new createjs.Shadow("#000", 2, 2, 8);
    gameOverContainer.addChild(restartMsg);

    uiContainer.addChild(gameOverContainer);

    document.addEventListener("keydown", (e) => {
        if (gameOver && e.code === "Space") {
            location.reload();
        }
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

            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;

            const groundY = 502;
            const yPos = groundY - scaledHeight;

            bmp1.y = bmp2.y = yPos;

            bmp1.x = 0;
            bmp2.x = scaledWidth;

            bgContainer.addChild(bmp1, bmp2);

            bgLayers.push({
                bmp1,
                bmp2,
                speed: 8,
                width: scaledWidth
            });
        };
    });
}

function updateBackground() {
    bgLayers.forEach(layer => {
        layer.bmp1.x -= layer.speed * difficulty;
        layer.bmp2.x -= layer.speed * difficulty;
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

    difficulty += 0.00005;

    updateBackground();
    player.update();
    obstacleManager.update();

    obstacleManager.obstacles.forEach(o => {
        if (Collision.checkRect(player, o)) {

            // 🔊 SOM DE IMPACTO AO BATER NO ESPINHO
            createjs.Sound.play("hit", { volume: 0.7 });

            gameOver = true;

            if (score > highscore) {
                highscore = Math.floor(score);
                localStorage.setItem("highscore", highscore);
            }

            const msg = gameOverContainer.getChildByName("scoreMsg");
            msg.text = "Pontuação final: " + Math.floor(score);

            gameOverContainer.visible = true;
        }
    });

    score += 0.1;
    scoreText.text = "Pontuação: " + Math.floor(score);
    highscoreText.text = "Recorde: " + highscore;

    stage.update();
}

function restartGame() {
    gameOver = false;
    score = 0;
    difficulty = 1;
    gameOverContainer.visible = false;

    player.reset();
    obstacleManager.reset();
    stage.update();
}

window.onload = init;
