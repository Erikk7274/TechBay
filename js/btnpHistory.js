const btnBack = document.querySelector('.btnBack');

if (btnBack) {
    btnBack.addEventListener('click', () => {
        window.location.href = 'https://erikk7274.github.io/TechBay/profile.html'; // Vissza a profil oldalra
    });
}

if (btnEditPfp) {
    btnEditPfp.addEventListener('click', () => {
        window.location.href = 'https://erikk7274.github.io/TechBay/profilePic.html'; // Profilkép szerkesztése
    });
}

if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        window.location.href = 'https://erikk7274.github.io/TechBay/index.html'; // Kilépés és vissza az index oldalra
    });
}



if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        window.location.href = 'https://erikk7274.github.io/TechBay/index.html'; // Kilépés és vissza az index oldalra
    });
}
