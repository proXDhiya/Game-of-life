const board = document.querySelector('#board');
const btn = document.querySelector('.btn');
const nextBtn = document.querySelector('#next');
let pixelSize = btn.innerText;
let boardHeight = board.offsetHeight - 50;
let boardWidth = board.offsetWidth;
let limitHeight = null
let limitWidth = null;
let Array2D = [];
let Array2DNext = [];
let isPlaying = false;
let interval = null;
btn.style.backgroundColor = 'lightgreen';

const createBoard = (pixelSize, h, w) => {
    let pixel = Number(pixelSize.split('px')[0]);
    limitHeight = Math.floor(h / pixel);
    limitWidth = Math.floor(w / pixel);
    
    board.style.gridTemplateColumns = `repeat(${limitWidth}, ${pixel}px)`;
    board.style.gridTemplateRows = `repeat(${limitHeight}, ${pixel}px)`;

    function putPixel(i, j, value) {
        Array2D[i][j] = value;
    }

    for (let i = 0; i < limitHeight; i++) {
        Array2D[i] = [];
        Array2DNext[i] = [];

        for (let j = 0; j < limitWidth; j++) {
            Array2D[i][j] = 0;
            Array2DNext[i][j] = 0;

            const div = document.createElement('div');
            div.classList.add('pixel');
            div.style.width = `${pixel}px`;
            div.style.height = `${pixel}px`;
            div.style.outline = '1px solid hsl(228, 12%, 44%)';
            div.dataset.i = i;
            div.dataset.j = j;
            // click event change color to black
            div.addEventListener('click', () => {
                if (div.style.backgroundColor === 'black') {
                    div.style.backgroundColor = 'inherit';
                    putPixel(i, j, 0);
                } else {
                    div.style.backgroundColor = 'black';
                    putPixel(i, j, 1);
                }
            });
            board.appendChild(div);
        }
    }

    // load from ls if exists
    const lsArray2D = JSON.parse(localStorage.getItem('Array2D'));

    if (lsArray2D) {
        for (let i = 0; i < limitHeight; i++) {
            for (let j = 0; j < limitWidth; j++) {
                if (lsArray2D[i][j] === 1) {
                    document.querySelector(`[data-i="${i}"][data-j="${j}"]`).style.backgroundColor = 'black';
                }
            }
        }
        Array2D = lsArray2D;
    }
}

createBoard(pixelSize, boardHeight, boardWidth);

nextBtn.addEventListener('click', () => {    
    isPlaying = !isPlaying;
    if (isPlaying) {
        nextBtn.innerText = 'Stop';
        nextBtn.style.backgroundColor = 'red';
        interval = setInterval(() => {
            for (let i = 0; i < limitHeight; i++) {
                for (let j = 0; j < limitWidth; j++) {
                    let count = 0;
                    if (i > 0 && j > 0 && Array2D[i - 1][j - 1] === 1) {
                        count++;
                    }
                    if (i > 0 && Array2D[i - 1][j] === 1) {
                        count++;
                    }
                    if (i > 0 && j < limitWidth - 1 && Array2D[i - 1][j + 1] === 1) {
                        count++;
                    }
                    if (j > 0 && Array2D[i][j - 1] === 1) {
                        count++;
                    }
                    if (j < limitWidth - 1 && Array2D[i][j + 1] === 1) {
                        count++;
                    }
                    if (i < limitHeight - 1 && j > 0 && Array2D[i + 1][j - 1] === 1) {
                        count++;
                    }
                    if (i < limitHeight - 1 && Array2D[i + 1][j] === 1) {
                        count++;
                    }
                    if (i < limitHeight - 1 && j < limitWidth - 1 && Array2D[i + 1][j + 1] === 1) {
                        count++;
                    }
                    if (Array2D[i][j] === 1) {
                        if (count < 2) {
                            Array2DNext[i][j] = 0;
                        } else if (count === 2 || count === 3) {
                            Array2DNext[i][j] = 1;
                        } else if (count > 3) {
                            Array2DNext[i][j] = 0;
                        }
                    } else {
                        if (count === 3) {
                            Array2DNext[i][j] = 1;
                        }
                    }
                }
            }
        
            // draw next generation
            for (let i = 0; i < limitHeight; i++) {
                for (let j = 0; j < limitWidth; j++) {
                    if (Array2DNext[i][j] === 1) {
                        document.querySelector(`[data-i="${i}"][data-j="${j}"]`).style.backgroundColor = 'black';
                    } else {
                        document.querySelector(`[data-i="${i}"][data-j="${j}"]`).style.backgroundColor = 'inherit';
                    }
                }
            }
        
            // set Array2D to Array2DNext
            for (let i = 0; i < limitHeight; i++) {
                for (let j = 0; j < limitWidth; j++) {
                    Array2D[i][j] = Array2DNext[i][j];
                }
            }
            
            // save to ls
            localStorage.setItem('Array2D', JSON.stringify(Array2D));
        }, 200);
    } else {
        nextBtn.innerText = 'Next';
        nextBtn.style.backgroundColor = 'lightgreen';
        clearInterval(interval);
    }
});
