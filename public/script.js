let canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const socket = io("http://localhost:8080/");
let ctx = canvas.getContext("2d");

let x, y;
let mouseDown = false;

window.onmousedown = (e) => {
    x = e.clientX;
    y = e.clientY;
    ctx.moveTo(x, y);
    socket.emit('down', {x, y});
    mouseDown = true;
};

window.onmouseup = () => {
    mouseDown = false;
};

window.onmousemove = (e) => {
    if (!mouseDown) return;
    x = e.clientX;
    y = e.clientY;

    socket.emit('draw', {x, y});
    ctx.lineTo(x, y);
    ctx.stroke();
};

socket.on('ondraw', ({x, y}) => {
    ctx.lineTo(x, y);
    ctx.stroke();
});

socket.on('ondown', ({x, y}) => {
    ctx.moveTo(x, y);
});

