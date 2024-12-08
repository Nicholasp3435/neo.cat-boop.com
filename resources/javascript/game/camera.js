export class Camera {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    move (dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    lockOn (sprite, canvas) {
        this.x = sprite.x - canvas.width / 2 + sprite.hitbox.w / 2;
        this.y = sprite.y - canvas.height / 2 + sprite.hitbox.h / 2;
    }
}