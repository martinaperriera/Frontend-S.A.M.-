document.addEventListener('DOMContentLoaded', function() {
    // Funzione per recuperare nome e cognome
    function loadUserName() {
        const token = localStorage.getItem('token');
        console.log('Token retrieved:', token); // Verifica se il token è recuperato correttamente

        if (token) {
            fetch('http://localhost:8080/api/users/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token // Usa il token recuperato
                },
            })
            .then(response => {
                console.log('Response status:', response.status); // Verifica lo stato della risposta
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('User data:', data); // Verifica i dati ricevuti
                document.getElementById('fullName').textContent = data.nomeCompleto;
            })
            .catch(error => console.error('Error fetching user data:', error));
        } else {
            console.error('Token not found. Please login again.');
        }
    }

    // Funzione per il logout
    function setupLogout() {
        document.getElementById('logoutButton').addEventListener('click', async function(event) {
            event.preventDefault(); 
            console.log('Logout button clicked'); 

            const token = localStorage.getItem('token');
            console.log('Token retrieved:', token); // Log per verificare il token

            const messageElement = document.getElementById('message');

            if (!token) {
                messageElement.textContent = 'No token found';
                messageElement.style.color = 'red';
                console.log('No token found');
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': `${token}`
                    }
                });

                console.log('Logout request sent'); // Log per verificare l'invio della richiesta

                if (response.ok) {
                    localStorage.removeItem('token');
                    messageElement.textContent = 'Logout successful';
                    messageElement.style.color = 'green';
                    console.log('Logout successful');
                    setTimeout(() => {
                        window.location.href = 'index.html'; 
                    }, 1000);
                } else {
                    const errorMessage = await response.text();
                    messageElement.textContent = `Logout failed: ${errorMessage}`;
                    messageElement.style.color = 'red';
                    console.log('Logout failed:', errorMessage);
                }
            } catch (error) {
                console.error('Error during logout:', error);
                messageElement.textContent = 'Error during logout';
                messageElement.style.color = 'red';
            }
        });
    }

    // Carica il nome e cognome
    loadUserName();
    
    // Imposta il logout
    setupLogout();
});




