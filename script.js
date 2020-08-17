let add = function(a,b) {
    return a+b;
}

let subtract = function(a,b) {
    return a-b;
}

let multiply = function(a,b) {
    return a*b;
}

let divide = function(a,b) {
    return a/b;
}

let operate = function(operator, a, b) {
    return operator(a,b);
}

//Digits
let digits = document.querySelectorAll(".digit");
digits.forEach(digit => {
    digit.addEventListener("click", populateInput);
});

//Decimal Point
let decimal = document.getElementById("decimal");
decimal.addEventListener("click", decimalCheck);

// Checking for only one decimal point per number
function decimalCheck(e) {    
    let numbers = inputValue.split(/[-+×÷]/);
    let lastNumber = numbers.pop();
    //console.log(lastNumber);
    if(lastNumber.indexOf('.') == -1) populateInput(e);
}

//Operators
let operators = document.querySelectorAll(".operator");
operators.forEach(operator => {
    operator.addEventListener("click", populateInput);
});

let functions = {
    '+': add,
    '-': subtract,
    '×': multiply,
    '÷': divide,
}

// /\D/.test("...".substr(-1));   32.3-1  10700/6

// Screen input panel
let input = document.getElementById("input");
let inputValue = "";
function populateInput(e) {
    console.log(typeof(e));
    console.log(e);
    //Rejects every first character that's not a number
    if (!inputValue && e.target.className !== "digit") return;
    
    //Clears output panel
    output.textContent = ""; 
    
    // Checking for consecutive operators/decimal points
    //console.log(e.target);
    if (/\D/.test(inputValue.slice(-1)) && (e.target.className == "operator" || e.target.id == "decimal")) {
        // console.log("coronamos");
        return;
    }

    //Making sure not to include the backspace character or the "ans" string
    if (e.target.id !== "backspace" && e.target.id !== "ans") inputValue += e.target.textContent;
    input.textContent = inputValue;
    //console.log(inputValue);

}

//Equal sign and event
let equal = document.getElementById("equal");
equal.addEventListener("click", populateOutput);

//Screen output panel
let output = document.querySelector("#output");

function populateOutput(e) {
    if (/\D/.test(inputValue.slice(-1)) || !inputValue) return; //Last character(if any) must be a number before pressing equal
    output.textContent = pemdas(inputValue);
}

function leftToRight(subFormula) {
    // let numbers = inputValue.replace(/[^\d]/g, " ").split(" ");
    let numbers = subFormula.split(/[^\d.]/g).map(Number);
    console.log(numbers);
    let operaciones = subFormula.replace(/[\d.]/g, '').split('');
    console.log(operaciones);
    operaciones.unshift('+'); //The following reduce method will always SUM(+) 0 to the first number
    let result = numbers.reduce((acc, current, idx) => {
        return operate(functions[operaciones[idx]], acc, current);
    }, 0);
    return result;
}

function pemdas(inputValue) {                          //"3×2÷6+4÷2×3-1×1" inputValue example.
    const plusAndMinus = /([-+])/g;

    let highPriority = inputValue.split(plusAndMinus); //["3×2÷6" ,"+" ,"4÷2×3" ,"-" ,"1×1"]  

    let highPResults = highPriority.map(formula => {
        if (formula == "+" || formula == "-") return formula;
        else return leftToRight(formula);
    });                                                //[ 1, "+", 6, "-", 1 ]
    
    let finalFormula = highPResults.join('');          //"1+6-1"
    let finalResult = leftToRight(finalFormula);       //6
    return finalResult;
}

//Backspace button and event
let backspace = document.getElementById("backspace");
backspace.addEventListener('click', deleteCharacter);

function deleteCharacter(e) {
    inputValue = inputValue.slice(0, -1);
    inputValue ? populateInput(e): input.textContent = ""; //If not empty populate it, otherwise replace directly.
}

//Clear button and event
let clearAll = document.getElementById("clear");
clearAll.addEventListener('click', clear);

function clear(e) {
    inputValue = "";
    input.textContent = "";
    output.textContent = "";
}

//ANS button and event
let ans = document.getElementById("ans");
ans.addEventListener('click', answer);

function answer(e) {
    if(!output.textContent) return; //There must be a displayed output to retrieve as an 'ans'
    inputValue = output.textContent;
    populateInput(e);
}


window.addEventListener('keydown', keyHandler);
function keyHandler(e) {
    //console.log(e);
    let digitTargets = document.getElementById(`${e.key}`);
    let operatorTargets = document.querySelector(`.operator[data-key="${e.key}"]`);
    let miscTargets = document.querySelector(`.misc[data-key="${e.key}"]`);
    let possibleTargets = [digitTargets, operatorTargets, miscTargets];
    let actualTarget = possibleTargets.find(option => option); //Checking for nullity
    
    if(!actualTarget) return; //Checking if an unsupported key was pressed (actualTarget == undefined)
    let eventObj = {target: actualTarget};

    if (eventObj.target.className !== "misc") {
        populateInput(eventObj);
    } else if (eventObj.target.id == "decimal") {
        decimalCheck(eventObj);
    } else if (eventObj.target.id == "ans") {
        answer(eventObj);
    } else if (eventObj.target.id == 'clear') {
        clear(eventObj);
    } else if (eventObj.target.id == "backspace") {
        deleteCharacter(eventObj); 
    } else populateOutput(eventObj) //last case: equal sign
}

