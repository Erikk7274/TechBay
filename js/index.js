const btnLogin = document.getElementsByClassName('login')[0];
const btnReg = document.getElementsByClassName('reg')[0];

btnLogin.addEventListener('click', () => {
    window.location.href = 'https://techbay2.netlify.app/login.html';
});

btnReg.addEventListener('click', () => {
    window.location.href = 'https://techbay2.netlify.app/registration.html';
});
