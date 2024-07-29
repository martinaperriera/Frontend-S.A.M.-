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

//card progetto attuale
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

/* accordion progetti passati */
document.querySelectorAll('.accordion__item').forEach(item => {
    item.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.accordion__item').forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  
  // notes 
  const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
popupTitle = popupBox.querySelector("header p"),
closeIcon = popupBox.querySelector("header i"),
titleTag = popupBox.querySelector("input"),
descTag = popupBox.querySelector("textarea"),
addBtn = popupBox.querySelector("button");

const months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;

addBox.addEventListener("click", () => {
    popupTitle.innerText = "Add a new Note";
    addBtn.innerText = "Add Note";
    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";
    if(window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
});

function showNotes() {
    if(!notes) return;
    document.querySelectorAll(".note").forEach(li => li.remove());
    notes.forEach((note, id) => {
        let filterDesc = note.description.replaceAll("\n", '<br/>');
        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        addBox.insertAdjacentHTML("afterend", liTag);
    });
}
showNotes();

function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

function deleteNote(noteId) {
    let confirmDel = confirm("Are you sure you want to delete this note?");
    if(!confirmDel) return;
    notes.splice(noteId, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
}

function updateNote(noteId, title, filterDesc) {
    let description = filterDesc.replaceAll('<br/>', '\r\n');
    updateId = noteId;
    isUpdate = true;
    addBox.click();
    titleTag.value = title;
    descTag.value = description;
    popupTitle.innerText = "Update a Note";
    addBtn.innerText = "Update Note";
}

addBtn.addEventListener("click", e => {
    e.preventDefault();
    let title = titleTag.value.trim(),
    description = descTag.value.trim();

    if(title || description) {
        let currentDate = new Date(),
        month = months[currentDate.getMonth()],
        day = currentDate.getDate(),
        year = currentDate.getFullYear();

        let noteInfo = {title, description, date: `${month} ${day}, ${year}`}
        if(!isUpdate) {
            notes.push(noteInfo);
        } else {
            isUpdate = false;
            notes[updateId] = noteInfo;
        }
        localStorage.setItem("notes", JSON.stringify(notes));
        showNotes();
        closeIcon.click();
    }
});