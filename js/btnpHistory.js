const btnBack = document.querySelector('.btnBack');

if (btnBack) {
    btnBack.addEventListener('click', () => {
        window.location.href = 'https://techbay2.netlify.app/profile.html'; // Vissza a profil oldalra
    });
}

if (btnEditPfp) {
    btnEditPfp.addEventListener('click', () => {
        window.location.href = 'https://techbay2.netlify.app/profilePic.html'; // Profilkép szerkesztése
    });
}

if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        window.location.href = 'https://techbay2.netlify.app/index.html'; // Kilépés és vissza az indexre
    });
}




if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        window.location.href = 'https://techbay2.netlify.app/index.html'; // Kilépés és vissza az index oldalra
    });
}
