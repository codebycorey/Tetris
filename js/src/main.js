console.log("test");

canvas.width = 100;
canvas.scale = 2;

var c = canvas.ctx;

c.beginPath();
c.arc(10, 10, 5, 0, 7);
c.fill();

canvas.flip();
