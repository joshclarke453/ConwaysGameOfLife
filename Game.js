let canvas = document.getElementById("myCanvas");
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
let canvasCtx = canvas.getContext("2d");
let gameHeight = canvasHeight - 100
let gameWidth = canvasWidth
let isRunning = false
let startingGridSize = 5

let grid = new Array(startingGridSize)
    //grid[x][y]
    for (i = 0 ; i < grid.length ; i++)
    {
        grid[i] = new Array(startingGridSize).fill(0)
    }

let newGrid

let menuButtons = [
    {
        x: 25,
        y: 25,
        height: 50,
        width: 100,
        text: 'Start'
    }, {
        x: 150,
        y: 25,
        height: 50,
        width: 100,
        text: 'Stop'
    }, {
        x: 275,
        y: 25,
        height: 50,
        width: 100,
        text: 'Reset',
    }, {
        x: 400,
        y: 25,
        height: 50,
        width: 100,
        text: 'Temp'
    }
];

function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function game(newGame)
{
    while(true)
    {
        await sleep(250)
        //TODO: Function to generate a random start

        if (newGame)
        {
            grid[1][1] = 1
            grid[1][2] = 1
            grid[1][3] = 1
            drawGrid()
        }
        
        
        while (isRunning) 
        {
            //Sleep for x milliseconds, slows down the game for visualization and resource consumption
            await sleep(1000);

            //selects random tile in grid to turn white
            //grid[Math.floor(Math.random() * grid.length)][Math.floor(Math.random() * grid[0].length)] = 1

            //here is the algorithm to pick the starting points.
            
            //here is where the actual conway algorithm will go.
            //grid = iterateGrid(grid)

            //expands grid to show full visualization
            for (i = 0 ; i < grid.length ; i++)
            {
                for (k = 0 ; k < grid[i].length ; k++)
                {
                    if (grid[0][k] == 1)
                    {
                        grid.unshift(new Array(grid[i].length).fill(0))
                    }
                    if (grid[grid.length-1][k] == 1)
                    {
                        grid.push(new Array(grid[i].length).fill(0))
                    }
                    if (grid[i][0] == 1)
                    {
                        for(let j = 0; j < grid.length; j++) {
                            grid[j].unshift(0);
                        }
                    }
                    if (grid[i][grid[i].length-1] == 1)
                    {
                        for(let j = 0; j < grid.length; j++) {
                            grid[j].push(0);
                        }
                    }
                }
                console.log('grid.length = ', grid.length)
            } 
            
            await sleep(1000);
            console.log('iterating Grid')
            grid = iterateGrid(grid)
            //Make something to remove grid if there are no white tiles in 2 closest rows/columns
            console.log('Drawing grid')
            drawGrid()
            newGame = false
        }
    }
}

function iterateGrid(oldGrid)
{
    newGrid = new Array(oldGrid.length)
    for (i = 0 ; i < oldGrid[0].length ; i++)
    {
        newGrid[i] = new Array(startingGridSize).fill(0)
    }
    for (i = 0 ; i < oldGrid.length ; i++)
    {
        for (k = 0 ; k < oldGrid[i].length ; k++)
        {
            console.log('Tile Coordinates: X = ', i, 'y = ', k)
            aliveCount = 0
            deadCount = 0
            for (j = i-1 ; j <= i+1 ; j++)
            {
                for (p = k-1 ; p <= k+1 ; p++)
                {
                    console.log('Checking grid[', j, '][', p, ']')
                    if (j < 0)
                    {
                        console.log('(j < 0)')
                        continue
                    }
                    if (p < 0)
                    {
                        console.log('(p < 0)')
                        continue
                    }
                    if (j >= oldGrid.length)
                    {
                        console.log('(j >= oldGrid.length)')
                        continue
                    }
                    if (p >= oldGrid[i].length)
                    {
                        console.log('(p >= oldGrid[i].length)')
                        continue
                    }
                    if (!(j == i && p == k))
                    {
                        if (oldGrid[j][p] == 0)
                        {
                            console.log('deadcount go up')
                            deadCount++
                            continue
                        }
                        else if (oldGrid[j][p] == 1)
                        {
                            console.log('alivecount go up')
                            aliveCount++
                            continue
                        }
                        else
                        {
                            console.log('missed it')
                        }
                    }
                    console.log('hit end of if/else')
                }
            }
            
            console.log('aliveCount = ', aliveCount)
            console.log('deadCount = ', deadCount)
            console.log('Tile Status: ', oldGrid[i][k])
            if ((oldGrid[i][k] == 1) && (aliveCount == 3 || aliveCount == 2))
            {
                //console.log('Alive Tile Survives')
                newGrid[i][k] = 1
            }
            else if ((oldGrid[i][k] == 0) && (aliveCount == 3))
            {
                //console.log('Dead Tile Ressurects')
                newGrid[i][k] = 1
            }       
            else
            {
                //console.log('Tile Dies/Stays Dead')
                newGrid[i][k] = 0
            }     
        }
    }
    return newGrid
}

