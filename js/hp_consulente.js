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



// Card progetto attuale
        function toggleDetails(event, detailsId) {
            event.preventDefault();
            const detailsElement = document.getElementById(detailsId);
            const courseItem = detailsElement.closest('.ag-courses_item');
            if (courseItem.classList.contains('expanded')) {
                courseItem.classList.remove('expanded');
            } else {
                // Collapse any other expanded cards
                document.querySelectorAll('.ag-courses_item.expanded').forEach(item => {
                    item.classList.remove('expanded');
                });
                // Expand the clicked card
                courseItem.classList.add('expanded');
            }
        }
        document.addEventListener('DOMContentLoaded', () => {
            // Ensure all cards start in the collapsed state
            document.querySelectorAll('.ag-courses_item').forEach(item => {
                item.classList.remove('expanded');
            });
        });

        // Accordion
        document.querySelectorAll('.accordion__item').forEach(item => {
            item.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                document.querySelectorAll('.accordion__item').forEach(i => i.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });

  


  
  /* card task pagina task */
// endpoint API che restituisce le task
const apiEndpoint = 'https:....com/tasks'; 

async function fetchTasks() {
    try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
            throw new Error('Errore nel recupero delle task');
        }
        const tasks = await response.json();
        loadTasks(tasks);
    } catch (error) {
        console.error('Errore nel recupero delle task:', error);
    }
}

