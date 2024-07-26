//typewriter
document.addEventListener('DOMContentLoaded', () => {
    const txt = 'smart advice management';
    const speed = 100;
    let i = 0;

    function typeWriter() {
        if (i < txt.length) {
            document.getElementById("typewriterText").innerHTML += txt.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }

    typeWriter();
});

//login
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const email = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const messageElement = document.getElementById('message');

        try {
            const response = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.status === 200) {
                const data = await response.json();
                const token = data.token;
                localStorage.setItem('authToken', token);
                messageElement.textContent = 'Login successful';
                messageElement.style.color = 'green';
                window.location.href = 'profilo.html'; // Redirect to profile page --- quale?
            } else {
                messageElement.textContent = 'Invalid credentials';
                messageElement.style.color = 'red';
            }
        } catch (error) {
            console.error('Error during login:', error);
            messageElement.textContent = 'Error during login';
            messageElement.style.color = 'red';
        }
    });

    document.getElementById('registerForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const email = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const name = document.getElementById('register-name').value;
        const lastName = document.getElementById('register-lastName').value;
        const messageElement = document.getElementById('message');

        try {
            const response = await fetch('http://localhost:8080/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, nomeCompleto: `${name} ${lastName}` })
            });

            if (response.status === 201) {
                messageElement.textContent = 'Registration successful';
                messageElement.style.color = 'green';
            } else {
                const errorData = await response.json();
                let errorMessage = 'Registration failed';
                if (Array.isArray(errorData)) {
                    errorMessage = errorData.map(error => error.defaultMessage).join(', ');
                } else if (typeof errorData === 'string') {
                    errorMessage = errorData;
                }
                messageElement.textContent = errorMessage;
                messageElement.style.color = 'red';
            }
        } catch (error) {
            console.error('Error during registration:', error);
            messageElement.textContent = 'Error during registration';
            messageElement.style.color = 'red';
        }
    });

    // Logout button 
    document.getElementById('logoutButton').addEventListener('click', async function(event) {
        event.preventDefault();
        const messageElement = document.getElementById('message');

        try {
            const response = await fetch('http://localhost:8080/api/users/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.ok) {
                localStorage.removeItem('authToken');
                messageElement.textContent = 'Logout successful';
                messageElement.style.color = 'green';
                window.location.href = 'login.html'; // Redirect to login page
            } else {
                messageElement.textContent = 'Logout failed';
                messageElement.style.color = 'red';
            }
        } catch (error) {
            console.error('Error during logout:', error);
            messageElement.textContent = 'Error during logout';
            messageElement.style.color = 'red';
        }
    });
});
