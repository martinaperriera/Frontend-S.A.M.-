/* to do list */
document.addEventListener("DOMContentLoaded", function() {
    const taskList = document.getElementById('task-list');
    const addTaskForm = document.getElementById('addTaskForm');
    const addTaskModal = document.getElementById('addTaskModal');

    addTaskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addTask();
    });

    //  aggiungi Task Modal
    window.showAddTaskModal = function() {
        addTaskModal.style.display = 'block';
    }

    // chiudi Task Modal
    window.closeAddTaskModal = function() {
        addTaskModal.style.display = 'none';
    }

    // aggiungi Task
    function addTask() {
        const taskName = document.getElementById('taskName').value;
        const taskDescription = document.getElementById('taskDescription').value;
        const taskPriority = document.getElementById('taskPriority').value;

        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.innerHTML = `
            <div class="todo-indicator ${taskPriority}"></div>
            <div class="widget-content p-0">
                <div class="widget-content-wrapper">
                    <div class="widget-content-left mr-2">
                        <div class="custom-checkbox custom-control">
                            <input class="custom-control-input" type="checkbox">
                            <label class="custom-control-label">&nbsp;</label>
                        </div>
                    </div>
                    <div class="widget-content-left">
                        <div class="widget-heading">${taskName}</div>
                        <div class="widget-subheading">${taskDescription}</div>
                    </div>
                    <div class="widget-content-right">
                        <button class="border-0 btn-transition btn btn-outline-success" onclick="completeTask(this)">
                            <i class="fa fa-check"></i>
                        </button>
                        <button class="border-0 btn-transition btn btn-outline-danger" onclick="deleteTask(this)">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        taskList.appendChild(listItem);
        addTaskForm.reset();
        closeAddTaskModal();
    }

    // completa Task
    window.completeTask = function(button) {
        const listItem = button.closest('.list-group-item');
        listItem.querySelector('.custom-control-input').checked = true;
    }

    // elimina Task
    window.deleteTask = function(button) {
        const listItem = button.closest('.list-group-item');
        taskList.removeChild(listItem);
    }
});