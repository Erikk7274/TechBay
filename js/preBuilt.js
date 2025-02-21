// Gombok deklarálása
const buttons = {
    back: document.querySelector('.btnBack'),
};

// DOM betöltődés eseménykezelője
window.addEventListener('DOMContentLoaded', () => {
    setupButtonHandlers();
});

// Gomb eseménykezelők beállítása
function setupButtonHandlers() {
    if (buttons.back) {
        buttons.back.addEventListener('click', () => {
            window.location.href = 'https://erikk7274.github.io/TechBay/home.html';
        });
    }
}
