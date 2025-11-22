class Obstacle {
    constructor(stage) {
        this.stage = stage;

        const img = new Image();
        img.src = encodeURI("assets/obstacles/Group 4 - 1.gif");

        this.bitmap = new createjs.Bitmap(img);
        this.bitmap.scaleX = 2;
        this.bitmap.scaleY = 2;
        this.bitmap.x = 960 + Math.random() * 200;
        this.bitmap.y = 360;

        stage.addChild(this.bitmap);
    }

    update() {
        this.bitmap.x -= 8;
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

class ObstacleManager {
    constructor(stage) {
        this.stage = stage;
        this.obstacles = [];
        this.timer = 0;
        this.spawnInterval = 60;
    }

    update() {
        this.timer++;

        if (this.timer >= this.spawnInterval) {
            this.timer = 0;
            this.obstacles.push(new Obstacle(this.stage));
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
}
