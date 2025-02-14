const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");

let currentInput = "";
let operator = null;
let firstOperand = null;
let waitingForSecondOperand = false;

// Handle button clicks
buttons.forEach((button) => {
  button.addEventListener("click", () => handleInput(button.dataset.value));
});

// Handle keyboard input
document.addEventListener("keydown", (event) => {
  const key = event.key;
  if (
    (key >= "0" && key <= "9") ||
    key === "." ||
    key === "+" ||
    key === "-" ||
    key === "*" ||
    key === "/" ||
    key === "Enter" ||
    key === "Backspace" ||
    key === "Escape"
  ) {
    event.preventDefault();
    if (key === "Enter") {
      handleInput("=");
    } else if (key === "Backspace") {
      handleInput("C");
    } else if (key === "Escape") {
      handleInput("C");
    } else {
      handleInput(key);
    }
  }
});

function handleInput(value) {
  if (value === "C") {
    // Clear everything
    currentInput = "";
    operator = null;
    firstOperand = null;
    waitingForSecondOperand = false;
    display.value = "";
  } else if (value === "=") {
    // Perform calculation
    if (operator && firstOperand !== null && currentInput !== "") {
      const result = calculate(firstOperand, parseFloat(currentInput), operator);
      display.value = result;
      currentInput = result.toString();
      operator = null;
      firstOperand = null;
      waitingForSecondOperand = false;
    }
  } else if (["+", "-", "*", "/"].includes(value)) {
    // Handle operators
    if (currentInput !== "") {
      if (firstOperand === null) {
        firstOperand = parseFloat(currentInput);
      } else if (operator) {
        firstOperand = calculate(firstOperand, parseFloat(currentInput), operator);
      }
      operator = value;
      waitingForSecondOperand = true;
      currentInput = "";
    }
  } else {
    // Handle numbers and decimal point
    if (waitingForSecondOperand) {
      currentInput = value;
      waitingForSecondOperand = false;
    } else {
      currentInput += value;
    }
    display.value = currentInput;
  }
}

function calculate(num1, num2, operator) {
  switch (operator) {
    case "+":
      return num1 + num2;
    case "-":
      return num1 - num2;
    case "*":
      return num1 * num2;
    case "/":
      return num1 / num2;
    default:
      return num2;
  }
}