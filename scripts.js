const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const colors = ['#f00', '#0f0', '#00f', '#00f', '#ff0'];
const radius = [50, 100, 150, 200];
const sectors = 10;
const sectorAngle = (2 * Math.PI) / sectors;
let circles = [];

class Circle {
    constructor(radius, color) {
        this.radius = radius;
        this.color = color;
        this.angle = 0;
        this.pieces = [];
        this.selected = false;
    }

    draw() {
        for (let i = 0; i < sectors; i++) {
            const startAngle = i * sectorAngle + this.angle;
            const endAngle = (i + 1) * sectorAngle + this.angle;

            ctx.beginPath();
            ctx.arc(300, 300, this.radius, startAngle, endAngle);
            ctx.lineWidth = 50;
            ctx.strokeStyle = i % 2 === 0 ? this.color : 'transparent';
            ctx.stroke();
        }

        for (let i = 0; i < sectors; i++) {
            if (this.pieces[i]) {
                const pieceAngle = i * sectorAngle + this.angle;
                const x = 300 + (this.radius - 25) * Math.cos(pieceAngle);
                const y = 300 + (this.radius - 25) * Math.sin(pieceAngle);

                ctx.beginPath();
                ctx.arc(x, y, 10, 0, 2 * Math.PI);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }
    }

    rotateTo(x, y) {
        const dx = x - 300;
        const dy = y - 300;
        const angle = Math.atan2(dy, dx);

        this.angle = Math.round(angle / sectorAngle) * sectorAngle;
    }
}

function createCircles() {
    for (let i = 0; i < colors.length; i++) {
        const circle = new Circle(radius[i], colors[i]);
        circle.pieces = generateRandomPieces();
        circles.push(circle);
    }
}

function generateRandomPieces() {
    const pieces = [];
    for (let i = 0; i < sectors; i++) {
        pieces.push(Math.random() < 0.5);
    }
    return pieces;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const circle of circles) {
        circle.draw();
    }

    requestAnimationFrame(draw);
}

function getEventCoordinates(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
}

function getSelectedCircle(x, y) {
    const dx = x - 300;
    const dy = y - 300;
    const distance = Math.sqrt(dx * dx + dy * dy);

    for (let i = circles.length - 1; i >= 0; i--) {
        if (distance <= circles[i].radius) {
            return circles[i];
        }
    }

    return null;
}

canvas.addEventListener('mousedown', (event) => {
    const { x, y } = getEventCoordinates(event);
    const selectedCircle = getSelectedCircle(x, y);

    if (selectedCircle) {
        selectedCircle.selected = true;

        canvas.addEventListener('mousemove', onMouseMove);

        function onMouseMove(event) {
            const { x, y } = getEventCoordinates(event);
            if (selectedCircle.selected) {
                selectedCircle.rotateTo(x, y);
            }
        }

        canvas.addEventListener('mouseup', () => {
            selectedCircle.selected = false;
            canvas.removeEventListener('mousemove', onMouseMove);
        }, { once: true });
    }
});

createCircles();
draw();