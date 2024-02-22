const addTaskButton = document.getElementById("add-task-button");
const deleteTasksButton = document.getElementById("delete-tasks-button");
const taskInput = document.getElementById("task-input");
const tasksList = document.getElementById("tasks");

function addTask() {
    const taskText = taskInput.value.trim();

    if (!taskText) {
        return;
    }

    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskSpan);

    tasksList.appendChild(taskItem);

    taskInput.value = "";
}

function deleteSelectedTasks() {
    const selectedTasks = tasksList.querySelectorAll(".selected");

    for (let i = 0; i < selectedTasks.length; i++) {
        selectedTasks[i].remove();
    }
}

addTaskButton.addEventListener("click", addTask);

deleteTasksButton.addEventListener("click", deleteSelectedTasks);

taskInput.addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
        addTask();
    }
});

tasksList.addEventListener("click", (event) => {
    const taskItem = event.target.closest(".task-item");

    if (!taskItem) {
        return;
    }

    const checkbox = taskItem.querySelector("input[type='checkbox']");

    if (event.target === checkbox) {
        taskItem.classList.toggle("selected");
    }
});