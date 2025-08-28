let prevNum = "";
let currNum = "";
let operator = "";
let total = 0;
let inputValue = "";
let calcHistory = JSON.parse(localStorage.getItem("calcHistory")) || [];
let tempCurr = 0;

function getNumbers(num) {

    if (!currNum.includes(".")) {
        currNum += num
    } else if (num !== ".") {
        currNum += num
    }
    if (operator == "%") {
        document.getElementById('input').value = `${currNum}`
        operator = "";
        prevNum = currNum;
        currNum = ""
    } else {
        document.getElementById('input').value = `${prevNum} ${operator} ${currNum}`
    }

    inputValue = document.getElementById('input').value
    console.log("inputValue: " + inputValue);

}

function getOperator(op) {
    // debugger
    operator = op;
    if (inputValue.includes('+', '-', '*', '/') && operator == "%") {
        doPercentageCalculation()
    } else if (operator == "%") {
        if (currNum != "") {
            prevNum = currNum
            currNum = "";
        }
        console.log(prevNum);
        doCalculation()
        return;
    } else {

        if (prevNum !== "" && currNum === "") {
            document.getElementById('input').value = `${prevNum} ${operator}`
            return;
        } else if (prevNum !== "" && currNum != "") {
            doCalculation()
        }
        if (total == 0) {
            prevNum = currNum
        }
        currNum = "";
        
        document.getElementById('input').value = `${prevNum} ${operator}`
        inputValue = document.getElementById('input').value

    }
}

function doCalculation() {
    // debugger
    let parsedPrev = parseFloat(prevNum);
    let parsedCurr = parseFloat(currNum)
    if (isNaN(parsedPrev)) {
        parsedPrev = 0
    }
    if (isNaN(parsedCurr)) {
        if (inputValue == `${parsedPrev} +` || inputValue == `${parsedPrev} -` || inputValue == `${parsedPrev} *` || inputValue == `${parsedPrev} /` || inputValue == `${parsedPrev} %`) {
            tempCurr = parsedPrev
        }
        parsedCurr = tempCurr
    }

    switch (operator) {
        case "+":
            total = parsedPrev + parsedCurr
            break;
        case "-":
            total = parsedPrev - parsedCurr
            break;
        case "/":
            total = parsedPrev / parsedCurr
            break;
        case "*":
            total = parsedPrev * parsedCurr
            break;
        case "%":
            if (parsedPrev) {
                total = parsedPrev / 100
            }
            break;
        default:
            total = currNum;
    }
    if (prevNum === "" && currNum === "") {
        calcHistory.push(`0 =`)
    } else if (operator == "%") {
        calcHistory.push(`${parsedPrev} ${operator} = ${total}`)
    } else {
        calcHistory.push(`${parsedPrev} ${operator} ${parsedCurr} = ${total}`)
    }
    localStorage.setItem("calcHistory", JSON.stringify(calcHistory))
    document.getElementById('history').innerHTML = calcHistory.map((history) => `<div>${history}<div>`).join("")
    console.log(calcHistory)
    if (total == 0) {
        prevNum = ""
    } else {
        prevNum = total;
    }
    tempCurr = parsedCurr;
    currNum = "";
    inputValue = "";
    document.getElementById('input').value = total

}

function doPercentageCalculation() {

    let newInputValue = [...inputValue]
    let spaceOneIndex = newInputValue.indexOf(" ");
    let spacetwoIndex = newInputValue.lastIndexOf(" ");
    let parsedPrev = parseFloat(newInputValue.slice(0, spaceOneIndex).join(""))
    let parsedCurr = parseFloat(newInputValue.slice(spacetwoIndex + 1).join(""))
    let newOp = newInputValue.slice(spaceOneIndex + 1, newInputValue.lastIndexOf(" ")).toString();

    switch (newOp) {
        case "+":
            console.log("+ case")
            total = parsedPrev + (parsedCurr / 100 * parsedPrev)
            console.log(total)
            break;
        case "-":
            total = parsedPrev - (parsedCurr / 100 * parsedPrev)
            break;
        case "*":
            total = parsedPrev * (parsedCurr / 100)
            break;
        case "/":
            total = parsedPrev / (parsedCurr / 100)
            break;
        default:
            total = 0
    }

    calcHistory.push(`${inputValue}% = ${total}`)
    localStorage.setItem("calcHistory", calcHistory)
    document.getElementById('history').innerHTML = calcHistory.map((history) => `<div>${history}<div>`).join("")
    console.log(calcHistory);

    if (total == 0) {
        prevNum = ""
    } else {
        prevNum = total;
    }
    currNum = "";
    inputValue = "";
    document.getElementById('input').value = total    
}

function clearScreen() {
    document.getElementById('input').value = ""
    prevNum = "";
    currNum = "";
    operator = "";
    total = 0;
    tempCurr = 0;
}

function clearEntry() {
    if (document.getElementById('input').value == prevNum) {
        document.getElementById('input').value = ""
        prevNum = 0
    } else {
        document.getElementById('input').value = `${prevNum} ${operator}`
        currNum = "";
    }
}

function removeDigit() {
    let input = currNum;
    document.getElementById('input').value = input.slice(0, -1);
    currNum = document.getElementById('input').value
    document.getElementById('input').value = `${prevNum} ${operator} ${currNum}`
}

function clearHistory() {
    localStorage.clear()
    calcHistory = []
    document.getElementById('history').innerHTML = ""
}