function drawGrid()
{
    for (i = 0 ; i < grid.length ; i++)
    {
        for (k = 0 ; k < grid[i].length ; k++)
        {
            if (grid[i][k] == 0)
            {
                canvasCtx.beginPath();
                canvasCtx.rect(i * (gameWidth / grid.length), (k * (gameHeight / grid[0].length)) + 100, gameWidth / grid.length, gameHeight / grid[0].length);
                canvasCtx.fillStyle = '#000000' 
                canvasCtx.fill();
                canvasCtx.stroke();
                canvasCtx.closePath();
            }
            else if (grid[i][k] == 1)
            {
                canvasCtx.beginPath();
                canvasCtx.rect(i * (gameWidth / grid.length), (k * (gameHeight / grid[0].length)) + 100, gameWidth / grid.length, gameHeight / grid[0].length);
                canvasCtx.fillStyle = '#FFFFFF' 
                canvasCtx.fill();
                canvasCtx.stroke();
                canvasCtx.closePath();
            }
        }
    }
}

function clearCanvas() 
{
    canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function clearGame() 
{
    canvasCtx.clearRect(0, 100, canvasWidth, canvasHeight);
}

function createButton(menuButton)
{
    radius = 10;
    canvasCtx.beginPath();
    canvasCtx.moveTo(menuButton.x + radius, menuButton.y);
    canvasCtx.lineTo(menuButton.x + menuButton.width - radius, menuButton.y);
    canvasCtx.quadraticCurveTo(menuButton.x + menuButton.width, menuButton.y, menuButton.x + menuButton.width, menuButton.y + radius);
    canvasCtx.lineTo(menuButton.x + menuButton.width, menuButton.y + menuButton.height - radius);
    canvasCtx.quadraticCurveTo(menuButton.x + menuButton.width, menuButton.y + menuButton.height, menuButton.x + menuButton.width - radius, menuButton.y + menuButton.height);
    canvasCtx.lineTo(menuButton.x + radius, menuButton.y + menuButton.height);
    canvasCtx.quadraticCurveTo(menuButton.x, menuButton.y + menuButton.height, menuButton.x, menuButton.y + menuButton.height - radius);
    canvasCtx.lineTo(menuButton.x, menuButton.y + radius);
    canvasCtx.quadraticCurveTo(menuButton.x, menuButton.y, menuButton.x + radius, menuButton.y);
    if (menuButton.isSelected === false) {
        canvasCtx.fillStyle = '#BFBFBF' //Color of Unselected Levels
    } else {
        canvasCtx.fillStyle = '#FFFFFF'; //Color of Regular Buttons 
    }
    canvasCtx.fill();
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = '#000000'; //Color Of Box Outline
    canvasCtx.stroke();
    canvasCtx.closePath();
    canvasCtx.fillStyle = '#000000'; //Color of Text
    canvasCtx.textAlign = 'center';
    
    console.log('No Font Detected')
    canvasCtx.font = '18pt Impact';
    canvasCtx.fillText(menuButton.text, menuButton.x + menuButton.width / 2, menuButton.y + (menuButton.height * .7));
}

function drawMenu() {
    clearCanvas()
        
    removeListener(); //Might be able to delete this
    
    canvas.addEventListener('click', listener);
        
    for (i = 0; i < menuButtons.length; i++) {
        createButton(menuButtons[i]);
    }
}

//Removes listener
function removeListener() {
    canvas.removeEventListener('click', listener);
}

//Calculates mouse position for use in listeners
function getMousePos(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

//Check mouse position against button areas
function isInside(pos, rect) {
    return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height && pos.y > rect.y;
}

//listener function for the menu buttons
function listener(evt) {
    let mousePos = getMousePos(canvas, evt);
    if (isInside(mousePos, menuButtons[0])) {
        isRunning = true
    } else if (isInside(mousePos, menuButtons[1])) {
        isRunning = false
    } else if (isInside(mousePos, menuButtons[2])) {
        resetGrid()
    } else if (isInside(mousePos, menuButtons[3])) {
        //idk
    }
}

function resetGrid()
{
    grid = new Array(startingGridSize)
    for (i = 0 ; i < grid.length ; i++)
    {
        grid[i] = new Array(startingGridSize).fill(0)
    }
    clearGame()
    drawGrid()
}

drawMenu()
game(true)