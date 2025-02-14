document.addEventListener("DOMContentLoaded", () => {
    const playerHand = document.querySelector(".player-hand");
    const computerHand = document.querySelector(".computer-hand");
    const choices = document.querySelectorAll(".choice");
    const resultText = document.querySelector(".result-text");

    const hands = {
        rock: "✊🏻",
        paper: "🤚🏻",
        scissors: "✌🏻"
    };

    choices.forEach(choice => {
        choice.addEventListener("click", () => {
            let playerChoice = choice.dataset.choice;
            let computerChoice = getComputerChoice();

            // Set both hands back to '?' before shaking
            playerHand.textContent = "❔";
            computerHand.textContent = "❔";

            // Add shaking animation
            playerHand.classList.add("shaking");
            computerHand.classList.add("shaking");

            setTimeout(() => {
                // Remove animation
                playerHand.classList.remove("shaking");
                computerHand.classList.remove("shaking");

                // Update hands with chosen values
                playerHand.textContent = hands[playerChoice];
                computerHand.textContent = hands[computerChoice];

                // Determine the winner
                let result = getResult(playerChoice, computerChoice);
                resultText.textContent = result;
            }, 500);
        });
    });

    function getComputerChoice() {
        const choices = ["rock", "paper", "scissors"];
        return choices[Math.floor(Math.random() * choices.length)];
    }

    function getResult(player, computer) {
        if (player === computer) {
            return "It's a draw!";
        } else if (
            (player === "rock" && computer === "scissors") ||
            (player === "paper" && computer === "rock") ||
            (player === "scissors" && computer === "paper")
        ) {
            return "You Win! 🎉";
        } else {
            return "You Lose! 😢";
        }
    }
});
