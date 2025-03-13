window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    console.log("Token from storage: ", token);  // Check token in storage

    if (!token) {
        console.log("No token found, redirecting to login...");  // Debugging line
        window.location.href = '../login.html';  // Redirect if no token
    } else {
        await getusername(token);  // Pass token to get username
    }
});

async function getusername(token) {
    console.log("Token in getusername function: ", token);  // Check if token is passed correctly

    if (!token) {
        console.log("No token found in getusername, redirecting to login...");
        window.location.href = '../login.html';
        return;
    }

    const res = await fetch('/api/profile/Myusername', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`  // Send token in request header for authentication
        },
        credentials: 'include'
    });

    console.log("Response status from Myusername API:", res.status);  // Log the response status

    if (!res.ok) {
        console.log("API request failed, redirecting to login...");  // Log if the API request failed
        window.location.href = '../login.html';  // Redirect if API call fails
        return;
    }

    const username = await res.json();
    console.log("User data received: ", username);  // Log user data received from the API

    profileData(username);

    if (username[0] && username[0].profile_pic) {
        const editPic = document.querySelector('.profile_pic');
        editPic.src = `/api/uploads/${username[0].profile_pic}`;
    } else {
        document.querySelector('.profile_pic').src = './img/logo.png';
    }
}

function profileData(users) {
    const username = document.getElementById('username');
    const fullname = document.getElementById('fullname');
    const postcode = document.getElementById('postal-code');
    const city = document.getElementById('city');
    const street = document.getElementById('street');

    username.innerHTML = '';
    fullname.value = '';
    postcode.value = '';
    city.value = '';
    street.value = '';

    if (users.length > 0) {
        const user = users[0];
        username.textContent = user.fullname;
        fullname.value = user.fullname;
        postcode.value = user.postcode;
        city.value = user.city;
        street.value = user.street;
    }
}

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

btnLogout.addEventListener('click', logout);

homeBtn.addEventListener('click', () => {
    window.location.href = 'https://techbay2.netlify.app/home.html';
});

userBtn.addEventListener('click', () => {
    window.location.href = 'https://techbay2.netlify.app/profile.html';
});

cartBtn.addEventListener('click', () => {
    window.location.href = 'https://techbay2.netlify.app/cart.html';
});

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

    if (!postcode || !city || !street || !fullname) {
        alert("Minden mezőt ki kell tölteni");
    } else {
        const res = await fetch('/api/profile/editData', {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ postcode, city, street, fullname }),
            credentials: 'include'
        });

        const data = await res.json();

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
