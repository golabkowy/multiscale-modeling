function saveToPng() {
    var filename = document.getElementById('fileName').value
    var canvas = document.getElementById("canvas"), ctx = canvas.getContext("2d");
    canvas.toBlob(function (blob) {
        saveAs(blob, filename + '.png');
    });

}

var sizeX = document.getElementById("sizeX").value;
var sizeY = document.getElementById("sizeY").value;
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var actualTab;
var previousTab;
var inclusionsTab;
var DP = initArray(600, 600);
var energyRecTab;

var cellsArray = new Array();
var cellsArrayRec = new Array();

function monteCarlo() {
    var cycles = document.getElementById("numberOfIterations").value;
    var sizeX = document.getElementById("sizeX").value;
    var sizeY = document.getElementById("sizeY").value;

    generateRandomCells();

    actualTab = initArray(sizeX, sizeY);
    previousTab = initArray(sizeX, sizeY);
    copyArray(previousTab, DP, sizeX, sizeY);
    fillMatrixByRandomCells(sizeX, sizeY);


    var intervalId = setInterval(function () {
        cycles--;
        getRandomCellFromMatrixAndAddItToVisited(sizeX, sizeY);
        drawCells(sizeX, sizeY);

        if (cycles === 0) {
            clearInterval(intervalId);
        }
    }, 1)
    copyArray(actualTab, previousTab, sizeX, sizeY);
    drawCells(sizeX, sizeY);

};

function grainGrowingMain() {
    var cycles = document.getElementById("numberOfIterations").value;
    var sizeX = document.getElementById("sizeX").value;
    var sizeY = document.getElementById("sizeY").value;
    var numberOfNucleons = document.getElementById("numberOfNucleons").value;

    generateRandomCells();

    actualTab = initArray(sizeX, sizeY);
    previousTab = initArray(sizeX, sizeY);
    copyArray(actualTab, DP, sizeX, sizeY);
    generateRandomGrains(numberOfNucleons, sizeX, sizeY);

    var intervalId = setInterval(function () {
        cycles--;
        copyArray(previousTab, actualTab, sizeX, sizeY);
        grainGrowing(sizeX, sizeY);
        drawCells(sizeX, sizeY);
        if (cycles === 0) {
            clearInterval(intervalId);
        }
    }, 1)
}

function Cell(id) {
    this.id = id;
    this.energy = null;
    this.energyRec = null;
    this.recrystalized = false;
    this.rgba = [];
}

function generate2DArray(rows) {
    var array = [];
    for (var i = 0; i < rows; i++) {
        array[i] = [];
    }
    return array;
}

function initArray(sizeX, sizeY) {
    var array = generate2DArray(sizeX);
    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeY; j++) {
            array[i][j] = new Cell(0);
            array[i][j].rgba = [255, 255, 255, 0];
        }
    }
    return array;
}

function fillMatrixByRandomCells(sizeX, sizeY) {
    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeY; j++) {
            if (previousTab[i][j].id !== -3) {
                previousTab[i][j] = getRandomCellFromArray();
            }

        }
    }
}

function generateRandomGrains(numberOfNucleons, sizeX, sizeY) {
    var xCoord;
    var yCoord;
    for (var i = 1; i <= numberOfNucleons; i++) {
        var cell = cellsArray[(Math.floor(Math.random() * cellsArray.length))];//random z mapy dostepnych juz kolorkow
        xCoord = Math.floor(Math.random() * (sizeX - 2)) + 1;
        yCoord = Math.floor(Math.random() * (sizeY - 2)) + 1;
        if (actualTab[xCoord][yCoord].id != -1 && actualTab[xCoord][yCoord].id != -3) {
            actualTab[xCoord][yCoord] = cell;
        } else {
            i--;
        }

    }
}

function grainGrowing(sizeX, sizeY) {
    for (var i = 1; i < sizeX - 1; i++) {
        for (var j = 1; j < sizeY - 1; j++) {
            if (previousTab[i][j].id != 0 && previousTab[i][j].id != -1 && previousTab[i][j].id != -3) {
                mooreNeighbourhood(i, j, previousTab[i][j]);
            }
        }
    }
    copyArray(previousTab, actualTab);
}