function loadTasks(tasks) {
    const today = new Date().toISOString().split('T')[0];
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        if (task.date >= today) {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${task.title} - Difficoltà: ${task.difficulty}, Urgenza: ${task.urgency} (${task.date})</span>
                <div class="task-actions">
                    <button class="button complete" onclick="completeTask(${task.id})">Completa</button>
                    <button class="button delete" onclick="deleteTask(${task.id})">Elimina</button>
                </div>
            `;
            taskList.appendChild(li);
        }
    });
}

function completeTask(id) {
    const taskList = document.getElementById('task-list');
    const taskItems = taskList.querySelectorAll('li');
    taskItems.forEach(taskItem => {
        if (taskItem.querySelector('.complete').onclick.toString().includes(`completeTask(${id})`)) {
            const completedTaskList = document.getElementById('completed-task-list');
            taskItem.classList.add('completed');
            taskItem.querySelector('.complete').remove();
            completedTaskList.appendChild(taskItem);
        }
    });
}

function deleteTask(id) {
    const taskList = document.getElementById('task-list');
    const taskItems = taskList.querySelectorAll('li');
    taskItems.forEach(taskItem => {
        if (taskItem.querySelector('.delete').onclick.toString().includes(`deleteTask(${id})`)) {
            taskList.removeChild(taskItem);
        }
    });
}

function deleteCompletedTask(id) {
    const completedTaskList = document.getElementById('completed-task-list');
    const taskItems = completedTaskList.querySelectorAll('li');
    taskItems.forEach(taskItem => {
        if (taskItem.querySelector('.delete').onclick.toString().includes(`deleteCompletedTask(${id})`)) {
            completedTaskList.removeChild(taskItem);
        }
    });
}

fetchTasks(); 




  
  // Variabili globali
const addBox = document.querySelector(".add-box");
const popupBox = document.querySelector(".popup-box");
const popupTitle = popupBox.querySelector("header p");
const closeIcon = popupBox.querySelector("header i");
const titleTag = popupBox.querySelector("input[type='text']");
const descTag = popupBox.querySelector("textarea");
const priorityTag = popupBox.querySelector("select[name='priority']");
const completionTag = popupBox.querySelector("select[name='completion']");
const projectTag = popupBox.querySelector("select[id='task-project']");
const addBtn = popupBox.querySelector("button");

const months = ["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"];
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
let isUpdate = false;
let updateId;


// Recupera e visualizza le task
function showTasks() {
    const addBox = document.querySelector(".add-box");
    if (!tasks) return;

    // Pulisce le task esistenti
    document.querySelectorAll(".note").forEach(li => li.remove());

    // Mostra ogni task
    tasks.forEach((task, id) => {
        const filterDesc = task.description.replaceAll("\n", '<br/>');
        const liTag = `<li class="note">
                        <div class="details">
                            <p>${task.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${task.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateTask(${id}, '${task.title}', '${filterDesc}', '${task.priority}', '${task.completion}', '${task.project}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteTask(${id})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        addBox.insertAdjacentHTML("afterend", liTag);
    });
}

// Mostra il menu delle opzioni della task
function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
        if (e.target.tagName !== "I" || e.target !== elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

// Cancella una task
function deleteTask(taskId) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    tasks.splice(taskId, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    showTasks();
}

// Aggiorna una task
function updateTask(taskId, title, description, priority, completion, project) {
    titleTag.value = title;
    descTag.value = description.replaceAll('<br/>', '\r\n');
    priorityTag.value = priority;
    completionTag.value = completion;
    projectTag.value = project;
    updateId = taskId;
    isUpdate = true;
    popupTitle.innerText = "Update a Task";
    addBtn.innerText = "Update Task";
    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";
}

// Aggiungi o aggiorna una task
addBtn.addEventListener("click", e => {
    e.preventDefault();
    const title = titleTag.value.trim();
    const description = descTag.value.trim();
    const priority = priorityTag.value;
    const completion = completionTag.value;
    const project = projectTag.value;

    if (title || description || priority || completion || project) {
        const currentDate = new Date();
        const month = months[currentDate.getMonth()];
        const day = currentDate.getDate();
        const year = currentDate.getFullYear();

        const taskInfo = {
            title,
            description,
            priority,
            completion,
            project,
            date: `${month} ${day}, ${year}`
        };

        if (!isUpdate) {
            tasks.push(taskInfo);
        } else {
            isUpdate = false;
            tasks[updateId] = taskInfo;
        }

        localStorage.setItem("tasks", JSON.stringify(tasks));
        showTasks();
        closeIcon.click();
    }
});

// Chiude il popup
closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    priorityTag.value = '';
    completionTag.value = '';
    projectTag.value = '';
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
});

// Recupera i progetti dal database e popola il menu a discesa
async function fetchProjects() {
    try {
        const response = await fetch('YOUR_PROJECT_API_ENDPOINT'); // Sostituisci con l'URL della tua API per i progetti
        const data = await response.json();
        if (Array.isArray(data)) {
            populateProjectDropdown(data);
        }
    } catch (error) {
        console.error('Errore nel recupero dei progetti:', error);
    }
}

// Popola il menu a discesa con i progetti
function populateProjectDropdown(projects) {
    const projectDropdown = document.getElementById('task-project');
    projectDropdown.innerHTML = ''; // Pulisci le opzioni esistenti

    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Select a project';
    defaultOption.value = '';
    projectDropdown.appendChild(defaultOption);

    projects.forEach(project => {
        const option = document.createElement('option');
        option.textContent = project.name; // Assumi che il nome del progetto sia una proprietà
        option.value = project.id; // Assumi che l'ID del progetto sia una proprietà
        projectDropdown.appendChild(option);
    });
}

// Inizializza la pagina
document.addEventListener('DOMContentLoaded', () => {
    showTasks(); // Carica le task
    fetchProjects(); // Carica i progetti
});




// notes
document.addEventListener('DOMContentLoaded', function() {
    // Seleziona l'elemento in cui inseriremo le note (ad esempio un contenitore div)
    const notesContainer = document.querySelector('.notes-list');

    // Recupera i dati dall'API
    fetch('http://localhost:8080/api/minitasks')
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore nel recupero delle note.');
            }
            return response.json();
        })
        .then(data => {
            // Itera attraverso ogni nota (minitask) e crea un nuovo elemento in-line per ciascuna
            data.forEach(minitask => {
                if (minitask.minitask_name) {
                    // Crea un nuovo elemento span per contenere il testo della nota
                    const noteElement = document.createElement('span');
                    noteElement.textContent = `${minitask.minitask_name}: ${minitask.minitask_desc}`;
                    
                    // Applica eventualmente uno stile in-line al nuovo elemento
                    noteElement.style.display = 'block'; // Per rendere ogni nota su una nuova riga
                    
                    // Aggiungi l'elemento al contenitore delle note
                    notesContainer.appendChild(noteElement);
                }
            });
        })
        .catch(error => {
            console.error('Errore nel recupero delle note:', error);
        });
});

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM completamente caricato e analizzato");

    const notesContainer = document.querySelector('.notes-list');
    console.log("notesContainer trovato:", notesContainer);

    // Controlla se notesContainer è null
    if (!notesContainer) {
        console.error("notesContainer non trovato!");
        return;
    }

    fetch('http://localhost:8080/api/minitasks')
        .then(response => {
            console.log("Risposta ricevuta dall'API", response);
            if (!response.ok) {
                throw new Error('Errore nel recupero delle note.');
            }
            return response.json();
        })
        .then(data => {
            console.log("Dati ricevuti dall'API:", data);

            data.forEach(minitask => {
                console.log("Elaborazione della minitask:", minitask);

                if (minitask.minitask_name) {
                    const noteElement = document.createElement('span');
                    noteElement.textContent = `${minitask.minitask_name}: ${minitask.minitask_desc}`;
                    noteElement.style.display = 'block';

                    notesContainer.appendChild(noteElement);
                    console.log("Nota aggiunta al DOM:", noteElement);
                }
            });
        })
        .catch(error => {
            console.error('Errore nel recupero delle note:', error);
        });
});




    //logout
    document.getElementById('logoutButton').addEventListener('click', async function(event) {
        event.preventDefault(); // Previeni l'azione di default del link
        console.log('Logout button clicked'); // Log per verificare che il click funzioni
    
        const token = localStorage.getItem('authToken');
        console.log('Token retrieved:', token); // Log per verificare il token
    
        const messageElement = document.getElementById('message');
    
        if (!token) {
            messageElement.textContent = 'No token found';
            messageElement.style.color = 'red';
            console.log('No token found');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:8080/api/users/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            console.log('Logout request sent'); // Log per verificare l'invio della richiesta
    
            if (response.ok) {
                localStorage.removeItem('authToken');
                messageElement.textContent = 'Logout successful';
                messageElement.style.color = 'green';
                console.log('Logout successful');
                setTimeout(() => {
                    window.location.href = 'login.html'; // Redirect to login page after a short delay
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
    