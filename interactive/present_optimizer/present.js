console.log("present.js");

var canvas = document.getElementById('canvas');

canvas.width = 1000;
canvas.height = 750;

var ctx = canvas.getContext('2d');

var x1_input = document.querySelector('#x1');
var x2_input = document.querySelector('#x2');
var y_input = document.querySelector('#y');
var unit_input = document.querySelector('#units');
var rotation_input = document.querySelector('#rotation');

var dims_output = document.getElementById("dims");

var x_th = Math.PI / 2;
var y_th = 0;
var z_th = 0;

var light_vector = [0, 1, 1];

var cube_coords = [[ 1, -1, -1], [ 1, -1,  1], [-1, -1,  1], [-1, -1, -1], 
                   [ 1,  1, -1], [ 1,  1,  1], [-1,  1,  1], [-1,  1, -1]];


var cube_faces = [[2, 3, 4], [8, 7, 6], [5, 6, 2], [6, 7, 3], [3, 7, 8], [1, 4, 8],
                  [1, 2, 4], [5, 8, 6], [1, 5, 2], [2, 6, 3], [4, 3, 8], [5, 1, 8]];

var plane_coords = [[ 1,  1, -1], [-1,  1, -1], [-1, -1, -1], [ 1, -1, -1]];

var plane_faces = [[1, 2, 4], [2, 3, 4]];

var box_coords = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], 
                  [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];

var paper_coords = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var y_th = rotation_input.value;

    var x1_value = Math.max(Number(x1_input.value), Number(x2_input.value), Number(y_input.value));
    var y_value = Math.min(Number(x1_input.value), Number(x2_input.value), Number(y_input.value));
    var x2_value = Number(x1_input.value) + Number(x2_input.value) + Number(y.value) - x1_value - y_value;

    var paper_x1 = x1_value + y_value;
    var paper_x2 = 2 * x2_value + 2 * y_value;

    dims_output.innerHTML = paper_x1 + " × " + paper_x2;

    if (unit_input.value == "cm") {
        x1_value *= 10;
        x2_value *= 10;
        y_value *= 10;
        paper_x1 *= 10;
        paper_x2 *= 10;
    } else if (unit_input.value == "in") {
        x1_value *= 25.4;
        x2_value *= 25.4;
        y_value *= 25.4;
        paper_x1 *= 25.4;
        paper_x2 *= 25.4;
    } 

    for (var i = 0; i < box_coords.length; i++) {
        box_coords[i][0] = cube_coords[i][0] * x1_value;
        box_coords[i][1] = cube_coords[i][1] * x2_value;
        box_coords[i][2] = cube_coords[i][2] * y_value;
    }

    for (var i = 0; i < paper_coords.length; i++) {
        paper_coords[i][0] = plane_coords[i][0] * paper_x1;
        paper_coords[i][1] = plane_coords[i][1] * paper_x2;
        paper_coords[i][2] = plane_coords[i][2] * y_value;
    }

    for (var i = 0; i < plane_faces.length; i++) {
        var v1 = rotate_vertex(get_face_vertices(i, 0, 1), x_th, y_th, z_th);
        var v2 = rotate_vertex(get_face_vertices(i, 1, 1), x_th, y_th, z_th);
        var v3 = rotate_vertex(get_face_vertices(i, 2, 1), x_th, y_th, z_th);

        v1 = translate_vertex(v1, 0, 200, 900);
        v2 = translate_vertex(v2, 0, 200, 900);
        v3 = translate_vertex(v3, 0, 200, 900);

        v1 = perspective_divide(v1);
        v2 = perspective_divide(v2);
        v3 = perspective_divide(v3);

        v1 = translate_vertex(v1, canvas.width / 2, canvas.height / 2 - 200, 0);
        v2 = translate_vertex(v2, canvas.width / 2, canvas.height / 2 - 200, 0);
        v3 = translate_vertex(v3, canvas.width / 2, canvas.height / 2 - 200, 0);

        ctx.fillStyle = "red";

        ctx.beginPath();
        ctx.moveTo(v1[0], v1[1]);
        ctx.lineTo(v2[0], v2[1]);
        ctx.lineTo(v3[0], v3[1]);
        ctx.closePath();
        ctx.fill();
    }

    for (var i = 0; i < cube_faces.length; i++) {
        var v1 = rotate_vertex(get_face_vertices(i, 0, 0), x_th, y_th, z_th);
        var v2 = rotate_vertex(get_face_vertices(i, 1, 0), x_th, y_th, z_th);
        var v3 = rotate_vertex(get_face_vertices(i, 2, 0), x_th, y_th, z_th);

        var normal = face_normal([v1, v2, v3]);
        var lightness = dot(normal, light_vector);

        v1 = translate_vertex(v1, 0, 200, 900);
        v2 = translate_vertex(v2, 0, 200, 900);
        v3 = translate_vertex(v3, 0, 200, 900);

        v1 = perspective_divide(v1);
        v2 = perspective_divide(v2);
        v3 = perspective_divide(v3);

        v1 = translate_vertex(v1, canvas.width / 2, canvas.height / 2 - 200, 0);
        v2 = translate_vertex(v2, canvas.width / 2, canvas.height / 2 - 200, 0);
        v3 = translate_vertex(v3, canvas.width / 2, canvas.height / 2 - 200, 0);

        ctx.fillStyle = "hsl(30, 100%,"  + 30 * lightness + "%)";
        ctx.strokeStyle = ctx.fillStyle;

        if (lightness > 0) {
            ctx.beginPath();
            ctx.moveTo(v1[0], v1[1]);
            ctx.lineTo(v2[0], v2[1]);
            ctx.lineTo(v3[0], v3[1]);
            ctx.closePath();
            ctx.fill();
            ctx.stroke()
        }
        
    }

    requestAnimationFrame(draw);
}

