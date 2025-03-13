window.addEventListener('DOMContentLoaded', () => {
    if (checkToken()) {
        console.log('Token found, attempting to load user data...');
        loadUserData();
    } else {
        console.log('No token found, redirecting to login...');
        window.location.href = 'https://techbay2.netlify.app/login.html';
    }
});

function checkToken() {
    // Check if the token exists in localStorage or sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log('Token from localStorage/sessionStorage:', token); // Debug: Check token storage
    return token && token !== '';
}

async function loadUserData() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    console.log('Token being sent in the request:', token); // Debug: Log the token being sent

    const res = await fetch('/api/profile/Myusername', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${token}` // Ensure token is sent in Authorization header
        }
    });

    // Log the response details
    console.log('API response status:', res.status);
    console.log('Response headers:', res.headers);  // Log response headers for debugging
    const responseText = await res.text();
    console.log('Response text:', responseText); // Log the raw response text for debugging

    if (!res.ok) {
        console.error('Error fetching user data:', res.statusText);
        alert('Error: Unable to fetch user data');
        return;
    }

    const username = await res.json();
    console.log('User data received:', username); // Log received user data

    if (username[0].profile_pic) {
        document.querySelector('.profile_pic').src = `/api/uploads/${username[0].profile_pic}`;
    } else {
        document.querySelector('.profile_pic').src = './img/logo.png';
    }

    updateProfileData(username);
}

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

async function logout() {
    const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
    });

    if (res.ok) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        alert('Successfully logged out');
        window.location.href = '../index.html';
    } else {
        alert('Error during logout');
    }
}

async function editData() {
    const postcode = document.getElementById('postal-code').value;
    const city = document.getElementById('city').value;
    const street = document.getElementById('street').value;
    const fullname = document.getElementById('fullname').value;

    if (!postcode || !city || !street || !fullname) {
        alert("All fields are required");
    } else {
        const res = await fetch('/api/profile/editData', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postcode, city, street, fullname }),
            credentials: 'include'
        });

        const data = await res.json();

        if (res.ok) {
            resetInputs();
            alert(data.message);
            window.location.href = 'https://techbay2.netlify.app/profile.html';
        } else {
            alert(data.errors ? data.errors.map(error => error.error).join('\n') : data.error || 'Unknown error');
        }
    }
}

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
