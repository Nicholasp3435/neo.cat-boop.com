import { Sprite } from "/resources/javascript/game/sprite.js";
import { draw_scene_hitboxes } from "/resources/javascript/game/sprite.js";
import { draw_scene_sprites } from "/resources/javascript/game/sprite.js";
import { draw_ui_sprites } from "/resources/javascript/game/sprite.js";
import { draw_ui_hitboxes } from "/resources/javascript/game/sprite.js";

import { Camera } from "/resources/javascript/game/camera.js";

import { add_listeners } from "/resources/javascript/game/input.js";
import { key_down } from "/resources/javascript/game/input.js";
import { key_went_down } from "/resources/javascript/game/input.js";
import { key_went_up } from "/resources/javascript/game/input.js";
import { mouse_down } from "/resources/javascript/game/input.js";
import { mouse_went_down } from "/resources/javascript/game/input.js";
import { update_previous_keys_pressed } from "/resources/javascript/game/input.js";
import { update_previous_mouse_pressed } from "/resources/javascript/game/input.js";
import { get_relative_mouse_position } from "/resources/javascript/game/input.js";


const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let frameCount = 0;

const sprite = new Sprite(300, 200, 0);
sprite.setImage("appleFly.png");
sprite.setHitbox(216, 72);

const sprite2 = new Sprite(100, 200, 0);
sprite2.addAnimation("stand", "standing.png", 64, 64, 0, () => {
    sprite2.setAnimation("stand");
})
sprite2.addAnimation("walk", "walking.png", 64, 64, 0.075);
sprite2.setHitbox(64, 32, 0, 32);
sprite2.handleMovement = function() {
    const directions = {
        ArrowRight: { dx: 2, dy: 0 },
        ArrowLeft: { dx: -2, dy: 0 },
        ArrowUp: { dx: 0, dy: -2 },
        ArrowDown: { dx: 0, dy: 2 }
    };

    for (const [key, { dx, dy }] of Object.entries(directions)) {
        if (key_down(key) && !this.willCollideWith(sprite, dx, dy)) {
            if (key === "ArrowRight") {
                this.isMirrored = true;
            } else if (key === "ArrowLeft") {
                this.isMirrored = false;
            }
            this.x += dx;
            this.y += dy;
            if (this.currentAnimation.name !== "walk") {
                this.setAnimation("walk");
            }
        }
    }

    for (const key of Object.keys(directions)) {
        if (key_went_up(key)) {
            const any_key_still_down = Object.keys(directions).some(otherKey => key_down(otherKey));
            if (!any_key_still_down) {
                this.setAnimation("stand");
            }
            break;
        }
    }
};


const sprite3 = new Sprite(0,0, -1, true);
sprite3.addAnimation("apple", "appleFly.png", 72, 72, 0.05, () => {
    sprite3.setAnimation("apple");
});

sprite3.setHitbox(72, 72);
sprite3.isUI = true;

const camera = new Camera(0,0);

add_listeners(canvas);

let interval = setInterval(draw, 10);


/**
 * The main draw loop.
 */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    draw_scene(true);
    draw_ui(true);
    input_logic();

    frameCount++;
}

/**
 * Draws the scene sprites.
 * 
 * @param debug Set to true to draw the hitboxes.
 */
function draw_scene(debug = false) {
    camera.lockOn(sprite2, canvas);
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    draw_scene_sprites(ctx);

    sprite2.handleMovement();

    if (debug) {
        draw_scene_hitboxes(ctx);
    }

    ctx.restore();
} // draw_scene

/**
 * Draws the UI sprites.
 * 
 * @param debug Set to true to draw the hitboxes.
 */
function draw_ui(debug = false) {
    
    draw_ui_sprites(ctx);

    if (debug) {
        draw_ui_hitboxes(ctx);
    }
} // draw_ui

/**
 * Handles all the input logic after drawing.
 */
function input_logic() {
    const canvasMousePosition = get_relative_mouse_position(ctx, camera, false);
    const cameraMousePosition = get_relative_mouse_position(ctx, camera, true);

    if (sprite2.mouseIsOver(canvasMousePosition) && mouse_down(0)) {
        console.log("Mouse is over the sprite");
    }

    if (sprite3.mouseIsOver(cameraMousePosition) && mouse_went_down(0)) {
        console.log("Mouse is over the sprite");
    }


    update_previous_keys_pressed();
    update_previous_mouse_pressed();
} // input_logic

