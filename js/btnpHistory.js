const btnBack = document.querySelector('.btnBack');

if (btnBack) {
    btnBack.addEventListener('click', () => {
        window.location.href = '../profile.html';
    });
}

if (btnEditPfp) {
    btnEditPfp.addEventListener('click', () => {
        window.location.href = '../profilePic.html';
    });
}

if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        window.location.href = '../index.html';
    });
}

if (btnSupport) {
    btnSupport.addEventListener('click', () => {
        window.location.href = '../support.html';
    });
}
if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        window.location.href = '../index.html';
    });
}