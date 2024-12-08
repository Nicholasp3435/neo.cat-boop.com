export class Sprite {

    /**
     * Constructs the sprite at the specifed x and y coordinates.
     * 
     * @param x The x coordinate to create the sprite at.
     * @param y The y coordinate to create the sprite at.
     */
    constructor(x, y) {
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

        all_sprites.push(this);
    } // constructor

    /**
     * Sets a static image as a sprite.
     * 
     * @param imgLink The link to an image for static sprites.
     */
    setImage(imgLink) {
        this.image = new Image();
        this.image.src = imgLink;
    } // setImage

    /**
     * Adds a custom animation to a sprite. Expects a spritesheet with known frame dimensions.
     * 
     * @param name The name of the animation to ass.
     * @param sheetLink The link to a sprite sheet.
     * @param frameWidth The width of each individual frame
     * @param frameHeight The height of each individual frame
     * @param callback A function to run after addAnimation completes. Typically setAnimation.
     */
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

    /**
     * Sets the animation to a sprite.
     * 
     * @param name The name of the animation to set.
     */
    setAnimation(name) {
        if (this.animations[name]) {
            this.currentAnimation = this.animations[name];
            this.frameIndex = 0;
        }
    } // setAnimation

    /**
     * Draws the sprite.
     * 
     * @param ctx The drawing context to draw the sprite in.
     * @param dt For sprites with an animation, the speed to play the animation.
     */
    draw(ctx, dt = 0) {

        if (this.currentAnimation) {
            let frame = this.currentAnimation.frames[Math.floor(this.frameIndex)];
            let image = this.currentAnimation.image;

            ctx.drawImage(image, frame.x, frame.y, frame.w, frame.h, this.x, this.y, frame.w, frame.h);
    
            this.frameIndex += dt;
            this.frameIndex %= this.currentAnimation.frames.length;

        } else if (this.image.src) {
            ctx.drawImage(this.image, this.x, this.y);
        }
    } // draw    

    /**
     * Sets the hitbox of the sprite.
     * 
     * @param width The width of the hitbox.
     * @param height The height of the hitbox.
     * @param offsetX The amout to shift the hitbox on the X axis.
     * @param offsetY The amout to shift the hitbox on the Y axis.
     */
    setHitbox(width, height, offsetX = 0, offsetY = 0) {
        this.hitbox.w = width;
        this.hitbox.h = height;
        this.hitbox.offsetX = offsetX;
        this.hitbox.offsetY = offsetY;
    } // setHitbox

    /**
     * Draws the hitbox of the sprite.
     * 
     * @param ctx The drawing context to draw the hitboxes in.
     */
    drawHitbox(ctx) {
        ctx.save();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x + this.hitbox.offsetX, this.y + this.hitbox.offsetY, this.hitbox.w, this.hitbox.h);
        ctx.restore();
    } // drawHitbox

    /**
     * Determines if this sprite is overlapping another.
     * 
     * @param sprite The sprite to test if this' hitbox is overlapping.
     * @returns True if the hitboxes of the hitboxes are overlapping.
     */
    isTouching(sprite) {
        return  this.x + this.hitbox.offsetX < sprite.x + sprite.hitbox.offsetX + sprite.hitbox.w &&
                this.x + this.hitbox.offsetX + this.hitbox.w > sprite.x + sprite.hitbox.offsetX &&
                this.y + this.hitbox.offsetY < sprite.y + sprite.hitbox.offsetY + sprite.hitbox.h &&
                this.y + this.hitbox.offsetY + this.hitbox.h > sprite.y + sprite.hitbox.offsetY;
    } // isTouching

    /**
     * Determines if this sprite will collide with another.
     * 
     * @param sprite The sprite to test if this' hitbox will overlap.
     * @param dx The distance to check in the X axis.
     * @param dy The distance to check in the Y axis.
     * @returns True if the hitboxes will overlap within the distance to check.
     */
    willCollideWith(sprite, dx, dy) {
        return  this.x + dx + this.hitbox.offsetX < sprite.x + sprite.hitbox.offsetX + sprite.hitbox.w &&
                this.x + dx + this.hitbox.offsetX + this.hitbox.w > sprite.x + sprite.hitbox.offsetX &&
                this.y + dy + this.hitbox.offsetY < sprite.y + sprite.hitbox.offsetY + sprite.hitbox.h &&
                this.y + dy + this.hitbox.offsetY + this.hitbox.h > sprite.y + sprite.hitbox.offsetY;
    } // willCollideWith

    /**
     * Determins if the mouse is over this sprite.
     * 
     * @param mousePosition The position of the mouse, either relative to the camera or to the canvas
     * @returns True if the mouse is over the hitbox of this.
     */
    mouseIsOver(mousePosition) {
        const withinX = mousePosition.x > this.x + this.hitbox.offsetX && mousePosition.x < this.x + this.hitbox.offsetX + this.hitbox.w;
        const withinY = mousePosition.y > this.y + this.hitbox.offsetY && mousePosition.y < this.y + this.hitbox.offsetY + this.hitbox.h;
        return withinX && withinY;
    } // mouseIfOver
} // Sprite

let all_sprites = [];

/**
 * Draws the hitboxes of all the scene sprites.
 * 
 * @param ctx The drawing context to draw in.
 */
export function draw_scene_hitboxes(ctx) {
    all_sprites.forEach(sprite => {
        if (!sprite.isUI) {
            sprite.drawHitbox(ctx);
        }
    });
} // draw_scene_hitboxes

/**
 * Draws the hitboxes of all the UI sprites.
 * 
 * @param ctx The drawing context to draw in.
 */
export function draw_ui_hitboxes(ctx) {
    all_sprites.forEach(sprite => {
        if (sprite.isUI) {
            sprite.drawHitbox(ctx);
        }
    });
} // draw_ui_hitboxes