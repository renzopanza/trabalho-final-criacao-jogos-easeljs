class Player {
    constructor(stage) {
        this.stage = stage;

        this.runFrames = [];
        this.jumpFrames = [];
        this.idleFrames = [];

        const loadFrames = (prefix, count, targetArray) => {
            for (let i = 1; i <= count; i++) {
                const img = new Image();
                img.src = encodeURI(`assets/dino/${prefix} (${i}).png`);
                targetArray.push(img);
            }
        };

        loadFrames('Run', 8, this.runFrames);
        loadFrames('Jump', 12, this.jumpFrames);
        loadFrames('Idle', 10, this.idleFrames);

        this.currentFrames = this.runFrames;
        this.frameIndex = 0;
        this.frameTick = 0;
        this.framesPerImage = 6;

        this.bitmap = new createjs.Bitmap(this.currentFrames[0]);
        this.bitmap.scaleX = 3;
        this.bitmap.scaleY = 3;
        this.bitmap.x = 120;
        this.bitmap.y = 330;

        this.velY = 0;
        this.isJumping = false;
        this.gravity = 1.1;

        stage.addChild(this.bitmap);
    }

    update() {
        if (this.isJumping) {
            this.velY += this.gravity;
            this.bitmap.y += this.velY;

            if (this.bitmap.y >= 330) {
                this.bitmap.y = 330;
                this.isJumping = false;
                this._switchTo(this.runFrames);
            }
        }

        this.frameTick++;
        if (this.frameTick >= this.framesPerImage) {
            this.frameTick = 0;
            this.frameIndex++;
            if (this.frameIndex >= this.currentFrames.length) {
                if (this.currentFrames === this.jumpFrames) {
                    this.frameIndex = this.currentFrames.length - 1;
                } else {
                    this.frameIndex = 0;
                }
            }
            const img = this.currentFrames[this.frameIndex];
            if (img) this.bitmap.image = img;
        }
    }

    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.velY = -18;
            this._switchTo(this.jumpFrames, true);
        }
    }

    getBounds() {
        return this.bitmap.getTransformedBounds();
    }

    _switchTo(framesArray, resetIndex = false) {
        this.currentFrames = framesArray;
        if (resetIndex) this.frameIndex = 0;
        this.frameTick = 0;
        const img = this.currentFrames[Math.max(0, this.frameIndex)];
        if (img) this.bitmap.image = img;
    }
}
