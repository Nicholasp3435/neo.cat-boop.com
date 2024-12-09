export class Sprite {

    /**
     * Constructs the sprite at the specifed x and y coordinates.
     * 
     * @param x The x coordinate to create the sprite at.
     * @param y The y coordinate to create the sprite at.
     * @param z The z level to create the sprite at.
     */
    constructor(x, y, z, isUI = false) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.image = new Image();
        this.image.src = "/resources/javascript/game/default_sprite.png";

        this.animationSheet = new Image();
        this.animationSheet.src = null;
        this.animations = {};
        this.currentAnimation = null;
        this.frameIndex = 0;

        this.hitbox = { x: x, y: y, w: 128, h: 128 };

        this.isUI = isUI;
        this.isCollidable = false;
        this.isMirrored = false;

        if (isUI) {
            ui_sprites.push(this);
        } else {
            scene_sprites.push(this);
        }
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
     * @param sheet_link The link to a sprite sheet.
     * @param frame_width The width of each individual frame
     * @param frame_height The height of each individual frame
     * @param animation_speed The speed to play the animation at. 1 means 1 frame per in game frame.
     * @param callback A function to run after addAnimation completes. Typically setAnimation.
     */
    addAnimation(name, sheet_link, frame_width, frame_height, animation_speed, callback) {
        const animation_sheet = new Image(); 

        animation_sheet.onload = () => {
            const frames = [];
            const numFramesX = animation_sheet.width / frame_width;
            const numFramesY = animation_sheet.height / frame_height;

            for (let y = 0; y < numFramesY; y++) {
                for (let x = 0; x < numFramesX; x++) {
                    frames.push({ x: x * frame_width, 
                                  y: y * frame_height, 
                                  w: frame_width, 
                                  h: frame_height });
                }
            }

            this.animations[name] = { frames, image: animation_sheet, animation_speed, name}; 

            if (callback) {
                callback(); 
            }

        };

        animation_sheet.src = sheet_link;
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
    draw(ctx) {
        if (this.isMirrored) {
            ctx.save();
            ctx.scale(-1, 1); 
            ctx.translate(-this.x * 2 - this.currentAnimation.frames[0].w, 0); 
        }

        if (this.currentAnimation) {
            let frame = this.currentAnimation.frames[Math.floor(this.frameIndex)];
            let image = this.currentAnimation.image;

            ctx.drawImage(image, frame.x, frame.y, frame.w, frame.h, this.x, this.y, frame.w, frame.h);
    
            this.frameIndex += this.currentAnimation.animation_speed;
            this.frameIndex %= this.currentAnimation.frames.length;

        } else if (this.image.src) {
            ctx.drawImage(this.image, this.x, this.y);
        }

        if (this.isMirrored) {
            ctx.restore();
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
        return this.x + dx + this.hitbox.offsetX < sprite.x + sprite.hitbox.offsetX + sprite.hitbox.w &&
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


let scene_sprites = [];
let ui_sprites = [];

export function draw_scene_sprites(ctx) {
    scene_sprites.forEach(sprite => {
        sprite.draw(ctx);
    });
}

export function draw_ui_sprites(ctx) {
    ui_sprites.forEach(sprite => {
        sprite.draw(ctx);
    });
}

/**
 * Draws the hitboxes of all the scene sprites.
 * 
 * @param ctx The drawing context to draw in.
 */
export function draw_scene_hitboxes(ctx) {
    scene_sprites.forEach(sprite => {
        sprite.drawHitbox(ctx);
    });
} // draw_scene_hitboxes

/**
 * Draws the hitboxes of all the UI sprites.
 * 
 * @param ctx The drawing context to draw in.
 */
export function draw_ui_hitboxes(ctx) {
    ui_sprites.forEach(sprite => {
        sprite.drawHitbox(ctx);
    });
} // draw_ui_hitboxes