//tasklist
document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener("load", function () {
        fillStatusArr();
        showTasks();
    });

    const token = localStorage.getItem("token");
    let projectArr = [];
    const taskList = document.getElementById("task-list");
    const complTaskList = document.getElementById("completed-task-list");
    const newTaskList = document.getElementById("task-list-hp"); // Aggiungi il riferimento al nuovo task list

    async function showTasks() {
        await getUserTasks();
        await fillProjectArr();

        taskArr.forEach((task) => {
            const taskID = task.id;
            const taskName = task.task_name;
            const taskDescription = task.task_desc;
            const taskPriority = task.status.status;
            const taskStatusColor = task.status.color;
            const taskValue = task.value;
            let taskMileName = task.milestone.mile_name || "Nessuna milestone assegnata!";
            let taskEndDate = task.end_date || "Scadenza indefinita";
            const taskCreated = task.start_date;
            const taskProjectID = task.project_id;
            let taskProjectName = projectArr.find(p => p.id == taskProjectID)?.project_name || "Progetto sconosciuto";

            let listItem = document.createElement("li");
            listItem.className = "list-group-item";
            listItem.id = `task${taskID}`;
            listItem.innerHTML = `
                <div class="widget-content-wrapper d-flex">
    <div class="col-2 d-flex flex-column justify-content-center">
        <div class="widget-content-left">
            <div class="widget-heading text-danger">To Do</div>
            <div class="widget-subheading">Creazione: 2024-08-29</div>
            <div class="widget-subheading">Scadenza: 2024-08-30</div>   
        </div>
    </div>
    <div class="col-8 d-flex align-items-center justify-content-center">
        <div class="p-2 text-center border-start border-end w-100">
            <div class="widget-subheading">finire</div>
            <div class="widget-heading mb-2"><strong>homepage</strong></div>
            <div class="widget-subheading">n</div>
        </div>
    </div>
    <div class="col-2 d-flex align-items-center justify-content-end">
        <div class="widget-content-right">
            <button class="ms-1 border-0 btn-transition btn btn-outline-warning" onclick="showChangePriorityModal(22)">
                <i class="fa-solid fa-clock-rotate-left"></i>
            </button>
            <button class="ms-1 border-0 btn-transition btn btn-outline-success" onclick="completeTask(22)">
                <i class="fa-solid fa-check"></i> 
            </button>
        </div>
    </div>
</div>

            `;

            if (taskPriority == "Completata") {
                complTaskList?.appendChild(listItem);
            } else {
                taskList?.appendChild(listItem);
                newTaskList?.appendChild(listItem.cloneNode(true));  // Aggiungi la task anche nella nuova lista
            }
        });
    }

    async function getUserTasks() {
        try {
            const response = await fetch("http://localhost:8080/api/tasks/user", {
                method: "GET",
                headers: {
                    token: token,
                },
            });
            if (response.status === 200) {
                const data = await response.json();
                taskArr = data; // Usa direttamente la risposta JSON per popolare taskArr
            } else {
                console.error("Failed to fetch tasks:", response.status);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }

    //progetti

    async function fillProjectArr() {
        try {
            const response = await fetch("http://localhost:8080/api/projects/user", {
                method: "GET",
                headers: {
                    token: token,
                },
            });
            if (response.status === 200) {
                const data = await response.json();
                projectArr = data; // Popola projectArr con la risposta JSON
            } else {
                console.error("Failed to fetch projects:", response.status);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    }

    window.completeTask = function (taskID) {
        completeTask(taskID);
    };

    async function completeTask(taskID) {
        try {
            const response = await fetch(`http://localhost:8080/api/tasks/complete/${taskID}`, {
                method: "GET",
                headers: {
                    token: token,
                },
            });
            if (response.status === 200) {
                document.getElementById("task-list").innerHTML = "";
                if (document.getElementById('completed-task-list'))
                document.getElementById("completed-task-list").innerHTML = "";
                showTasks();
            }
        } catch (error) {
            console.error("Error completing task:", error);
        }
    }

    window.showChangePriorityModal = function (taskID) {
        populateSelectWithArray(statusArr, "changePrioritySelect", "status", "Status non validi");
        changePriorityModal.style.display = "block";
        changePriorityID = taskID;
    };

    window.closeChangePriorityModal = async function () {
        const statusID = document.getElementById("changePrioritySelect").value;
        await changePriority(changePriorityID, statusID);
        changePriorityModal.style.display = "none";
        document.getElementById("task-list").innerHTML = "";
        showTasks();
    };

    async function fillStatusArr() {
        try {
            const response = await fetch("http://localhost:8080/api/status", {
                method: "GET",
                headers: {
                    token: token,
                },
            });
            if (response.status === 200) {
                const data = await response.json();
                statusArr = data; // Popola statusArr con la risposta JSON
            } else {
                console.error("Failed to fetch statuses:", response.status);
            }
        } catch (error) {
            console.error("Error fetching statuses:", error);
        }
    }

    async function changePriority(taskID, statusID) {
        try {
            const response = await fetch(`http://localhost:8080/api/tasks/changestatus/${taskID}/${statusID}`, {
                method: "PUT",
                headers: {
                    token: token,
                },
            });
            if (response.status !== 200) {
                console.error("Failed to change task priority:", response.status);
            }
        } catch (error) {
            console.error("Error changing task priority:", error);
        }
    }

    function populateSelectWithArray(array, selectId, nameProp, message) {
        const selectElement = document.getElementById(selectId);
        if (array.length > 0) {
            selectElement.innerHTML = '<option>Nessuna scelta</option>';
            array.forEach((item) => {
                const option = document.createElement("option");
                option.value = item.id;
                option.id = `${nameProp}${item.id}`;
                option.textContent = item[nameProp];
                selectElement.appendChild(option);
            });
        } else {
            selectElement.innerHTML = "";
            const option = document.createElement("option");
            option.textContent = message;
            selectElement.appendChild(option);
        }
    }
});

  


// Funzione per recuperare le note dall'API
async function fetchNotes() {
    try {
        const response = await fetch('http://localhost:8080/api/minitasks');
        const minitasks = await response.json();

        // Seleziona l'elemento in cui inserire le note
        const notesList = document.querySelector('.notes-list');

        // Pulisce la lista esistente (eccetto il paragrafo di introduzione)
        notesList.innerHTML = `<p class="notes" id="notes-content"> manager 1 dice:</p>`;

        // Aggiunge le note recuperate
        minitasks.forEach(minitask => {
            const noteItem = document.createElement('li');
            
            // Creare un input checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = minitask.minitask_status === 'completato'; // Supponiamo che lo stato 'completato' indichi una task completata
            checkbox.addEventListener('change', () => updateTaskStatus(minitask.id, checkbox.checked));
            
            // Inserire il nome del mini-task
            const noteText = document.createElement('span');
            noteText.textContent = minitask.minitask_name;
            noteText.style.marginLeft = '10px';

            // Aggiungere checkbox e testo alla nota
            noteItem.appendChild(checkbox);
            noteItem.appendChild(noteText);
            notesList.appendChild(noteItem);
        });
    } catch (error) {
        console.error('Errore nel recupero delle note:', error);
    }
}

// Funzione per aggiornare lo stato del mini-task
async function updateTaskStatus(taskId, isCompleted) {
    try {
        await fetch(`http://localhost:8080/api/minitasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                minitask_status: isCompleted ? 'completato' : 'iniziato'
            }),
        });
    } catch (error) {
        console.error('Errore nell\'aggiornamento dello stato della task:', error);
    }
}

// Esegui la funzione per caricare le note quando la pagina viene caricata
fetchNotes();




// polar area chart 
// mappa lo status ai valori numerici
function getStatusValue(status) {
    const normalizedStatus = status.trim().toLowerCase();

    const statusValues = {
        'to do': 5,
        'in corso': 10,
        'in progress': 10,
        'dev ok': 15,
        'testing': 20,
        'completata': 25,
        'completato': 25, 
    };

    return statusValues[normalizedStatus] || 0;
}

// conta lo status e mappa i progetti con il loro valore
function countStatus(projects) {
    const projectStatusMap = projects.map(project => {
        const value = getStatusValue(project.status);
        console.log(`Project: ${project.project_name}, Status: ${project.status}, Value: ${value}`);
        return {
            name: project.project_name,
            value: value
        };
    });

    return projectStatusMap;
}



function createPolarAreaChart(projectStatusMap) {
    const canvas = document.getElementById('statusChart');
    const ctx = canvas.getContext('2d');

    // Rimuovi gli attributi width e height se impostati
    canvas.removeAttribute('width');
    canvas.removeAttribute('height');

    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: projectStatusMap.map(project => project.name), 
            datasets: [{
                label: 'Project Status',
                data: projectStatusMap.map(project => project.value), 
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, 
            scales: {
                r: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
}

// Recupera i dati dall'API e crea il grafico
fetch('http:/localhost:8080/api/projects')
    .then(response => response.json())
    .then(data => {
        const projectStatusMap = countStatus(data);
        createPolarAreaChart(projectStatusMap);
    })
    .catch(error => console.error('Errore nel recupero dei dati:', error));



 


// progetti tasks
document.addEventListener('DOMContentLoaded', function() {
    fetchTasks();
});

function fetchTasks() {
    fetch('http:/localhost:8080/api/tasks') 
        .then(response => response.json())
        .then(tasks => {
            const container = document.getElementById('task-container');
            container.innerHTML = ''; // Pulisce il contenitore prima di aggiungere nuove barre
            tasks.forEach(task => {
                const progressPercentage = getProgressPercentage(task.status.id); // Converti status.id in percentuale
                
                // Mappa l'id del colore alla classe CSS
                const colorClass = getColorClass(task.status.id);

                const progressContainer = document.createElement('div');
                progressContainer.className = 'progress-container';

                // Crea il nome della task
                const taskName = document.createElement('h4');
                taskName.className = 'small font-weight-bold';
                taskName.innerHTML = `${task.task_name} - <span class="float-right">${progressPercentage}%</span>`;
                
                // Crea la barra di progresso
                const progressBar = document.createElement('div');
                progressBar.className = 'progress';
                progressBar.innerHTML = `
                    <div class="progress-bar ${colorClass}" role="progressbar" style="width: ${progressPercentage}%" aria-valuenow="${progressPercentage}" aria-valuemin="0" aria-valuemax="100"></div>
                `;
                
                progressContainer.appendChild(taskName);
                progressContainer.appendChild(progressBar);
                container.appendChild(progressContainer);
            });
        })
        .catch(error => {
            console.error('Errore nel recupero dei dati:', error);
        });
}

// Funzione per convertire status.id in percentuale
function getProgressPercentage(statusId) {
    // Mappa i tuoi status.id ai valori percentuali
    const statusMap = {
        1: 0,    // Esempio
        2: 25,   // Esempio
        3: 50,   // Esempio
        4: 75,   // Esempio
        5: 100   // Esempio
    };
    return statusMap[statusId] || 0; // Restituisce 0 se statusId non è definito
}

// Funzione per mappare status.id alla classe di colore CSS
function getColorClass(statusId) {
    const colorMap = {
        1: 'bg-red',    // Rosso
        2: 'bg-gold',   // Oro
        3: 'bg-blue',   // Blu
        4: 'bg-purple', // Viola
        5: 'bg-green'   // Verde
    };
    return colorMap[statusId] || 'bg-secondary'; // Restituisce 'bg-secondary' se statusId non è definito
}

