/**
 * Created by allanjohnson on 10/27/15.
 */
var index;
var working = [];
var originalLength;
//*******************************This is the HTTP request
function loadDoc(button, async) {
    var xhttp = new XMLHttpRequest();
    var jsonString;
    switch (button) {
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
    var words = JSON.parse(json);
    console.log(words);
    for (var i in words) {
        function addCard() {
            words[i] = new Card({
                id: words[i].id,
                frontSide: words[i].front,
                backSide: words[i].back,
                shownCount: words[i].shownCount,
                rightCount: words[i].rightCount,
                wrongCount: words[i].wrongCount,
                inARow: words[i].inARow,
                level: words[i].level
            });
            working.push(words[i]);
            console.log(working[i]);
        }
        if (working.length < 1 && words[i].level == 4) {
            addCard();
        } else if (working.length < 4 && words[i].level == 3){
            addCard();
        } else if (working.length < 10 && words[i].level == 2){
            addCard();
        } else if (working.length < 15 && words[i].level == 1) {
            addCard();
        }
    }
    originalLength = working.length;
}
var currentCard;

function setup() {
    var cvs = document.getElementById("mainCanvas");
    resizeCanvas(800,400);
    background(211, 252, 252);

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
    //ProgressBar
    var progressBar = function() {
        var incrementSize = width/originalLength;
        var multiplier = originalLength - working.length;
        var colorIncrement = 205/originalLength;
        var colorAmount = colorIncrement * multiplier;
        noStroke();
        fill(255 - colorAmount, colorAmount, 0);
        rect(0,0,incrementSize * multiplier, 15);
    };
//*********************************
// Main logic: if just starting use words[], if finished, use struggling[], when struggling.length = 0 Congrats!

    var run = function() {
        background(135,237,228);
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
    };
}


