document.addEventListener("DOMContentLoaded", () => {
    const display = document.getElementById("display");
    const buttons = document.querySelectorAll(".btn");

    // Function to update the display
    function updateDisplay(value) {
        if (value === "C") {
            display.value = "";
        } else if (value === "=") {
            try {
                display.value = eval(display.value);
            } catch {
                display.value = "Error";
            }
        } else {
            display.value += value;
        }
    }

    // Click event for buttons
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            updateDisplay(button.textContent);
        });
    });

    // Keyboard support
    document.addEventListener("keydown", (event) => {
        const key = event.key;

        if (/[\d\+\-\*\/\.]/.test(key)) {
            // Allow numbers (0-9), operators (+ - * /), and dot (.)
            display.value += key;
        } else if (key === "Enter" || key === "=") {
            // Evaluate the expression
            updateDisplay("=");
        } else if (key === "Backspace") {
            // Remove the last character
            display.value = display.value.slice(0, -1);
        } else if (key.toLowerCase() === "c") {
            // Clear display
            updateDisplay("C");
        }
    });
});
