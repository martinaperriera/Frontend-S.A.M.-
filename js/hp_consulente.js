// recupera tasks dal db
document.addEventListener("DOMContentLoaded", function() {
    const taskList = document.getElementById('task-list');

    // Funzione per caricare le task dal database
    function loadTasks() {
        fetch('https://....com/api/tasks')  // Modifica l'URL per puntare alla tua API
            .then(response => response.json())
            .then(tasks => {
                tasks.forEach(task => {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item';
                    listItem.innerHTML = `
                        <div class="todo-indicator ${task.priority}"></div>
                        <div class="widget-content p-0">
                            <div class="widget-content-wrapper">
                                <div class="widget-content-left mr-2">
                                    <div class="custom-checkbox custom-control">
                                        <input class="custom-control-input" type="checkbox" ${task.completed ? 'checked' : ''}>
                                        <label class="custom-control-label">&nbsp;</label>
                                    </div>
                                </div>
                                <div class="widget-content-left">
                                    <div class="widget-heading">${task.name}</div>
                                    <div class="widget-subheading">${task.description}</div>
                                </div>
                                <div class="widget-content-right">
                                    <button class="border-0 btn-transition btn btn-outline-success" onclick="completeTask(this, ${task.id})">
                                        <i class="fa fa-check"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    taskList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error loading tasks:', error));
    }

    // completa Task
    window.completeTask = function(button, taskId) {
        const listItem = button.closest('.list-group-item');
        const checkbox = listItem.querySelector('.custom-control-input');
        checkbox.checked = true;

        // Aggiorna lo stato della task nel database
        fetch(`https:.../tasks/${taskId}/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: true })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Task completed:', data);
        })
        .catch(error => console.error('Error completing task:', error));
    }

    // Carica le task quando la pagina è pronta
    loadTasks();
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

/* TIMELINE - eventi da db */ 
document.addEventListener('DOMContentLoaded', function() {
    // recupera eventi dall'API
    async function fetchEvents() {
        try {
            const response = await fetch('http:/api/events'); 
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const events = await response.json();
            populateTimeline(events);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }

    // inserisce in timeline i dati degli eventi
    function populateTimeline(events) {
        const timelineList = document.querySelector('.timeline-list');
        timelineList.innerHTML = ''; // Pulisce la lista esistente

        events.forEach(event => {
            const timelineItem = document.createElement('li');
            timelineItem.className = 'timeline-item';

            // crea il contenuto dell'evento
            timelineItem.innerHTML = `
                <div class="timeline-date bg-primary">${new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                <h5 class="timeline-event-title">${event.title}</h5>
                <p class="timeline-event-description">${event.description}</p>
            `;

            // inserisci elemento timeline alla lista
            timelineList.appendChild(timelineItem);
        });
    }

    // recupera gli eventi quando il DOM è completamente caricato
    fetchEvents();
});

