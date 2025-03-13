window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (token) {
        getusername(); // Fetch username and profile data if token exists
    } else {
        // If no token is found, set the profile picture to the default and hide the profile section
        document.querySelector('.profile_pic').src = './img/logo.png';

        // Check if the profile-info exists before hiding it (you can adjust this class)
        const profileInfo = document.querySelector('.profile-info');
        if (profileInfo) {
            profileInfo.style.display = 'none'; // Hide profile information if not logged in
        }
    }
});

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

// Event listeners for navigation buttons
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
};

// Logout function
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

// Fetch and display user profile data
async function getusername() {
    const res = await fetch('/api/profile/Myusername', {
        method: 'GET',
        credentials: 'include'
    });

    if (res.ok) {
        const username = await res.json();
        profileData(username);

        // Set profile picture if available
        if (username[0].profile_pic) {
            const editPic = document.querySelector('.profile_pic');
            editPic.src = `/api/uploads/${username[0].profile_pic}`;
        } else {
            document.querySelector('.profile_pic').src = './img/logo.png';
        }
    } else {
        console.log('Failed to fetch username');
    }
}

// Display user data in profile section
function profileData(users) {
    const username = document.getElementById('username');
    const fullname = document.getElementById('fullname');
    const postcode = document.getElementById('postal-code');
    const city = document.getElementById('city');
    const street = document.getElementById('street');

    // Clear existing values
    username.innerHTML = '';
    fullname.value = '';
    postcode.value = '';
    city.value = '';
    street.value = '';

    // Populate user data
    for (const user of users) {
        username.textContent = user.fullname;
        fullname.value = user.fullname;
        postcode.value = user.postcode;
        city.value = user.city;
        street.value = user.street;
    }
}

// Edit profile data
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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postcode, city, street, fullname }),
            credentials: 'include'
        });
        const data = await res.json();
        if (res.ok) {
            resetInputs();
            alert(data.message);
            window.location.href = 'https://techbay2.netlify.app/profile.html';
        } else {
            alert(data.errors ? data.errors.map(err => err.error).join('\n') : 'Ismeretlen hiba');
        }
    }
}

// Reset profile input fields
function resetInputs() {
    document.getElementById('postal-code').value = '';
    document.getElementById('city').value = '';
    document.getElementById('street').value = '';
    document.getElementById('fullname').value = '';
}

// Handle menu toggle for mobile view
window.addEventListener('click', function (event) {
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.querySelector('nav');
    const hamburgerButton = document.querySelector('.hamburger-menu');

    if (!hamburgerButton.contains(event.target) && !menu.contains(event.target) && !menuToggle.contains(event.target)) {
        menuToggle.checked = false;
    }
});
