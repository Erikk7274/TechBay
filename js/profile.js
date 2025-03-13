window.addEventListener('DOMContentLoaded', () => {
    // Check if the token exists before trying to load user data
    if (checkToken()) {
        console.log('Token found, attempting to load user data...');
        loadUserData();  // Proceed with loading user data
    } else {
        console.log('No token found, skipping data load...');
        // Optional: Redirect to login or show a message
        window.location.href = 'https://techbay2.netlify.app/login.html'; // Redirect to login if no token
    }
});

// Function to check if the token exists
function checkToken() {
    // Retrieve token from localStorage or sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log('Token:', token); // Debug: log token to check if it exists
    return token && token !== '';  // Return true if token exists
}

async function loadUserData() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    console.log('Token being sent in the request:', token); // Debug: Log token being used in the request

    // Only proceed with fetching user data if there's a valid token
    const res = await fetch('/api/profile/Myusername', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${token}` // Include token in request header
        }
    });

    if (!res.ok) {
        console.error('Error fetching user data:', res.statusText);
        alert('Error: Unable to fetch user data');
        return;
    }

    const username = await res.json();
    console.log('User data received:', username);

    if (username[0].profile_pic) {
        document.querySelector('.profile_pic').src = `/api/uploads/${username[0].profile_pic}`;
    } else {
        document.querySelector('.profile_pic').src = './img/logo.png';
    }

    updateProfileData(username);
}

// Update the profile data displayed
function updateProfileData(users) {
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

    users.forEach(user => {
        username.textContent = user.fullname;
        fullname.value = user.fullname;
        postcode.value = user.postcode;
        city.value = user.city;
        street.value = user.street;  
    });
}

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

// Logout Function
async function logout() {
    const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
    });

    if (res.ok) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        alert('Successfully logged out');
        window.location.href = '../index.html'; // Redirect to home or login page after logout
    } else {
        alert('Error during logout');
    }
}

// Function to reset profile fields after editing
function resetInputs() {
    document.getElementById('postal-code').value = '';
    document.getElementById('city').value = '';
    document.getElementById('street').value = '';
    document.getElementById('fullname').value = '';
}

window.addEventListener('click', (event) => {
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.querySelector('nav');
    const hamburgerButton = document.querySelector('.hamburger-menu');

    if (!hamburgerButton.contains(event.target) && !menu.contains(event.target) && !menuToggle.contains(event.target)) {
        menuToggle.checked = false; 
    }
});