function mooreNeighbourhood(x, y, cell) {
    for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
            if (previousTab[i][j].id === 0 && previousTab[i][j].id !== -1) {
                actualTab[i][j].id = cell.id;
                actualTab[i][j].rgba = cell.rgba;
            }
        }
    }
}

function getRandomCellFromArrayRec() {
    var numberOfKindsOfCells = document.getElementById("numberOfKindsOfCells").value;
    return cellsArrayRec[Math.floor(Math.random() * numberOfKindsOfCells - 1) + 1];
}

function generateRandomCellsRec() {
    var numberOfKindsOfCells = document.getElementById("numberOfKindsOfCells").value;
    for (var i = 1; i <= numberOfKindsOfCells; i++) {
        var cell = new Cell(i);
        var rgba = new Array();
        rgba.push(Math.floor(Math.random() * 255) + 1);
        rgba.push(Math.floor(Math.random() * 255) + 1);
        rgba.push(Math.floor(Math.random() * 255) + 1);
        cell.rgba = rgba;
        cell.energy = null;
        cellsArrayRec.push(cell);
    }
}

function getRandomCellFromArray() {
    var numberOfKindsOfCells = document.getElementById("numberOfKindsOfCells").value;
    return cellsArray[Math.floor(Math.random() * numberOfKindsOfCells - 1) + 1];
}

function generateRandomCells() {
	console.log("wchodze i losuje kolorki");
    var numberOfKindsOfCells = document.getElementById("numberOfKindsOfCells").value;
    for (var i = 1; i <= numberOfKindsOfCells; i++) {
        var cell = new Cell(i);
        var rgba = new Array();
        rgba.push(Math.floor(Math.random() * 255) + 1);
        rgba.push(Math.floor(Math.random() * 255) + 1);
        rgba.push(Math.floor(Math.random() * 255) + 1);
        cell.rgba = rgba;
        cell.energy = null;
        cellsArray.push(cell);
    }
}

var energyBefore;
var energyAfter;
var delta;
var basicCellValue;
var otherTestCell;
var x;
var y;

function getRandomCellFromMatrixAndAddItToVisited(sizeX, sizeY) {

    for (var i = 0; i < 10000; i++) {
        x = Math.floor((Math.random() * (sizeX - 2)) + 1);
        y = Math.floor((Math.random() * (sizeY - 2)) + 1);

        if (previousTab[x][y].id === -3) {
            continue;
        }
		
		if (previousTab[x][y].recrystalized === true) {
            continue;
        }
		
        basicCellValue = previousTab[x][y];

        otherTestCell = getRandomCellFromArray(); // to ma byc brane z sasiadow bo inaczej nie ma snesu...

        energyBefore = designateEnergyForCell(x, y);
        if (energyBefore === 0) {
            continue;
        }
        previousTab[x][y] = otherTestCell;
        energyAfter = designateEnergyForCell(x, y);

        delta = energyAfter - energyBefore;

        if (delta <= 0) {
            previousTab[x][y] = otherTestCell;
        } else if (delta > 0) {
            previousTab[x][y] = basicCellValue;
        }
    }
    copyArray(actualTab, previousTab, sizeX, sizeY);
}

function recrystalization(sizeX, sizeY) {

    for (var i = 0; i < 10000; i++) {
        x = Math.floor((Math.random() * (sizeX - 2)) + 1);
        y = Math.floor((Math.random() * (sizeY - 2)) + 1);

        if (previousTab[x][y].id === -3) {
            continue;
        }
		
		if (previousTab[x][y].recrystalized === true) {
            continue;
        }
		
        basicCellValue = previousTab[x][y];

        otherTestCell = getRandomCellFromArray(); // to ma byc brane z sasiadow bo inaczej nie ma snesu...

        energyBefore = designateEnergyForCellRec(x, y);
        if (energyBefore === 0) {
            continue;
        }
        previousTab[x][y] = otherTestCell;
        energyAfter = designateEnergyForCellRec(x, y);

        delta = energyAfter - energyBefore;

        if (delta <= 0) {
            previousTab[x][y] = otherTestCell;
        } else if (delta > 0) {
            previousTab[x][y] = basicCellValue;
        }
    }
    copyArray(actualTab, previousTab, sizeX, sizeY);
}
function designateEnergyForCellRec(x, y) {
    var energy = 0;
    for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
            if (x == i && y == j) {
                continue;
            }
            if (previousTab[i][j].id !== previousTab[x][y].id) {
                energy++;
            }
        }
    }
    return energy;
}

