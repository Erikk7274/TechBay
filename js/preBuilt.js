// Gombok és modal elemek deklarálása
const gombok = {
    vissza: document.querySelector('.btnBack'),
    modaltMutat: document.querySelector('.fixed'), // Plusz ikon, ami megnyitja a modalt
    modal: document.getElementById('myModal'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    closeModalBtnFooter: document.getElementById('closeModalBtnFooter')
};

// DOM betöltődés eseménykezelője
window.addEventListener('DOMContentLoaded', () => {
    gombokBeallitas();
});

// Gomb eseménykezelők beállítása
function gombokBeallitas() {
    // Vissza gomb, ami visszairányít
    if (gombok.vissza) {
        gombok.vissza.addEventListener('click', () => {
            window.location.href = 'https://erikk7274.github.io/TechBay/home.html';
        });
    }

    // Modal megjelenítése a .fixed elemre kattintáskor
    if (gombok.modaltMutat) {
        gombok.modaltMutat.addEventListener('click', () => {
            gombok.modal.style.display = 'block'; // A modal megjelenítése
        });
    }

    // Modal bezárása a modal bezáró gombjára kattintva
    if (gombok.closeModalBtn || gombok.closeModalBtnFooter) {
        const closeModal = () => {
            gombok.modal.style.display = 'none'; // Modal elrejtése
        };

        gombok.closeModalBtn.addEventListener('click', closeModal);
        gombok.closeModalBtnFooter.addEventListener('click', closeModal);
    }
}
