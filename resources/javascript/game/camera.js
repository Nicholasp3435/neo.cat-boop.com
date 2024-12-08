export class Camera {
    /**
     * Creates the camera centered on the X and Y coordinates.
     * 
     * @param x The X coordinate of the camera.
     * @param y The U coordinate of the camera.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    } // constructor

    /**
     * Moves the camera.
     * 
     * @param dx The distance in X to move the camera.
     * @param dy The distance in Y to move the camera.
     */
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    } // move

    /**
     * Moves the camera to a specified sprite.
     * 
     * @param sprite The sprite to move to.
     * @param canvas The canvas of the sprite.
     */
    lockOn(sprite, canvas) {
        this.x = sprite.x - canvas.width / 2 + sprite.hitbox.w / 2;
        this.y = sprite.y - canvas.height / 2 + sprite.hitbox.h / 2;
    } // lockOn
} // Camera