function designateEnergyForCell(x, y) {
    var energy = 0;
    for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
            if (x == i && y == j) {
                continue;
            }
            if (previousTab[i][j].id !== previousTab[x][y].id) {
                energy++;
            }
        }
    }
    return energy;
}

function drawCells(sizeX, sizeY) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, 600, 600);
    var sizeOfCell = Math.floor(600 / sizeX);

    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeY; j++) {
            ctx.fillStyle = 'rgb' + '(' + previousTab[i][j].rgba[0] + ',' + previousTab[i][j].rgba[1] + ',' + previousTab[i][j].rgba[2] + ')';
            ctx.fillRect(i * sizeOfCell, j * sizeOfCell, sizeOfCell, sizeOfCell)
        }
    }
}

function copyArray(arrayToCopy1, arrayToCopy2, sizeX, sizeY) {
    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeY; j++) {
            arrayToCopy1[i][j].id = arrayToCopy2[i][j].id;
            arrayToCopy1[i][j].rgba = arrayToCopy2[i][j].rgba;
        }
    }
}


function showArray(arr, sizex, sizey) {
    for (var i = 1; i < sizex; i++) {
        console.log(arr[i])
    }
}

function dualPhase() {
    var cycles = document.getElementById("numberOfIterations").value;
    var sizeX = document.getElementById("sizeX").value;
    var sizeY = document.getElementById("sizeY").value;

    var map = new Map();

    for (var i = 1; i < actualTab.length - 1; i++) {
        for (var j = 1; j < actualTab[0].length - 1; j++) {

            if (map.has(actualTab[i][j].id) === false) {
                map.set(actualTab[i][j].id, 1);
            } else if (map.has(actualTab[i][j].id) === true) {
                var value = map.get(actualTab[i][j].id) + 1;
                map.delete(actualTab[i][j].id);
                map.set(actualTab[i][j].id, value)
            }
        }
    }

    var maxId;
    var maxValue = Math.max(...Array.from(map.values())
)
    ;


    for (var key of map.keys()) {
        if (map.get(key) === maxValue) {
            maxId = key;
        }
    }

    var selectedGrains = initArray(actualTab.length, actualTab[0].length);

    for (var i = 1; i < sizeX - 1; i++) {
        for (var j = 1; j < sizeY - 1; j++) {
            if (actualTab[i][j].id === maxId) {
                selectedGrains[i][j].id = -3;
                selectedGrains[i][j].rgba = [255, 0, 255, 0];
            }
        }
    }

    copyArray(DP, selectedGrains, sizeX, sizeY);
    previousTab = initArray(sizeX, sizeY);
    copyArray(previousTab, DP, sizeX, sizeY);
    drawCells(sizeX, sizeY);
}

var edgesTab = [];

function Coords(x, y) {
    this.x = x;
    this.y = y;
}

function detectEdges() {
    var edgesCells = initArray(actualTab.length, actualTab[0].length);

    for (var i = 1; i < actualTab.length - 1; i++) {
        for (var j = 1; j < actualTab[0].length - 1; j++) {
            checkIfCellIsOnTheEdge(i, j, actualTab[i][j].id, edgesCells);
        }
    }
    return edgesCells;
}

function checkIfCellIsOnTheEdge(x, y, id, edgesCells) {
    for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
            if (actualTab[i][j].id !== id) {
                var edgeCell = new Coords(i, j);
                edgesCells[i][j].id = -2;
                edgesCells[i][j].rgba = [1, 1, 1];
                edgesTab.push(edgeCell);
            }
        }
    }
}

