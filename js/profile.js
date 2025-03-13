window.addEventListener('DOMContentLoaded', getusername);

const saveBtn = document.getElementById('saveBtn');
saveBtn.addEventListener('click', editData);
const homeBtn = document.getElementsByClassName('icon-home')[0];
const userBtn = document.getElementsByClassName('icon-user')[0];
const cartBtn = document.getElementsByClassName('icon-cart')[0];


const btnpHistory = document.getElementsByClassName('btnpHistory')[0];
const btnEditPfp = document.getElementsByClassName('btnEditPfp')[0];
const btnLogout = document.getElementsByClassName('icon-logout')[0];
const btnSupport = document.getElementsByClassName('btnSupport')[0];
const btnBack = document.getElementsByClassName('btnBack')[0];

async function getusername() {
    const res = await fetch('/api/profile/Myusername', {
        method: 'GET',
        credentials: 'include'
    });
    const username = await res.json();
    console.log(username);
    profileData(username);

    if (res.ok && username[0].profile_pic) {
        const editPic = document.querySelector('.profile_pic');
        editPic.src = `/api/uploads/${username[0].profile_pic}`;
    } else {
        document.querySelector('.profile_pic').src = './img/logo.png';
    }


}

function profileData(users) {
    //const alapkep = './img/logo.png'; // Relatív elérési út
    const username = document.getElementById('username');
    const fullname = document.getElementById('fullname');
    const postcode = document.getElementById('postal-code');
    const city = document.getElementById('city');
    const street = document.getElementById('street');

    // Alapértékek tisztázása
    username.innerHTML = '';
    fullname.value = '';
    postcode.value = '';
    city.value = '';
    street.value = '';

    for (const user of users) {
        username.textContent = user.fullname;
        fullname.value = user.fullname;
        postcode.value = user.postcode;
        city.value = user.city;
        street.value = user.street;
    }



}




btnLogout.addEventListener('click', logout);

homeBtn.addEventListener('click', () => {
    window.location.href = 'https://techbay2.netlify.app/home.html';
})

userBtn.addEventListener('click', () => {
    window.location.href = 'https://techbay2.netlify.app/profile.html';
})

cartBtn.addEventListener('click', () => {
    window.location.href = 'https://techbay2.netlify.app/cart.html';
})

if (btnpHistory) {
    btnpHistory.addEventListener('click', () => {
        window.location.href = 'https://techbay2.netlify.app/purchaseHistory.html';
    });
}

if (btnBack) {
    btnBack.addEventListener('click', () => {
        window.location.href = 'https://techbay2.netlify.app/home.html';
    });
}

if (btnEditPfp) {
    btnEditPfp.addEventListener('click', () => {
        window.location.href = 'https://techbay2.netlify.app/profilePic.html';
    });
}



if (btnSupport) {
    btnSupport.addEventListener('click', () => {
        window.location.href = 'https://techbay2.netlify.app/support.html';
    });
}


// function toggleSearch() {
//     const searchMenu = document.getElementById('keresomenu');
//     searchMenu.classList.toggle('active');
// }

async function logout() {
    const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
    });
    if (res.ok) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        alert('Sikeres kijelentkezés');
        window.location.href = '../index.html';
    } else {
        alert('Hiba a kijelentkezéskor');
    }
}

async function editData() {
    const postcode = document.getElementById('postal-code').value;
    const city = document.getElementById('city').value;
    const street = document.getElementById('street').value;
    const fullname = document.getElementById('fullname').value;
    console.log(postcode, fullname, city, street);
    if (!postcode || !city || !street || !fullname) {
        alert("Minden mezőt ki kell tölteni")
    }
    else {
        const res = await fetch('/api/profile/editData', {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ postcode, city, street, fullname }),
            credentials: 'include'
        });
        const data = await res.json();
        console.log(data);

        if (res.ok) {
            resetInputs();
            alert(data.message);
            window.location.href = 'https://techbay2.netlify.app/profile.html';
        } else if (data.errors) {
            let errorMessage = '';
            for (let i = 0; i < data.errors.length; i++) {
                errorMessage += `${data.errors[i].error}\n`
            }
            alert(errorMessage);
        } else if (data.error) {
            alert(data.error);
        } else {
            alert('Ismeretlen hiba');
        }
    }

}

window.addEventListener('click', function (event) {
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.querySelector('nav');
    const hamburgerButton = document.querySelector('.hamburger-menu');


    if (!hamburgerButton.contains(event.target) && !menu.contains(event.target) && !menuToggle.contains(event.target)) {
        menuToggle.checked = false;
    }
});

function resetInputs() {
    document.getElementById('postal-code').value = '';
    document.getElementById('city').value = '';
    document.getElementById('street').value = '';
    document.getElementById('fullname').value = '';
}