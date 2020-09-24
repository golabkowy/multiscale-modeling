<html>
<head>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="./FileSaver.min.js"></script>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
          integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css"
          integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

    <!-- Latest compiled and minified JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
            integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa"
            crossorigin="anonymous"></script>
</head>
<body>

<div class="row" id="canvasWrapper">
    <div class="col-md-12 centered">
        <canvas id="canvas" width="600" height="600" style="border:1px solid #000000;"></canvas>
    </div>

</div>


<div class="container">
    <div class="row">
        <div class="col-md-3">
            <h1>Input data :</h1>
            <br>
            Number of possible collors :
            <br>
            <input type="text" id="numberOfKindsOfCells">
            <br>
            Number of nucleons :
            <br>
            <input type="text" id="numberOfNucleons">
            <br>
            Number of iterations :
            <br>
            <input type="text" id="numberOfIterations">
            <br>
            Array sizes :
            <br>
            Size X :
            <br>
            <input type="text" id="sizeX">
            <br>
            Size Y :
            <br>
            <input type="text" id="sizeY">
        </div>


        <div class="col-md-3">
            <h1>Simulation options :</h1>
            <br>
            <input type="submit" class="btn btn-primary" onclick="main()" value='RunSimulation'>
            <br>
            <input type="submit" class="btn btn-primary" onclick="mainExtended()" value='RunSimulationExtendedMoore'>
            <br>
            Insert probability for 4th rule :
            <input type="text" id="mooreProbability">
            <br>
            <input type="submit" class="btn btn-primary" onclick="test()" value="DualPhase">
            <br>
        </div>


        <div class="col-md-3">
            <h1>Inclusions & Phases :</h1>
            <br>
            Number of inclusions:
            <br>
            <input type="text" id="numberOfInclusions">
            <br>
            Inclusions shape:
            <br>
            <input type="checkbox" id="circleInclusion" value="Circle"> Circle inclusions
            <br>
            Inclusion range:
            <br>
            <input type="text" id="sizeOfInclusion">
            <br>
            <input type="submit" class="btn btn-primary" value="Add-inclusions-after-simulation"
                   onclick="addInclusionAfterSimulation()">
            <br>
            <input type="submit" class="btn btn-primary" value="Run-with-inclsions" onclick="mainWithInclusions()">
            <br>
            <input type="submit" class="btn btn-primary" value="EdgesInclusions"
                   onclick="insertInclusionsOnCellsEdges()">
            <br>
            <!--checkbox-->
            <input type="submit" class="btn btn-primary" value="DetectEdges" onclick="markDetectedEdges()">
            <br>
        </div>
        <div class="col-md-3">
            <h1>Files management :</h1>
            <br>
            File Name:
            <br>
            <input type="text" id="fileName" value="example">
            <br>
            <input type="submit" class="btn btn-primary" onclick="saveToPng()" value='Save-as-image'>
            <br>
            <input type="submit" class="btn btn-primary" onclick="saveToJSON()" value='Save-to-JSON'>
            <br>
            <input type="submit" class="btn btn-primary" onclick="saveToTXTFile()" value='Save-to-TXT'>
            <br>
            <input type="submit" class="btn btn-primary" onclick="mainWithJSON()" value='RunWithJSON'>
            <br>
            JSON Reader :)
            <br>
            <div id="dragNDrop" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
        </div>
    </div>
</div>

</body>

<style>
    #canvas {
        background-color: white;
    }

    #dragNDrop {
        width: 350px;
        height: 70px;
        padding: 10px;
        border: 1px solid #aaaaaa;
    }

    body {
        background-color: #7f7f7f;
    }

    #canvas {
        display: table;
        margin: 0 auto;
        border: 3px solid #000000;
    }

    #canvasWrapper {
        margin-top: 50px;
    }

    .container {
        margin-top: 50px;
    }
</style>