function copyEdges(arrayToCopy1, arrayToCopy2, sizeX, sizeY) {
    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeY; j++) {
            if (arrayToCopy2[i][j].id !== 0) {
                arrayToCopy1[i][j].id = arrayToCopy2[i][j].id;
                arrayToCopy1[i][j].coordX = arrayToCopy2[i][j].coordY;
                arrayToCopy1[i][j].coordY = arrayToCopy2[i][j].coordY;
                arrayToCopy1[i][j].rgba = arrayToCopy2[i][j].rgba;
            }

        }
    }
}

function generateRandomInclusionsOnEdges() {
    var numberOfInclusions = document.getElementById("srxmcNucleons").value;
    var edgeCell;
    for (var i = 0; i <= numberOfInclusions; i++) {
        edgeCell = edgesTab[Math.floor(Math.random() * (edgesTab.length - 15)) + 15];
        insertInclusion(edgeCell.x, edgeCell.y);
    }

}

function markDetectedEdges() {
    var edges = detectEdges();
    showArray(actualTab, actualTab.length, actualTab[0].length);
    copyEdges(actualTab, edges, actualTab.length, actualTab[0].length);
    showArray(actualTab, actualTab.length, actualTab[0].length);
    drawCells(actualTab.length, actualTab[0].length);
}

function copyInclusionsToArray(sizeX, sizeY) {
    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeY; j++) {
            if (inclusionsTab[i][j].id !== 0) {
                actualTab[i][j] = inclusionsTab[i][j];
            }
        }
    }
}

function insertInclusionsOnCellsEdges() {
    var sizeX = document.getElementById("sizeX").value;
    var sizeY = document.getElementById("sizeY").value;
    var edges = detectEdges();
    inclusionsTab = initArray(sizeX, sizeY);
    generateRandomInclusionsOnEdges();
    copyInclusionsToArray(sizeX, sizeY);
}

function insertInclusion(coordX, coordY) {
    inclusionsTab[coordX][coordY].id = -1;
    inclusionsTab[coordX][coordY].rgba = [0, 0, 0];
}

function newcolors(){
	generateRandomCellsRec();
}
function insertNewNucloeonsOnCellsEdges() {
	console.log(cellsArrayRec);
    var sizeX = document.getElementById("sizeX").value;
    var sizeY = document.getElementById("sizeY").value;
    var edges = detectEdges();
    inclusionsTab = initArray(sizeX, sizeY);
    generateRandomNewNucleonsOnEdges();
    copyNewNucleonsToArray(sizeX, sizeY);
}

function generateRandomNewNucleonsOnEdges() {
    var numberOfInclusions = document.getElementById("srxmcNucleons").value;
    var edgeCell;
    for (var i = 0; i <= numberOfInclusions; i++) {
        edgeCell = edgesTab[Math.floor(Math.random() * (edgesTab.length - 15)) + 15];
        insertNewNucleon(edgeCell.x, edgeCell.y);
    }

}

function insertNewNucleon(coordX, coordY) {
    inclusionsTab[coordX][coordY] = getRandomCellFromArrayRec();
	inclusionsTab[coordX][coordY].recrystalized = false;

}

function copyNewNucleonsToArray(sizeX, sizeY) {
    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeY; j++) {
            if (inclusionsTab[i][j].id !== 0) {
                previousTab[i][j] = inclusionsTab[i][j];
            }
        }
    }
}

function insertNewNucleonsRandomly(){
	var sizeX = document.getElementById("sizeX").value;
    var sizeY = document.getElementById("sizeY").value;
    var edges = detectEdges();
    inclusionsTab = initArray(sizeX, sizeY);
}

function drawEnergy(sizeX, sizeY) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, 600, 600);
    var sizeOfCell = Math.floor(600 / sizeX);

    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeY; j++) {
            ctx.fillStyle = 'rgb' + '(' + energyRecTab[i][j].rgba[0] + ',' + energyRecTab[i][j].rgba[1] + ',' + energyRecTab[i][j].rgba[2] + ')';
            ctx.fillRect(i * sizeOfCell, j * sizeOfCell, sizeOfCell, sizeOfCell)
        }
    }
}

