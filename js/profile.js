window.addEventListener('DOMContentLoaded', () => {
    // Check if the token exists before attempting to load user data
    if (!checkToken()) {
        console.log('No token found, redirecting to login...');
        window.location.href = 'https://techbay2.netlify.app/login.html'; // Redirect to login if no token
    } else {
        loadUserData();  // Proceed with loading user data if token exists
    }
});

// Function to check if a token exists
function checkToken() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return token && token !== '';  // Returns true if token exists
}

// Function to load user data if token is present
async function loadUserData() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    try {
        const res = await fetch('/api/profile/Myusername', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Include token in request header
            }
        });

        if (res.status === 401) {
            // If token is invalid or expired, redirect to login page
            console.log('Unauthorized, redirecting to login...');
            window.location.href = 'https://techbay2.netlify.app/login.html'; // Redirect to login page
            return;
        }

        if (!res.ok) {
            console.error('Error fetching user data:', res.statusText);
            alert('Error: Unable to fetch user data');
            return;
        }

        const username = await res.json();
        console.log('User data received:', username);

        // Set the profile picture if available, else use a default
        if (username[0].profile_pic) {
            document.querySelector('.profile_pic').src = `/api/uploads/${username[0].profile_pic}`;
        } else {
            document.querySelector('.profile_pic').src = './img/logo.png';
        }

        updateProfileData(username);

    } catch (error) {
        console.error('Error loading user data:', error);
        alert('An error occurred while loading user data.');
    }
}

// Update the profile data on the page
function updateProfileData(users) {
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

    users.forEach(user => {
        username.textContent = user.fullname;
        fullname.value = user.fullname;
        postcode.value = user.postcode;
        city.value = user.city;
        street.value = user.street;  
    });
}

// Logout function
async function logout() {
    try {
        const res = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (res.ok) {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            alert('Successfully logged out');
            window.location.href = '../index.html';  // Redirect to homepage or login page
        } else {
            alert('Error during logout');
        }
    } catch (error) {
        console.error('Error logging out:', error);
        alert('An error occurred during logout.');
    }
}

// Add event listeners for navigation
const homeBtn = document.getElementsByClassName('icon-home')[0];
const userBtn = document.getElementsByClassName('icon-user')[0];
const cartBtn = document.getElementsByClassName('icon-cart')[0];
const btnpHistory = document.getElementsByClassName('btnpHistory')[0];
const btnEditPfp = document.getElementsByClassName('btnEditPfp')[0];
const btnSupport = document.getElementsByClassName('btnSupport')[0];
const btnBack = document.getElementsByClassName('btnBack')[0];

// Navigation actions (buttons)
homeBtn.addEventListener('click', () => window.location.href = 'https://techbay2.netlify.app/home.html');
userBtn.addEventListener('click', () => window.location.href = 'https://techbay2.netlify.app/profile.html');
cartBtn.addEventListener('click', () => window.location.href = 'https://techbay2.netlify.app/cart.html');

if (btnpHistory) {
    btnpHistory.addEventListener('click', () => window.location.href = 'https://techbay2.netlify.app/purchaseHistory.html');
}

if (btnBack) {
    btnBack.addEventListener('click', () => window.location.href = 'https://techbay2.netlify.app/home.html');
}

if (btnEditPfp) {
    btnEditPfp.addEventListener('click', () => window.location.href = 'https://techbay2.netlify.app/profilePic.html');
}

if (btnSupport) {
    btnSupport.addEventListener('click', () => window.location.href = 'https://techbay2.netlify.app/support.html');
}

// Handle click events for menu
window.addEventListener('click', function (event) {
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.querySelector('nav');
    const hamburgerButton = document.querySelector('.hamburger-menu');

    if (!hamburgerButton.contains(event.target) && !menu.contains(event.target) && !menuToggle.contains(event.target)) {
        menuToggle.checked = false;
    }
});

// Reset inputs function
function resetInputs() {
    document.getElementById('postal-code').value = '';
    document.getElementById('city').value = '';
    document.getElementById('street').value = '';
    document.getElementById('fullname').value = '';
}
