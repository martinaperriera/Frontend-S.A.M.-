// recupera tasks dal db
document.addEventListener("DOMContentLoaded", function() {
    const taskList = document.getElementById('task-list');

    // Funzione per caricare le task dal database
    function loadTasks() {
        fetch('https://example.com/api/tasks')  // Modifica l'URL per puntare alla tua API
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
        fetch(`https://example.com/api/tasks/${taskId}/complete`, {
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