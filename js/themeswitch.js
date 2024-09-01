document.addEventListener('DOMContentLoaded', function() {
    const bodyElement = document.body;
    const toggleSwitch = document.querySelector('#checkbox');

    // Controlla il tema corrente dal localStorage
    const currentTheme = localStorage.getItem('theme');
    const currentMode = localStorage.getItem('mode');

    // Applicare la modalità salvata
    if (currentMode === 'manager-mode') {
        bodyElement.classList.add('manager-mode');
    } else {
        bodyElement.classList.add('user-mode');
    }

    // Applicare il tema salvato
    if (currentTheme === 'dark-mode') {
        bodyElement.classList.add('dark-mode');
        toggleSwitch.checked = true;
    } else {
        bodyElement.classList.remove('dark-mode');
        toggleSwitch.checked = false;
    }

    // Event listener per il toggle della modalità scura
    toggleSwitch.addEventListener('change', function() {
        if (toggleSwitch.checked) {
            bodyElement.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        } else {
            bodyElement.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light-mode');
        }
    });

    // Eventuale funzione per cambiare la modalità tra manager e user
    function switchMode(mode) {
        if (mode === 'manager-mode') {
            bodyElement.classList.remove('user-mode');
            bodyElement.classList.add('manager-mode');
            localStorage.setItem('mode', 'manager-mode');
        } else if (mode === 'user-mode') {
            bodyElement.classList.remove('manager-mode');
            bodyElement.classList.add('user-mode');
            localStorage.setItem('mode', 'user-mode');
        }
    }

    // Esempio di utilizzo:
    // switchMode('manager-mode'); // Per impostare la modalità manager
    // switchMode('user-mode'); // Per impostare la modalità user
});
