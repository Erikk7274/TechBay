// Gombok deklarálása
const gombok = {
    vissza: document.querySelector('.btnBack'),
    modaltMutat: document.querySelector('.fixed') // Az elem, ami megnyitja a modalt
};

// Modal inicializálása
const modalElem = document.getElementById('myModal');
const modal = new bootstrap.Modal(modalElem, {
    keyboard: false // A modal csak a kiváltó esemény hatására nyílik meg
});

// DOM betöltődés eseménykezelője
window.addEventListener('DOMContentLoaded', () => {
    gombokBeallitas();
});

// Gomb eseménykezelők beállítása
function gombokBeallitas() {
    if (gombok.vissza) {
        gombok.vissza.addEventListener('click', () => {
            window.location.href = 'https://erikk7274.github.io/TechBay/home.html';
        });
    }

    if (gombok.modaltMutat) {
        gombok.modaltMutat.addEventListener('click', () => {
            modal.show(); // A modal megjelenítése, amikor a .fixed elemre kattintunk
        });
    }
}
