//nome e cognome dinamici sidebar
document.addEventListener('DOMContentLoaded', function() {
    // Recupera il token dal localStorage
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
});



//tasks
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
                <div class="row"> 
                    <div class="widget-content p-0">
                        <div class="widget-content-wrapper">
                            <div class="col-2"> 
                                <div class="widget-content-left">
                                    <div class="widget-heading" style="color : ${taskStatusColor}">${taskPriority}</div>
                                    <div class="widget-subheading">Creazione: ${taskCreated}</div>
                                    <div class="widget-subheading">Scadenza: ${taskEndDate}</div>   
                                </div>
                            </div>
                            <div class="col-8"> 
                                <div class="p-2 text-center border-start border-end">
                                    <div class="widget-subheading">${taskMileName}</div>
                                    <div class="widget-heading mb-2"><strong>${taskName}</strong></div>
                                    <div class="widget-subheading">${taskDescription}</div>
                                </div>
                            </div>
                            <div class="col-1"> 
                                <div class="widget-content-right">
                                    <button class="ms-1 border-0 btn-transition btn btn-outline-warning" onclick="showChangePriorityModal(${taskID})">
                                        <i class="fa-solid fa-clock-rotate-left"></i>
                                    </button>
                                    <button class="ms-1 border-0 btn-transition btn btn-outline-success" onclick="completeTask(${taskID})">
                                        <i class="fa-solid fa-check"></i> 
                                    </button>
                                </div>
                            </div>
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

// Definizione della funzione fetchNotes
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

// Funzione per recuperare i consulenti dall'API
async function fetchConsultants() {
    try {
        const response = await fetch('http://localhost:8080/api/users');
        const users = await response.json();

        const consultantSelect = document.getElementById('consultant-select');
        consultantSelect.innerHTML = '<option value="">Seleziona un consulente</option>'; // Pulisci le opzioni esistenti

        // Filtra solo gli utenti con il ruolo di "consulente" basato su role.id (ad es. 2 per consulenti)
        users.filter(user => user.role && user.role.id === 1).forEach(user => { 
            const option = document.createElement('option');
            option.value = user.id; // Usa l'ID del consulente
            option.textContent = user.nomeCompleto; // Mostra il nome completo del consulente
            consultantSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Errore nel recupero dei consulenti:', error);
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

// Funzione per inviare una nuova nota all'API
async function submitNewNote() {
    const noteText = document.getElementById('new-note-text').value;
    const consultantID = document.getElementById('consultant-select').value;

    if (noteText && consultantID) {
        try {
            const response = await fetch('http://localhost:8080/api/minitasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    minitask_name: noteText, // Testo della nota
                    minitask_status: 'iniziato',
                    user_id: consultantID // ID del consulente selezionato
                }),
            });

            if (response.ok) {
                alert('Nota aggiunta con successo!');
                fetchNotes(); // Aggiorna la lista delle note
                document.getElementById('new-note-text').value = '';
                document.getElementById('consultant-select').value = '';
            } else {
                alert('Errore durante l\'aggiunta della nota');
            }
        } catch (error) {
            console.error('Errore nell\'invio della nuova nota:', error);
        }
    } else {
        alert('Compila tutti i campi prima di inviare la nota.');
    }
}

// Assicurati che la funzione venga chiamata dopo che la pagina è stata caricata
document.addEventListener('DOMContentLoaded', () => {
    fetchNotes(); // Qui la funzione fetchNotes viene chiamata
    fetchConsultants();

    // Aggiungi un event listener al pulsante di submit
    document.getElementById('submit-note').addEventListener('click', submitNewNote);
});