<script>

    //kilka warunkow
    //wszystkie pola wypelnione
    //nie generujemu nulli id w losowych cellkach
    //ilosc podanych ziarenek nie moze byc wieksza niz ilosc elementow w tabie

    //File savers
    function saveToJSON() {
        var filename = document.getElementById('fileName').value;
        var json = JSON.stringify(actualTab);
        var blob = new Blob([json], {type: "application/json"});
        saveAs(blob, filename + '.json');
    }

    function saveToTXTFile() {
        var filename = document.getElementById('fileName').value
        var json = JSON.stringify(actualTab);
        var blob = new Blob([json], {type: "text/plain;charset=utf-8/json"});
        saveAs(blob, filename + '.txt');
    }

    function saveToPng() {
        var filename = document.getElementById('fileName').value
        var canvas = document.getElementById("canvas"), ctx = canvas.getContext("2d");
        canvas.toBlob(function (blob) {
            saveAs(blob, filename + '.png');
        });

    }


    // Script
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    var actualTab;
    var previousTab;
    var inclusionsTab;
    var colorsMap = new Map();
    var cellsMap = new Map();

    function main() {
        var cycles = document.getElementById("numberOfIterations").value;
        var sizeX = document.getElementById("sizeX").value;
        var sizeY = document.getElementById("sizeY").value;
        var numberOfNucleons = document.getElementById("numberOfNucleons").value;

        generateRandomColor();
        generateRandomCells();

        actualTab = initArray(sizeX, sizeY);
        previousTab = initArray(sizeX, sizeY);
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
    };


    function Cell(id) {
        this.id = id;
        this.rgba = [];
    }


    //init and clean function
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

    function generateRandomGrains(numberOfGrains, sizeX, sizeY) {
        var randomArray = [];
        var xCoord;
        var yCoord;
//zeby zapobiec 0 id w generatorze
        for (i = 1; i <= numberOfGrains; i++) {
            var cell = cellsMap.get(Math.floor(Math.random() * cellsMap.size));//random z mapy dostepnych juz kolorkow
            xCoord = Math.floor(Math.random() * (sizeX - 2)) + 1;
            yCoord = Math.floor(Math.random() * (sizeY - 2)) + 1;
            if (actualTab[xCoord][yCoord].id != -1 && actualTab[xCoord][yCoord].id != -3) {
                //cell.rgba = generateRandomColor(i);
                //cell.rgba = colorsMap.get(Math.floor(Math.random()*colorsMap.size) + 1);//random z mapy dostepnych juz kolorkow
                actualTab[xCoord][yCoord] = cell;
                randomArray.push(cell);
            } else {
                i--;
            }

        }
    }

    //zmienilem zeby bylo dodawanie kolorkow do mapy na podstawie liczby ile ich chcemy wczesniej kazda ceka miala inny kolor
    function generateRandomColor() {
        var numberOfKindsOfCells = document.getElementById("numberOfKindsOfCells").value;

        for (var i = 0; i < numberOfKindsOfCells; i++) {
            var rgba = new Array();
            rgba.push(Math.floor(Math.random() * 255) + 1);
            rgba.push(Math.floor(Math.random() * 255) + 1);
            rgba.push(Math.floor(Math.random() * 255) + 1);
            colorsMap.set(i, rgba);
        }

    }

    function generateRandomCells() {
        var numberOfKindsOfCells = document.getElementById("numberOfKindsOfCells").value;
        for (var i = 0; i < numberOfKindsOfCells; i++) {
            var cell = new Cell(i);
            cell.rgba = colorsMap.get(i);
            cellsMap.set(i, cell);
        }

    }


    //tutaj byla petla do cykli ale robimy to w innej funkcji z interwalkiem i rysowaniem
    function grainGrowing(sizeX, sizeY) {
        for (var i = 1; i < sizeX - 1; i++) {
            for (var j = 1; j < sizeY - 1; j++) {
                //tutaj ogarniamy czy jest pusta,inclusion,czy ta zostawiona dla DP
                if (previousTab[i][j].id != 0 && previousTab[i][j].id != -1 && previousTab[i][j].id != -3) {
                    mooreNeighbourhood(i, j, previousTab[i][j]);
                }
            }
        }
        copyArray(previousTab, actualTab);
    }

    //to juz sprawdzanie sasiedztwa i kolorowanie
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

    function drawCells(sizeX, sizeY) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, 800, 800);

        var sizeOfCell = Math.floor(800 / sizeX);

        for (var i = 0; i < sizeX; i++) {
            for (var j = 0; j < sizeY; j++) {
                ctx.fillStyle = 'rgb' + '(' + actualTab[i][j].rgba[0] + ',' + actualTab[i][j].rgba[1] + ',' + actualTab[i][j].rgba[2] + ')';
                //przeliczyc jakos wielkosc okienka na wielkosc tablicy
                ctx.fillRect(i * sizeOfCell, j * sizeOfCell, sizeOfCell, sizeOfCell)
            }
        }
    }

    function copyArray(arrayToCopy1, arrayToCopy2, sizeX, sizeY) {
        for (var i = 0; i < sizeX; i++) {
            for (var j = 0; j < sizeY; j++) {
                arrayToCopy1[i][j].id = arrayToCopy2[i][j].id;
                //arrayToCopy1[i][j].coordX = arrayToCopy2[i][j].coordY;
                //arrayToCopy1[i][j].coordY = arrayToCopy2[i][j].coordY;
                arrayToCopy1[i][j].rgba = arrayToCopy2[i][j].rgba;
            }
        }
    }


    function dropJSON(targetEl, callback) {
        // disable default drag & drop functionality
        targetEl.addEventListener('dragenter', function (e) {
            e.preventDefault();
        });
        targetEl.addEventListener('dragover', function (e) {
            e.preventDefault();
        });

        targetEl.addEventListener('drop', function (event) {

            var reader = new FileReader();
            reader.onloadend = function () {
                var data = JSON.parse(this.result);
                callback(data);
            };

            reader.readAsText(event.dataTransfer.files[0]);
            event.preventDefault();
        });
    }


    var data;

    dropJSON(
        document.getElementById("dragNDrop"),
        function (dataFromJSON) {
            // dropped - do something with data
            data = dataFromJSON;
            //mainWithJSON(data);

        }
    );

    //#################
    function mainWithJSON() {
        var cycles = document.getElementById("numberOfIterations").value;
        var sizeX = data[0].length;
        var sizeY = data[0].length;
        //var numberOfNucleons = document.getElementById("numberOfNucleons").value;
        actualTab = initArray(sizeX, sizeY);
        previousTab = initArray(sizeX, sizeY);
        copyArray(actualTab, data, data.length, data.length);
        copyArray(previousTab, actualTab, data.length, data.length);
        //previousTab = initArray(sizeX, sizeY);
        //generateRandomGrains(numberOfNucleons, sizeX, sizeY);

        var intervalId = setInterval(function () {
            cycles--;
            copyArray(previousTab, actualTab, sizeX, sizeY);
            grainGrowing(sizeX, sizeY);
            drawCells(sizeX, sizeY);
            if (cycles === 0) {
                clearInterval(intervalId);
            }
        }, 1)
    };

    function insertInclusion(coordX, coordY) {
        var sizeOfInclusion = Number(document.getElementById("sizeOfInclusion").value);
        var circleInclusion = document.getElementById("circleInclusion").checked;
        if (circleInclusion) {
            for (var i = coordX - Math.round(sizeOfInclusion / 2); i <= coordX + Math.round(sizeOfInclusion / 2); i++) {
                for (var j = coordY - Math.round(sizeOfInclusion / 2); j <= coordY + Math.round(sizeOfInclusion / 2); j++) {
                    if ((((i - coordX) * (i - coordX)) + ((j - coordY) * (j - coordY))) <= (sizeOfInclusion / 2 * sizeOfInclusion / 2)) {
                        inclusionsTab[i][j].id = -1;
                        inclusionsTab[i][j].rgba = [1, 1, 1];
                    }

                }
            }
        } else {
            for (var i = coordX - Math.round(sizeOfInclusion / 2); i <= coordX + Math.round(sizeOfInclusion / 2); i++) {
                for (var j = coordY - Math.round(sizeOfInclusion / 2); j <= coordY + Math.round(sizeOfInclusion / 2); j++) {

                    inclusionsTab[i][j].id = -1;
                    inclusionsTab[i][j].rgba = [1, 1, 1];


                }
            }
        }

    }

    function generateInclusions(sizeX, sizeY) {
        var numberOfInclusions = document.getElementById("numberOfInclusions").value;
        var xCoord;
        var yCoord;
        var sizeOfInclusion = Number(document.getElementById("sizeOfInclusion").value);
        for (var i = 0; i <= numberOfInclusions; i++) {
            var cell = new Cell(i);
            // tu byl problem bo bierze to jako stringa i w dzialaniu matematycznym czyta jako stringa wiec pewnie ascii...
            xCoord = Math.floor(Math.random() * (sizeX - sizeOfInclusion * 2)) + sizeOfInclusion;   //tu mzoe byc jeszcze dizelony size na 2 ;)
            yCoord = Math.floor(Math.random() * (sizeY - sizeOfInclusion * 2)) + sizeOfInclusion;   //tu mzoe byc jeszcze dizelony size na 2 ;)
            insertInclusion(xCoord, yCoord);
        }
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

    function addInclusionAfterSimulation() {
        var sizeX = document.getElementById("sizeX").value;
        var sizeY = document.getElementById("sizeY").value;
        inclusionsTab = initArray(sizeX, sizeY);
        generateInclusions(sizeX, sizeY);
        copyInclusionsToArray(sizeX, sizeY);
        drawCells(sizeX, sizeY);
    }

    function mainWithInclusions() {
        var cycles = document.getElementById("numberOfIterations").value;
        var sizeX = document.getElementById("sizeX").value;
        var sizeY = document.getElementById("sizeY").value;
        var numberOfNucleons = document.getElementById("numberOfNucleons").value;
        actualTab = initArray(sizeX, sizeY);
        previousTab = initArray(sizeX, sizeY);
        inclusionsTab = initArray(sizeX, sizeY);
        generateInclusions(sizeX, sizeY);
        generateRandomGrains(numberOfNucleons, sizeX, sizeY);
        copyInclusionsToArray(sizeX, sizeY);

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


    //KOD DO WYKRYWANIA KRAWEDZI


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
        var numberOfInclusions = document.getElementById("numberOfInclusions").value;
        var edgeCell;
        for (var i = 0; i <= numberOfInclusions; i++) {
            //jest problem bo zawze sa te poczatkowe na krawedziach tez a musza miec id mneijsze niz te rozmiary inclusionow /2 jak wyzej w generacji
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

    function insertInclusionsOnCellsEdges() {
        var sizeX = document.getElementById("sizeX").value;
        var sizeY = document.getElementById("sizeY").value;
        var edges = detectEdges();
        inclusionsTab = initArray(sizeX, sizeY);
        //copyEdges(actualTab,edges,actualTab.length,actualTab[0].length);
        generateRandomInclusionsOnEdges();
        copyInclusionsToArray(sizeX, sizeY);
        drawCells(actualTab.length, actualTab[0].length);
    }


    //EXTENDED MOORE ALGORITHM

    function grainGrowingExtended(sizeX, sizeY) {
        for (var i = 1; i < sizeX - 1; i++) {
            for (var j = 1; j < sizeY - 1; j++) {
                if (previousTab[i][j].id === 0 && previousTab[i][j].id !== -1) {
                    mooreNeighbourhoodExtended(i, j);
                }
            }
        }
        copyArray(previousTab, actualTab, sizeX, sizeY);
    }

    //to juz sprawdzanie sasiedztwa i kolorowanie

    function furtherMoore(x, y) {
        var neighboursArray = new Array();
        for (var i = x - 1; i <= x + 1; i++) {
            for (var j = y - 1; j <= y + 1; j++) {

                if ((i === x - 1 && j === y - 1) || (i === x + 1 && j === y - 1)
                    || (i === x - 1 && j === y + 1) || (i === x + 1 && j === y + 1)) {
                    if (previousTab[i][j].id !== 0 && !(i === x && j === y)) {
                        neighboursArray.push(previousTab[i][j]);
                    }
                }

            }
        }
       // console.log(neighboursArray);
        return neighboursArray;
    }

    function nearestMoore(x, y) {
        var neighboursArray = new Array();
        for (var i = x - 1; i <= x + 1; i++) {
            for (var j = y - 1; j <= y + 1; j++) {

                if ((i === x && j === y - 1) || (i === x && j === y + 1)
                    || (i === x - 1 && j === y) || (i === x + 1 && j === y)) {
                    if (previousTab[i][j].id !== 0 && !(i === x && j === y)) {
                        neighboursArray.push(previousTab[i][j]);
                    }
                }

            }
        }
        //console.log(neighboursArray);
        return neighboursArray;
    }

    function moore(x, y) {
        var neighboursArray = new Array();
        for (var i = x - 1; i <= x + 1; i++) {
            for (var j = y - 1; j <= y + 1; j++) {
                if (previousTab[i][j].id !== 0 && !(i === x && j === y)) { //i nie rowna sie sam sobie...
                    //w ramach  ptymalizacji sprawdzac tu czy ma jakiegokolwiek sasaida bo jesli nie
                    //to nie wpuszczac w dalszy mlyn
                    neighboursArray.push(previousTab[i][j]);
                }

            }
        }
        //console.log(neighboursArray);
        return neighboursArray;
    }


    //ALGOOOOO
    function mooreNeighbourhoodExtended(x, y) {
        var neighboursArray = new Array();
        var mostFrequently;

//        console.log("wchodze w regulki");

        if ((function (x, y) {
                neighboursArray = moore(x, y);
                if (neighboursArray.length !== 0) {
                    mostFrequently = checkWhichIsMostFrequently(neighboursArray);
                } else {
                    return false;
                }
                if (mostFrequently.value === 5) {
                    actualTab[x][y].id = mostFrequently.id;
                    actualTab[x][y].rgba = mostFrequently.rgba;
  //                  console.log("5tka");
                    return true
                } else return false;
            })(x, y)) {
            return;
        } else if ((function (x, y) {
                neighboursArray = nearestMoore(x, y);
                if (neighboursArray.length !== 0) {
    //                console.log("chociaz sprawdzam 1");
                    mostFrequently = checkWhichIsMostFrequently(neighboursArray);
      //              console.log(mostFrequently);
                } else {
                    return false;
                }
                if (mostFrequently.value === 3) {
                    actualTab[x][y].id = mostFrequently.id;
                    actualTab[x][y].rgba = mostFrequently.rgba;
        //            console.log("4tka");
                    return true
                } else return false;
            })(x, y)) {
            return;
        } else if ((function (x, y) {
                neighboursArray = furtherMoore(x, y);
                if (neighboursArray.length !== 0) {
          //          console.log("chociaz sprawdzam ")
                    mostFrequently = checkWhichIsMostFrequently(neighboursArray);
            //        console.log(mostFrequently);
                } else {
                    return false;
                }
                if (mostFrequently.value === 3) {
                    actualTab[x][y].id = mostFrequently.id;
                    actualTab[x][y].rgba = mostFrequently.rgba;
              //      console.log("3tka");
                    return true
                } else return false;
            })(x, y)) {
            return;
        } else if ((function (x, y) {
                neighboursArray = moore(x, y);
                if (neighboursArray.length !== 0) {
                    mostFrequently = checkWhichIsMostFrequently(neighboursArray);
                } else {
                    return false;
                }
                if (mostFrequently.value < 5) {
                    var probablibity = document.getElementById("mooreProbability").value;
                    ;
                    var randomNumber = Math.floor((Math.random() * 100) + 1);
                    if (randomNumber < probablibity) {
                        actualTab[x][y].id = mostFrequently.id;
                        actualTab[x][y].rgba = mostFrequently.rgba;
                        //console.log("randomix");
                        return true;
                    }
                } else return false;
            })(x, y)) {
        }
    }


    function showArray(arr, sizex, sizey) {
        for (var i = 1; i < sizex; i++) {
            // for(var j = 1 ; j < sizey ; j++){
            console.log(arr[i])
            //}
        }
    }

    ///
    function checkWhichIsMostFrequently(neighboursArray) {
        console.log(neighboursArray);
        var map = new Map();


        //tu sie wali cos...
        neighboursArray.forEach(function (tabEl) {
            if (map.has(tabEl.id) === false) {
                console.log("wchodzi chociaz tutej");
                map.set(tabEl, 1);
            } else if (map.has(tabEl.id) === true) {
                console.log("chociaz sprawdzam 1");
                console.log("czekuje se" + map.get(tabEl));
                var value = map.get(tabEl) + 1;
                map.delete(tabEl);
                map.set(tabEl, value)
            }
        });
        //ile najwiecej razy X wystapil
        var maxId;
        var maxValue = Math.max(...Array.from(map.values()));
        var rgba;


        for (var key of map.keys()) {
            if (map.get(key) === maxValue) {
                maxId = key.id;
            }
        }

        if (maxId === 0) {
            rgba = [255, 255, 255];
        } else if (maxId !== 0) {
            rgba = colorsMap.get(maxId);
        }
        console.log("a valu z tego" + maxValue);
        return {'id': maxId, 'value': maxValue, 'rgba': rgba};
    }


    function mainExtended() {
        var cycles = document.getElementById("numberOfIterations").value;
        var sizeX = document.getElementById("sizeX").value;
        var sizeY = document.getElementById("sizeY").value;
        var numberOfNucleons = document.getElementById("numberOfNucleons").value;

        generateRandomColor();
        generateRandomCells();

        actualTab = initArray(sizeX, sizeY);
        previousTab = initArray(sizeX, sizeY);
        generateRandomGrains(numberOfNucleons, sizeX, sizeY);

        var intervalId = setInterval(function () {
            cycles--;
            copyArray(previousTab, actualTab, sizeX, sizeY);
            grainGrowingExtended(sizeX, sizeY);
            drawCells(sizeX, sizeY);
            if (cycles === 0) {
                clearInterval(intervalId);
            }
        }, 1)
    };


    //OKE TERAZ DP + ROZPOZNAWANIE TYCH CELLEK PO KOLORKACH
    //te Odzanaczone jako pierwsza faza bedziemy numerowac od -3
    //wyznaczamy mape id - wystopienie - procent

    function test() {
        var cycles = document.getElementById("numberOfIterations").value;
        var sizeX = document.getElementById("sizeX").value;
        var sizeY = document.getElementById("sizeY").value;
        var numberOfNucleons = document.getElementById("numberOfNucleons").value;


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
        var maxValue = Math.max(...Array.from(map.values()));

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
                    selectedGrains[i][j].coordX = actualTab[i][j].coordX;
                    selectedGrains[i][j].coordYo = actualTab[i][j].coordY;
                    //selectedGrains[i][j].rgba = actualTab[i][j].rgba;
                    selectedGrains[i][j].rgba = [0, 0, 0, 0];
                }
            }
        }

        //zerowanie na nowo tablicy + dodawanie do niej DP -3 nie do ruszenia
        actualTab = initArray(sizeX, sizeY);
        copyArray(actualTab, selectedGrains, sizeX, sizeY);
        //showArray(actualTab);
        //drawCells(100,100);

        generateRandomColor();
        generateRandomCells();
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


</script>


</html>



