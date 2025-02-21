// Vissza gomb eseménykezelője
const backButton = document.querySelector('.btnBack');

if (backButton) {
    backButton.addEventListener('click', () => {
        window.location.href = 'https://erikk7274.github.io/TechBay/home.html';
    });
}

// Modal kezelése
const prebuiltModalButton = document.querySelector('.btn-primary');

// Gomb eseménykezelője, ami megnyitja a modalt
if (prebuiltModalButton) {
    prebuiltModalButton.addEventListener('click', () => {
        const prebuiltModal = new bootstrap.Modal(document.getElementById('prebuiltModal'));
        prebuiltModal.show();
    });
}
