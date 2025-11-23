class Obstacle {
    constructor(stage) {
        this.stage = stage;

        const img = new Image();
        img.src = encodeURI("assets/obstacles/Spike.png");

        this.bitmap = new createjs.Bitmap(img);
        this.bitmap.scaleX = 0.2;
        this.bitmap.scaleY = 0.2;

        this.bitmap.x = 960 + Math.random() * 200;
        this.bitmap.y = 400;

        stage.addChild(this.bitmap);
    }

    update() {
        this.bitmap.x -= 8 * difficulty;
    }

    isOffscreen() {
        return this.bitmap.x < -50;
    }

    getBounds() {
        return this.bitmap.getTransformedBounds();
    }

    destroy() {
        this.stage.removeChild(this.bitmap);
    }
}

class SkyObstacle {
    constructor(stage) {
        this.stage = stage;

        const spriteData = {
            images: ["assets/obstacles/Forward.png"],
            frames: { width: 48, height: 48 },
            animations: {
                fly: [0, 3, "fly", 0.2]
            }
        };

        const sheet = new createjs.SpriteSheet(spriteData);
        this.sprite = new createjs.Sprite(sheet, "fly");

        this.sprite.scaleX = this.sprite.scaleY = 1.6;

        this.sprite.x = 960 + Math.random() * 300;
        this.sprite.y = 320;

        stage.addChild(this.sprite);
    }

    update() {
        this.sprite.x -= 8 * difficulty;
    }

    isOffscreen() {
        return this.sprite.x < -150;
    }

    getBounds() {
        return this.sprite.getTransformedBounds();
    }

    destroy() {
        this.stage.removeChild(this.sprite);
    }
}


class ObstacleManager {
    constructor(stage) {
        this.stage = stage;
        this.obstacles = [];
        this.timer = 0;

        this.spawnInterval = 60;
        this.skyChance = 0.35;
    }

    update() {
        this.timer++;

        this.spawnInterval = Math.max(25, 60 / difficulty);

        if (this.timer >= this.spawnInterval) {
            this.timer = 0;

            if (Math.random() < this.skyChance) {
                this.obstacles.push(new SkyObstacle(this.stage));
            } else {
                this.obstacles.push(new Obstacle(this.stage));
            }
        }

        this.obstacles.forEach(o => o.update());

        this.obstacles = this.obstacles.filter(o => {
            if (o.isOffscreen()) {
                o.destroy();
                return false;
            }
            return true;
        });
    }

    stop() {
        this.obstacles.forEach(o => {
            if (o.sprite) o.sprite.stop();
        });
    }

    reset() {
        this.obstacles.forEach(o => o.destroy());
        this.obstacles = [];
        this.timer = 0;
    }
}
