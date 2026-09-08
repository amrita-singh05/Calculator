const currentDisplay = document.getElementById("current");
const previousDisplay = document.getElementById("previous");

let currentNumber = "";
let previousNumber = "";
let operation = null;
let shouldResetScreen = false;


// -------------------------
// Number Input
// -------------------------

function appendNumber(number) {

    if (shouldResetScreen) {
        currentNumber = "";
        shouldResetScreen = false;
    }

    if (number === "." && currentNumber.includes(".")) {
        return;
    }

    if (number === "." && currentNumber === "") {
        currentNumber = "0.";
    } else {
        currentNumber += number;
    }

    updateDisplay();
}


// -------------------------
// Choose Operation
// -------------------------

function chooseOperation(selectedOperation) {

    if (currentNumber === "" && previousNumber === "") {
        return;
    }

    if (currentNumber === "" && previousNumber !== "") {
        operation = selectedOperation;
        return;
    }

    if (previousNumber !== "") {
        calculate();
    }

    operation = selectedOperation;

    previousNumber = currentNumber;
    currentNumber = "";

    updateDisplay();
}


// -------------------------
// Calculation
// -------------------------

function calculate() {

    const previous = parseFloat(previousNumber);
    const current = parseFloat(currentNumber);

    if (isNaN(previous) || isNaN(current)) {
        return;
    }

    let result;

    switch (operation) {

        case "+":
            result = previous + current;
            break;

        case "-":
            result = previous - current;
            break;

        case "×":
            result = previous * current;
            break;

        case "÷":

            if (current === 0) {
                currentNumber = "Error";
                previousNumber = "";
                operation = null;

                updateDisplay();

                return;
            }

            result = previous / current;
            break;

        case "%":
            result = previous % current;
            break;

        default:
            return;
    }

    currentNumber = Number(result.toFixed(10)).toString();

    previousNumber = "";

    operation = null;

    shouldResetScreen = true;

    updateDisplay();
}


// -------------------------
// Clear Calculator
// -------------------------

function clearCalculator() {

    currentNumber = "";
    previousNumber = "";
    operation = null;

    updateDisplay();
}


// -------------------------
// Delete Last Number
// -------------------------

function deleteNumber() {

    if (shouldResetScreen) {
        return;
    }

    currentNumber = currentNumber.slice(0, -1);

    updateDisplay();
}


// -------------------------
// Update Display
// -------------------------

function updateDisplay() {

    currentDisplay.textContent =
        currentNumber || "0";

    if (operation && previousNumber !== "") {

        previousDisplay.textContent =
            `${previousNumber} ${operation}`;

    } else {

        previousDisplay.textContent = "";
    }
}


// -------------------------
// Button Clicks
// -------------------------

document.querySelectorAll("[data-number]")
    .forEach(button => {

        button.addEventListener("click", () => {

            appendNumber(button.dataset.number);

        });

    });


document.querySelectorAll("[data-operation]")
    .forEach(button => {

        button.addEventListener("click", () => {

            chooseOperation(button.dataset.operation);

        });

    });


document.querySelector("[data-action='clear']")
    .addEventListener("click", clearCalculator);


document.querySelector("[data-action='delete']")
    .addEventListener("click", deleteNumber);


document.querySelector("[data-action='equals']")
    .addEventListener("click", () => {

        if (previousNumber !== "" && currentNumber !== "") {

            calculate();

        }

    });


// -------------------------
// Keyboard Support
// -------------------------

document.addEventListener("keydown", event => {

    const key = event.key;


    // Numbers

    if (
        (key >= "0" && key <= "9") ||
        key === "."
    ) {

        appendNumber(key);

        return;
    }


    // Operations

    if (key === "+") {

        chooseOperation("+");

        return;
    }

    if (key === "-") {

        chooseOperation("-");

        return;
    }

    if (key === "*") {

        chooseOperation("×");

        return;
    }

    if (key === "/") {

        event.preventDefault();

        chooseOperation("÷");

        return;
    }

    if (key === "%") {

        chooseOperation("%");

        return;
    }


    // Equal

    if (key === "Enter" || key === "=") {

        if (
            previousNumber !== "" &&
            currentNumber !== ""
        ) {

            calculate();

        }

        return;
    }


    // Delete

    if (key === "Backspace") {

        deleteNumber();

        return;
    }


    // Clear

    if (key === "Escape") {

        clearCalculator();

    }

});


// Initial display

updateDisplay();