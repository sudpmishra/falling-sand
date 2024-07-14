// Falling sand simulation using JavaScript
const BLOCK_SIZE = 5;
let canvasGrid, ctx, canvasWidth, canvasHeight, canvas;
let paused = false;
let pauseSimulation = false;

document.addEventListener('DOMContentLoaded', initialize);


function initialize() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    updateCanvasSize();
    canvasGrid = createInitialGrid();
    setupEventListeners();
    startSimulation();
    rotateTheMoon();
}

function updateCanvasSize() {
    canvasWidth = document.body.clientWidth - 25;
    canvasHeight = document.body.clientHeight - 25;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}

function createInitialGrid() {
    const gridHeight = Math.floor(canvasHeight / BLOCK_SIZE);
    const gridWidth = Math.floor(canvasWidth / BLOCK_SIZE);
    return Array.from({ length: gridHeight }, () => Array(gridWidth).fill(0));
}

function setupEventListeners() {
    window.addEventListener('resize', () => {
        updateCanvasSize();
        canvasGrid = createInitialGrid();
    });

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', () => paused = !paused);
}

function handleMouseMove(e) {
    if (paused) return;
    pauseSimulation = false;
    const x = Math.floor(e.offsetX / BLOCK_SIZE);
    const y = Math.floor(e.offsetY / BLOCK_SIZE);
    // Randomly insert sand in a 5x5 grid around the mouse pointer
    for (let i = -2; i <= 2; i++) {
        for (let j = -2; j <= 2; j++) {
            if (isWithinBounds(x + i, y + j)) {
                canvasGrid[y + j][x + i] = Math.random() > 0.5 ? 1 : 0;
            }
        }
    }
}

function isWithinBounds(x, y) {
    return x >= 0 && x < canvasWidth / BLOCK_SIZE && y >= 0 && y < canvasHeight / BLOCK_SIZE;
}

function startSimulation() {
    setInterval(() => {
        if (!pauseSimulation) {
            updateGrid();
            draw();
        }
    }, 10);
}

function updateGrid() {
    const newGrid = createInitialGrid();
    for (let y = 0; y < canvasHeight / BLOCK_SIZE; y++) {
        for (let x = 0; x < canvasWidth / BLOCK_SIZE; x++) {
            updateCellState(x, y, newGrid);
        }
    }
    if(JSON.stringify(canvasGrid) === JSON.stringify(newGrid)) {
        pauseSimulation = true;
    }
    canvasGrid = newGrid;
}

function updateCellState(x, y, newGrid) {
    if (canvasGrid[y][x] !== 1) return;

    const directions = [[1, 0], [1, 1], [1, -1]];
    for (let [dy, dx] of directions) {
        if (isWithinBounds(x + dx, y + dy) && canvasGrid[y + dy][x + dx] === 0) {
            newGrid[y + dy][x + dx] = 1;
            return; // Stop after moving the sand particle
        }
    }
    // Keep the sand particle in its current position if it can't move
    newGrid[y][x] = 1;
}

function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (let y = 0; y < canvasHeight / BLOCK_SIZE; y++) {
        for (let x = 0; x < canvasWidth / BLOCK_SIZE; x++) {
            if (canvasGrid[y][x] === 1) {
                ctx.fillStyle = getColorBasedOnHeight(y);
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function getColorBasedOnHeight(y) {
    const max = canvasHeight / BLOCK_SIZE;
    const percent = y / max;
    const green = Math.floor(255 - 255 * percent);
    return `rgb(255,${green},0)`;
}

function rotateTheMoon() {
    const moon = document.getElementById('moon');
    let deg = 0;
    setInterval(() => {
        if(paused) return;
        deg = deg === 360 ? 0 : deg + .5;
        moon.style.transform = `rotate(${deg}deg)`;
    }, 100);
}