function initArrayEnergy(sizeX, sizeY, arrayToDesignateEnergy) {
    var array = generate2DArray(sizeX);
    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeY; j++) {
            array[i][j] = new Cell(0);
            array[i][j].rgba = [255, 255, 255, 0];
            if (arrayToDesignateEnergy[i][j].id == -2) {
                array[i][j].id = -2;
                array[i][j].rgba = [255, 255, 0, 0];
                array[i][j].energyRec = 0;
            }
            else {
                array[i][j].id = arrayToDesignateEnergy[i][j].id;
                array[i][j].rgba = [0, 0, 255, 0];
                array[i][j].energyRec = 0;
            }
        }
    }
    return array;
}

function showEnergy() {
    var sizeX = document.getElementById("sizeX").value;
    var sizeY = document.getElementById("sizeY").value;
    var edgesArray = detectEdges();
    energyRecTab = initArrayEnergy(sizeX, sizeY, edgesArray);
    drawEnergy(sizeX, sizeY);
}

function drawCellsTest() {
    var sizeX = document.getElementById("sizeX").value;
    var sizeY = document.getElementById("sizeY").value;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, 600, 600);
    var sizeOfCell = Math.floor(600 / sizeX);

    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeY; j++) {
            ctx.fillStyle = 'rgb' + '(' + actualTab[i][j].rgba[0] + ',' + actualTab[i][j].rgba[1] + ',' + actualTab[i][j].rgba[2] + ')';
            ctx.fillRect(i * sizeOfCell, j * sizeOfCell, sizeOfCell, sizeOfCell)
        }
    }
}

function freezeAllCells(){
	var sizeX = document.getElementById("sizeX").value;
    var sizeY = document.getElementById("sizeY").value;
    console.log("freeze2");
	
	for(var i = 0 ; i < sizeX ; i++){
		for(var j = 0 ; j < sizeY ; j++){
			actualTab[i][j].recrystalized = true;
		}
	}
}

function constant() {
    var cycles = document.getElementById("numberOfIterations").value;
    var sizeX = document.getElementById("sizeX").value;
    var sizeY = document.getElementById("sizeY").value;
	freezeAllCells();
    copyArray(previousTab, actualTab, sizeX, sizeY);
	insertNewNucloeonsOnCellsEdges();
    var intervalId = setInterval(function () {
        cycles--;
		console.log("inside bro");
		insertNewNucloeonsOnCellsEdges();
        getRandomCellFromMatrixAndAddItToVisited(sizeX, sizeY);
        drawCells(sizeX, sizeY);

        if (cycles === 0) {
            clearInterval(intervalId);
        }
    }, 1)
    copyArray(actualTab, previousTab, sizeX, sizeY);
    drawCells(sizeX, sizeY);
}

function siteSaturatedNucleation() {
    var cycles = document.getElementById("numberOfIterations").value;
    var sizeX = document.getElementById("sizeX").value;
    var sizeY = document.getElementById("sizeY").value;
	freezeAllCells();
	freezeAllCellsLol();
    copyArray(previousTab, actualTab, sizeX, sizeY);
	generateRandomGrains(numberOfNucleons, sizeX, sizeY);
    var intervalId = setInterval(function () {
        cycles--;
		console.log("inside bro");
		insertNewNucloeonsOnCellsEdges();
        getRandomCellFromMatrixAndAddItToVisited(sizeX, sizeY);
        drawCells(sizeX, sizeY);
        if (cycles === 0) {
            clearInterval(intervalId);
        }
    }, 1)
    copyArray(actualTab, previousTab, sizeX, sizeY);
    drawCells(sizeX, sizeY);
}

function increasingNucleation() {
    var cycles = document.getElementById("numberOfIterations").value;
    var sizeX = document.getElementById("sizeX").value;
    var sizeY = document.getElementById("sizeY").value;
	freezeAllCells();
	freezeAllCellsLol();
    copyArray(previousTab, actualTab, sizeX, sizeY);
	insertNewNucloeonsOnCellsEdges();
    var intervalId = setInterval(function () {
        cycles--;
		console.log("inside bro");
		insertNewNucloeonsOnCellsEdges();
        getRandomCellFromMatrixAndAddItToVisited(sizeX, sizeY);
        drawCells(sizeX, sizeY);

        if (cycles === 0) {
            clearInterval(intervalId);
        }
    }, 1)
    copyArray(actualTab, previousTab, sizeX, sizeY);
    drawCells(sizeX, sizeY);
}
