import { Sprite } from "/resources/javascript/game/sprite.js";
import { draw_scene_hitboxes } from "/resources/javascript/game/sprite.js";
import { draw_ui_hitboxes } from "/resources/javascript/game/sprite.js";

import { Camera } from "/resources/javascript/game/camera.js";

import { add_listeners } from "/resources/javascript/game/input.js";
import { key_down } from "/resources/javascript/game/input.js";
import { key_went_down } from "/resources/javascript/game/input.js";
import { mouse_down } from "/resources/javascript/game/input.js";
import { mouse_went_down } from "/resources/javascript/game/input.js";
import { update_previous_keys_pressed } from "/resources/javascript/game/input.js";
import { update_previous_mouse_pressed } from "/resources/javascript/game/input.js";
import { get_relative_mouse_position } from "/resources/javascript/game/input.js";


const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let frameCount = 0;

const sprite = new Sprite(300,200);
sprite.setImage("appleFly.png");
sprite.setHitbox(216, 72);

const sprite2 = new Sprite(100,200);
sprite2.setHitbox(128, 64, 0, 64);
sprite2.handleMovement = function() {
    if(key_down("ArrowRight") && !this.willCollideWith(sprite, 1, 0)) {
        this.x+=2;
    }
    if(key_down("ArrowLeft") && !this.willCollideWith(sprite, -1, 0)) {
        this.x-=2;
    }
    if(key_down("ArrowUp") && !this.willCollideWith(sprite, 0, -1)) {
        this.y-=2;
    }
    if(key_down("ArrowDown") && !this.willCollideWith(sprite, 0, 1)) {
        this.y+=2;
    }
}

const sprite3 = new Sprite(0,0);
sprite3.addAnimation("apple", "appleFly.png", 72, 72, () => {
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

    sprite.draw(ctx);
    sprite2.draw(ctx);
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
    sprite3.draw(ctx, .05);

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

