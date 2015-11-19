/**
 * Created by allanjohnson on 10/27/15.
 */
var index;
var wordsFromDb = [];
var working = [];
var level2Words = 0;
var level3Words = 0;
var level4Words = 0;
var level5Words = 0;
var originalLength;
//*******************************This is the HTTP request
function loadDoc(button, async) {
    var xhttp = new XMLHttpRequest();
    var jsonString;
    switch (button) {
        case "user":
            var params = "button="+button;
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    Init(xhttp.responseText);
                }
            };
            break;
        case "start":
            var params = "button="+button;
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    Init(xhttp.responseText);
                }
            };
            break;
        case "correct":
            var params = ("button="+button
                + "&id=" +currentCard.id
                + "&shownCount=" + currentCard.shownCount
                + "&rightCount=" + currentCard.rightCount
                + "&wrongCount=" + currentCard.wrongCount
                + "&level=" + currentCard.level
                + "&inARow=" + currentCard.inARow);
            break;
        case "wrong":
            var params = "button="+button;
            break;
        case "end":
            var params = "button="+button;
            break;
        default:

    }
/***************************************/
       //passes which button was pressed as a parameter
    /***************************************/
    xhttp.open("POST", "./fc", async);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(params);
    console.log(params);
    //console.log(jsonString);
}


//*********************************Setup section
//*********************************
function Card(parameters) {
    this.id = parameters.id;
    this.frontSide = parameters.frontSide;
    this.backSide = parameters.backSide || null;
    this.shownCount = parameters.shownCount || 0;
    this.rightCount = parameters.rightCount || 0;
    this.wrongCount = parameters.wrongCount || 0;
    this.inARow = parameters.inARow || 0;
    this.level = parameters.level || 1;
    this.seenThisSession = 0;
    this.rightThisSession = 0;
}
function Init(json){

    console.log(json);
    wordsFromDb = JSON.parse(json);
    for (var i in wordsFromDb) {
        function addCard() {
            wordsFromDb[i] = new Card({
                id: wordsFromDb[i].id,
                frontSide: wordsFromDb[i].front,
                backSide: wordsFromDb[i].back,
                shownCount: wordsFromDb[i].shownCount,
                rightCount: wordsFromDb[i].rightCount,
                wrongCount: wordsFromDb[i].wrongCount,
                inARow: wordsFromDb[i].inARow,
                level: wordsFromDb[i].level
            });
            working.push(wordsFromDb[i]);
        }
        if (wordsFromDb[i].level == 5) {
            level5Words++;
        }
        if (wordsFromDb[i].level == 4) {
            level4Words++;
            if (working.length < 1) {
                addCard();
            }
        }
        if (wordsFromDb[i].level == 3) {
            level3Words++;
            if (working.length < 4) {
                addCard();
            }
        }
        if (wordsFromDb[i].level == 2) {
            level2Words++
            if (working.length < 10) {
                addCard();
            }
        }
        if (wordsFromDb[i].level == 1) {
            if (working.length < 15) {
                addCard();
            }
        }
    }
    originalLength = working.length;
}
var currentCard;

