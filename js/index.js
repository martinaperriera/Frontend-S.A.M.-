/*typewriter*/
const staticText = "smart management system:";
const dynamicWords = ["innovativo", "affidabile", "intuitivo"];
const typingSpeed = 100;
const pauseTime = 1000;
let staticIndex = 0;
let dynamicIndex = 0;
let letterIndex = 0;
let isDeleting = false;

const staticTextElement = document.getElementById("staticText");
const dynamicTextElement = document.getElementById("dynamicText");
const caretElement = document.querySelector(".caret");

// Inizializza dynamicTextElement con una stringa vuota
dynamicTextElement.textContent = "";

function typeStaticText() {
    if (staticIndex < staticText.length) {
        staticTextElement.textContent += staticText.charAt(staticIndex);
        staticIndex++;
        setTimeout(typeStaticText, typingSpeed);
    } else {
        setTimeout(typeDynamicText, pauseTime); // Attendi una pausa prima di iniziare a digitare il testo dinamico
    }
}

function typeDynamicText() {
    const currentWord = dynamicWords[dynamicIndex];
    if (!isDeleting) {
        dynamicTextElement.textContent = currentWord.slice(0, letterIndex);
        letterIndex++;
        if (letterIndex > currentWord.length) {
            isDeleting = true;
            setTimeout(typeDynamicText, pauseTime);
            return;
        }
    } else {
        dynamicTextElement.textContent = currentWord.slice(0, letterIndex);
        letterIndex--;
        if (letterIndex < 0) {
            isDeleting = false;
            dynamicIndex = (dynamicIndex + 1) % dynamicWords.length;
            letterIndex = 0; // Reimposta l'indice delle lettere per la nuova parola
            setTimeout(typeDynamicText, typingSpeed);
            return;
        }
    }
    setTimeout(typeDynamicText, typingSpeed);
}

document.addEventListener("DOMContentLoaded", () => {
    typeStaticText();
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