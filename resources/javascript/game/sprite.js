export class Sprite {
    constructor (x, y) {
        this.x = x;
        this.y = y;

        this.image = new Image();
        this.image.src = "/resources/javascript/game/default_sprite.png";

        this.animationSheet = new Image();
        this.animationSheet.src = null;
        this.animations = {};
        this.currentAnimation = null;
        this.frameIndex = 0;

        this.hitbox = { x: x, y: y, w: 128, h: 128 };

        this.isUI = false;
        this.isCollidable = false;
        this.isMirrored = false;
    }

    setImage (imgLink) {
        this.image = new Image();
        this.image.src = imgLink;
    }

    addAnimation(name, sheetLink, frameWidth, frameHeight, callback) {
        const animationSheet = new Image(); 
        animationSheet.onload = () => {
            const frames = [];
            const numFramesX = animationSheet.width / frameWidth;
            const numFramesY = animationSheet.height / frameHeight;
            for (let y = 0; y < numFramesY; y++) {
                for (let x = 0; x < numFramesX; x++) {
                    frames.push({ x: x * frameWidth, y: y * frameHeight, w: frameWidth, h: frameHeight });
                }
            }
            this.animations[name] = { frames, image: animationSheet }; 
            if (callback) {
                callback(); 
            }
        };
        animationSheet.src = sheetLink;
    }

    setAnimation(name) {
        if (this.animations[name]) {
            this.currentAnimation = this.animations[name];
            this.frameIndex = 0;
        }
    }


    draw(ctx, dt) {

        if (this.currentAnimation) {
            let frame = this.currentAnimation.frames[Math.floor(this.frameIndex)];
            let image = this.currentAnimation.image;
            ctx.drawImage(image, frame.x, frame.y, frame.w, frame.h, this.x, this.y, frame.w, frame.h);
    
            this.frameIndex += dt;
            this.frameIndex %= this.currentAnimation.frames.length;
        } else if (this.image.src) {
            ctx.drawImage(this.image, this.x, this.y);
        }
    }
    

    setHitbox(width, height, offsetX = 0, offsetY = 0) {
        this.hitbox.w = width;
        this.hitbox.h = height;
        this.hitbox.offsetX = offsetX;
        this.hitbox.offsetY = offsetY;
    }

    drawHitbox(ctx) {
        ctx.save();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x + this.hitbox.offsetX, this.y + this.hitbox.offsetY, this.hitbox.w, this.hitbox.h);
        ctx.restore();
    }

    // checks if it is currently touching the specified sprite
    isTouching(sprite) {
        return  this.x + this.hitbox.offsetX < sprite.x + sprite.hitbox.offsetX + sprite.hitbox.w &&
                this.x + this.hitbox.offsetX + this.hitbox.w > sprite.x + sprite.hitbox.offsetX &&
                this.y + this.hitbox.offsetY < sprite.y + sprite.hitbox.offsetY + sprite.hitbox.h &&
                this.y + this.hitbox.offsetY + this.hitbox.h > sprite.y + sprite.hitbox.offsetY;
    }

    // checks a distance dx and dy for the specified sprite
    willCollideWith(sprite, dx, dy) {
        return  this.x + dx + this.hitbox.offsetX < sprite.x + sprite.hitbox.offsetX + sprite.hitbox.w &&
                this.x + dx + this.hitbox.offsetX + this.hitbox.w > sprite.x + sprite.hitbox.offsetX &&
                this.y + dy + this.hitbox.offsetY < sprite.y + sprite.hitbox.offsetY + sprite.hitbox.h &&
                this.y + dy + this.hitbox.offsetY + this.hitbox.h > sprite.y + sprite.hitbox.offsetY;
    }

    mouseIsOver(mousePosition) {
        const withinX = mousePosition.x > this.x + this.hitbox.offsetX && mousePosition.x < this.x + this.hitbox.offsetX + this.hitbox.w;
        const withinY = mousePosition.y > this.y + this.hitbox.offsetY && mousePosition.y < this.y + this.hitbox.offsetY + this.hitbox.h;
        return withinX && withinY;
    }
}