function setup() {
    var cvs = document.getElementById("mainCanvas");
    resizeCanvas(800,400);
    background(220, 220, 220);

    //*********************************CREATE the button sect
    var Button = function(config) {
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.width = config.width || 150;
        this.height = config.height || 50;
        this.label = config.label || "Click";
        this.fill = config.fill || fill(0, 234, 255);
    };

    Button.prototype.draw = function() {
        noStroke();
        rect(this.x, this.y, this.width, this.height, 5);
        fill(0, 0, 0);
        textFont("sans-serif", 19);
        textAlign(CENTER, TOP);
        text(this.label, this.x+(this.width/2), this.y+this.height/4);
    };

    Button.prototype.isMouseInside = function() {
        return mouseX > this.x &&
            mouseX < (this.x + this.width) &&
            mouseY > this.y &&
            mouseY < (this.y + this.height);
    };

    //*********************************Buttons section
    var start = new Button({
            x: width/2 -100,
            y: height/2 -50,
            width: 200,
            label: "Start"

        }
    );

    var end = new Button({
            x: width - 100,
            y: 50,
            width: 50,
            label: "End"

        }
    );

    var correct = new Button({
        x: 150,
        y: height-80,
        label: "Got it!"
    });


    var wrong = new Button({
        x: width -180-150,
        y: height-80,
        label: "Needs Work"
    });

    fill(140, 227, 118);
    start.draw();
    //*********************************Button Logic
    mouseClicked = function() {
        if (correct.isMouseInside()) {
            currentCard.rightCount++;
            console.log("In a row count before: " + currentCard.frontSide + " " + currentCard.inARow);
            currentCard.inARow++;
            currentCard.rightThisSession++;
            if (currentCard.inARow >= 3 || currentCard.rightThisSession >= 4){
                console.log("In a row count: " + currentCard.frontSide + " " + currentCard.inARow);
                console.log("Right this session: " + currentCard.frontSide + " " + currentCard.rightThisSession);
                if (currentCard.rightCount > currentCard.wrongCount || currentCard.inARow >+ 5) {
                    currentCard.level++;

                    switch (currentCard.level) {
                        case 5:
                            level5Words++;
                            break;
                        case 4:
                            level4Words++;
                            break;
                        case 3:
                            level3Words++;
                            break;
                        case 2:
                            level2Words++;
                            break;
                        default:
                            break;
                    }
                }
                working.splice(index,1);
            }
            loadDoc("correct", true);
            //println(working);
            run();

        }
        if (wrong.isMouseInside()) {
            currentCard.wrongCount++;
            currentCard.inARow = 0;
            if (currentCard.level >= 4) {
                currentCard.level = 2;
            }else if (currentCard.level > 1) {
                currentCard.level--;
            }
            console.log("WrongCount of card: " + currentCard.frontSide + " is " + currentCard.wrongCount);
            loadDoc("wrong", true);
            run();
        }

        if (start.isMouseInside()) {
            console.log("Pressed Start");
            loadDoc("start", false);
            run();
        }

        if (end.isMouseInside()) {
            console.log("Pressed End");
            loadDoc("end", true);
        }
    };
    //***************************
    //ProgressBars
    var progressBar = function() {
        var incrementSize = width/originalLength;
        var multiplier = originalLength - working.length;
        noStroke();
        fill(199,244,100);
        rect(0,height,incrementSize * multiplier, -15);
    };
    var level2Bar = function() {
        var incrementSize = height/wordsFromDb.length;
        noStroke();
        fill(85,98,112);
        rect(0,height, 20, -(incrementSize * (level2Words + level3Words + level4Words + level5Words)));
        textAlign(CENTER, CENTER);
        fill(255,255,255);
        text("2", 10, height - 10);
    }
    var level3Bar = function() {
        var incrementSize = height/wordsFromDb.length;
        noStroke();
        fill(78,205,196);
        rect(20,height, 20, -(incrementSize * (level3Words + level4Words + level5Words)));
        textAlign(CENTER, CENTER);
        fill(255,255,255);
        text("3", 30, height - 10);

    }
    var level4Bar = function() {
        var incrementSize = height/wordsFromDb.length;
        noStroke();
        fill(255,107,107);
        rect(40,height, 20, -(incrementSize * (level4Words + level5Words)));
        textAlign(CENTER, CENTER);
        fill(255,255,255);
        text("4", 50, height - 10);

    }
    var level5Bar = function() {
        var incrementSize = height/wordsFromDb.length;
        noStroke();
        fill(196,77,88);
        rect(60,height, 20, (incrementSize * level5Words));
        textAlign(CENTER, CENTER);
        fill(255,255,255);
        text("5", 70, height - 10);
    }
//*********************************
// Main logic: if just starting use words[], if finished, use struggling[], when struggling.length = 0 Congrats!

    var run = function() {
        background(220,220,220);
        fill(240,240,240,150);
        rect(0,0,width,height);
        fill(237, 50, 114);
        var fonts = ["sans-serif", "serif", "monospace", "fantasy", "cursive"];
        textFont(fonts[floor(random(fonts.length))], random(150, 200));
        index = floor(random(working.length));
        currentCard = working[index];
        textAlign(CENTER, CENTER);
        if (working.length !== 0) {
            currentCard.seenThisSession++;
            currentCard.shownCount++;
            console.log("seenThisSession count :" + currentCard.frontSide + " is " + currentCard.seenThisSession);
            console.log("ShownCount of card: " + currentCard.frontSide + " is " + currentCard.shownCount);
            console.log("RightCount of card: " + currentCard.frontSide + " is " + currentCard.rightCount);
            console.log("WrongCount of card: " + currentCard.frontSide + " is " + currentCard.wrongCount);


            text(currentCard.frontSide, width/2, height/2 - 25);

        } else {
            text("Finished!", width/2, height/2 - 25);
        }
        fill(255, 61, 61);
        wrong.draw();
        /*fill(255, 61, 61);
         end.draw();*/
        fill(140, 227, 118);
        correct.draw();
        progressBar();
        level2Bar();
        level3Bar();
        level4Bar();
        level5Bar();

    };
}


