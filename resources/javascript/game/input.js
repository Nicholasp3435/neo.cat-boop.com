const keys_pressed = {};
const previous_keys_pressed = {};

const mouse_pressed = {};
const previous_mouse_pressed = {};

const rawMousePosition = { x: 0, y: 0 };

/**
 * Adds event listeners for key and mouse presses.
 * 
 * @param canvas The canvas to base the mouse position on.
 */
export function add_listeners(canvas) {
    document.addEventListener('keydown', (e) => {
        keys_pressed[e.key] = true;
    });

    document.addEventListener('keyup', (e) => {
        keys_pressed[e.key] = false;
    });

    document.addEventListener('mousedown', (e) => {
        mouse_pressed[e.button] = true;
    });
    document.addEventListener('mouseup', (e) => {
        mouse_pressed[e.button] = false;
    });

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        rawMousePosition.x = e.clientX - rect.left;
        rawMousePosition.y = e.clientY - rect.top;
    });
} // add_listeners

/**
 * Determines if a specific key is currently down. This returns true the entire 
 * duration a key is pressed.
 * 
 * @param key The key to test if it's down.
 * @returns True if the key is down.
 */
export function key_down(key) {
    return keys_pressed[key] === true;
} // key_down

/**
 * Determines if a specific key went down. This only returns true when a key went
 * from being up to being down. Holding the key does not return true.
 * 
 * @param key The key to test if it went down.
 * @returns True if the key went down.
 */
export function key_went_down(key) {
    return keys_pressed[key] && !previous_keys_pressed[key];
} // key_went_down


export function key_went_up(key) {
    return !keys_pressed[key] && previous_keys_pressed[key];
} // key_went_down

/**
 * Updates which keys are seen as being held down. 
 */
export function update_previous_keys_pressed() {
    Object.assign(previous_keys_pressed, keys_pressed);
} // update_previous_keys_pressed

/**
 * Determines if a specific mouse button is currently down. This returns true the entire 
 * duration a mouse button is pressed.
 * 
 * @param button The button to test if it's down.
 * @returns True if the button is down.
 */
export function mouse_down(button) {
    return mouse_pressed[button] === true;
} // mouse_down

/**
 * Determines if a specific mouse button went down. This only returns true when a button went
 * from being up to being down. Holding the button does not return true.
 * 
 * @param button The button to test if it went down.
 * @returns True if the button went down.
 */
export function mouse_went_down(button) {
    return mouse_pressed[button] && !previous_mouse_pressed[button];
} // mouse_went_down

/**
 * Updates which mouse buttons are seen as being held down. 
 */
export function update_previous_mouse_pressed() {
    Object.assign(previous_mouse_pressed, mouse_pressed);
} // update_previous_mouse_pressed

/**
 * Gets the mouse position relative to the scene or to the ui.
 * 
 * @param {*} ctx The drawing context the scene and ui are in.
 * @param {*} camera The camera being used with the scene.
 * @param {*} ui Set true to get the location relative to the ui; false for the scene
 * @returns The x and y position relative to the ui or to the scene as specified.
 */
export function get_relative_mouse_position(ctx, camera, ui) {
    const transform = ctx.getTransform();
    const inverted_transform = transform.inverse(); 

    if (!ui) {
        return {
            x: rawMousePosition.x * inverted_transform.a +
               rawMousePosition.y * inverted_transform.c + inverted_transform.e + camera.x,
            
            y: rawMousePosition.x * inverted_transform.b +
                rawMousePosition.y * inverted_transform.d + inverted_transform.f + camera.y
        };
    } else {
        return {
            x: rawMousePosition.x,
            y: rawMousePosition.y
        };
    }
} // get_relative_mouse_position