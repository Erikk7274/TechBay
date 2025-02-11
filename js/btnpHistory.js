const btnBack = document.querySelector('.btnBack');

if (btnBack) {
    btnBack.addEventListener('click', () => {
        window.location.href = 'https://nodejs312.dszcbaross.edu.hu/profile.html'; // Vissza a profil oldalra
    });
}

if (btnEditPfp) {
    btnEditPfp.addEventListener('click', () => {
        window.location.href = 'https://nodejs312.dszcbaross.edu.hu/profilePic.html'; // Profilkép szerkesztése
    });
}

if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        window.location.href = 'https://nodejs312.dszcbaross.edu.hu/index.html'; // Kilépés és vissza az index oldalra
    });
}



if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        window.location.href = 'https://nodejs312.dszcbaross.edu.hu/index.html'; // Kilépés és vissza az index oldalra
    });
}