// am i overcomplicating this? yus. do i like linear algebra? double yus.
// so do i care about overcomplicating? nope lol
// this is becoming a big mess omg

function rotate_x(t) {
    return [[1, 0, 0],
            [0, Math.cos(t), -Math.sin(t)],
            [0, Math.sin(t), Math.cos(t)]];
}

function rotate_y(t) {
    return [[Math.cos(t), 0, Math.sin(t)],
            [0, 1, 0],
            [-Math.sin(t), 0, Math.cos(t)]];
}

function rotate_z(t) {
    return [[Math.cos(t), -Math.sin(t), 0],
            [Math.sin(t), Math.cos(t), 0],
            [0, 0, 1]];
}

function multiply(m, v) {
    return [m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
            m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
            m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2]];
}

function multiply_4(m, v) {
    return [m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2] + m[0][3] * v[3],
            m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2] + m[1][3] * v[3],
            m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2] + m[2][3] * v[3],
            m[3][0] * v[0] + m[3][1] * v[1] + m[3][2] * v[2] + m[3][3] * v[3]];
}

function perspective(height, width, fov, z_far, z_near) {
    var focal = 1 / Math.tan(fov / 2);
    var ratio = height / width;
    var d = z_far / (z_far - z_near);

    return [[ratio * focal, 0, 0, 0], 
            [0, focal, 0, 0],
            [0, 0, d, -d * z_near],
            [0, 0, 1, 0]]
}

function perspective_divide(v) {
    var p = perspective(1, 1, .005, 5, 0);

    v = [v[0], v[1], v[2], 0];

    var p_v = multiply_4(p, v);

    return [p_v[0] / p_v[3], p_v[1] / p_v[3], p_v[2] / p_v[3], p_v[3]]
}


function get_face_vertices(f, p, m) {
    if (m == 0) {
        return box_coords[cube_faces[f][p] - 1];
    } else {
        return paper_coords[plane_faces[f][p] - 1];
    }
}

function rotate_vertex(v, x_t, y_t, z_t) {
    return multiply(rotate_z(z_t), multiply(rotate_y(y_t), multiply(rotate_x(x_t), v)));
}

function translate_vertex(v, d_x, d_y, d_z) {
    return [v[0] + d_x, v[1] + d_y, v[2] + d_z];
}

function subtract(v1, v2) {
    return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
}

function dot(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}

function cross(v1, v2) {
    return [[v1[1] * v2[2] - v1[2] * v2[1]],
            [v1[2] * v2[0] - v1[0] * v2[2]],
            [v1[0] * v2[1] - v1[1] * v2[0]]]
}

function face_normal(f) {
    var c = cross(subtract(f[2], f[1]), subtract(f[2], f[0]));
    return normalize(c);
}

function magnitude(v) {
    return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2) + Math.pow(v[2], 2))
}

function normalize(v) {
    return [v[0] / magnitude(v), v[1] / magnitude(v), v[2] / magnitude(v)]
}

function draw_line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

draw();