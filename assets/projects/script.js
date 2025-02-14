document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".project-card").forEach(el => {
        el.style.animationDelay = Math.random() * 0.5 + "s";
    });
});
