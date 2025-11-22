class Player {
    constructor(stage) {
        this.stage = stage;

        this.runFrames = [];
        this.jumpFrames = [];
        this.duckFrames = [];
        this.deadFrames = [];

        const loadFrames = (prefix, count, targetArray) => {
            for (let i = 0; i <= count; i++) {
                const img = new Image();
                img.src = encodeURI(`assets/ninja/${prefix}__00${i}.png`);
                targetArray.push(img);
            }
        };

        loadFrames('Run', 9, this.runFrames);
        loadFrames('Jump', 9, this.jumpFrames);
        loadFrames('Slide', 9, this.duckFrames);
        loadFrames('Dead', 9, this.deadFrames);

        this.currentFrames = this.runFrames;
        this.frameIndex = 0;
        this.frameTick = 0;
        this.framesPerImage = 6;

        this.bitmap = new createjs.Bitmap(this.currentFrames[0]);
        this.bitmap.scaleX = 0.2;
        this.bitmap.scaleY = 0.2;

        this.baseY = 360;
        this.bitmap.y = this.baseY;

        this.velY = 0;
        this.isJumping = false;
        this.isDucking = false;
        this.isDead = false;

        this.gravity = 1;

        stage.addChild(this.bitmap);
    }

    update() {

        if (this.isDead) {
            this.frameTick++;
            if (this.frameTick >= this.framesPerImage) {
                this.frameTick = 0;
                this.frameIndex++;

                if (this.frameIndex >= this.deadFrames.length) {
                    this.frameIndex = this.deadFrames.length - 1;
                }
            }

            const img = this.deadFrames[this.frameIndex];
            if (img) this.bitmap.image = img;

            return;
        }

        if (this.isJumping) {
            this.velY += this.gravity;
            this.bitmap.y += this.velY;

            if (this.bitmap.y >= this.baseY) {
                this.bitmap.y = this.baseY;
                this.isJumping = false;

                if (this.isDucking) {
                    this._switchTo(this.duckFrames);
                } else {
                    this._switchTo(this.runFrames);
                }
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
        if (this.isDead) return;
        if (this.isDucking) return;
        if (!this.isJumping) {
            this.isJumping = true;
            this.velY = -18;
            this._switchTo(this.jumpFrames, true);
        }
    }

    duck() {
        if (this.isDead) return;
        if (this.isJumping) return;
        if (this.isDucking) return;

        this.isDucking = true;
        this.bitmap.y = this.baseY + 25;
        this._switchTo(this.duckFrames, true);
    }

    standUp() {
        if (this.isDead) return;

        if (!this.isDucking) return;

        this.isDucking = false;
        this.bitmap.y = this.baseY;
        this._switchTo(this.runFrames, true);
    }

    die() {
        if (this.isDead) return;

        this.isDead = true;
        this.isJumping = false;
        this.isDucking = false;

        this.bitmap.y = this.baseY;

        this._switchTo(this.deadFrames, true);
        this.frameIndex = 0;
    }

    getBounds() {
        const bounds = this.bitmap.getTransformedBounds();

        if (this.isDucking) {
            return new createjs.Rectangle(
                bounds.x,
                bounds.y + 20,
                bounds.width,
                bounds.height * 0.6
            );
        }

        return bounds;
    }

    _switchTo(framesArray, resetIndex = false) {
        this.currentFrames = framesArray;
        if (resetIndex) this.frameIndex = 0;
        this.frameTick = 0;
        const img = this.currentFrames[this.frameIndex];
        if (img) this.bitmap.image = img;
    }
}
