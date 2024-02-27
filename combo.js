// Script.js
const sortableList = document.getElementById("sortable");
const addTaskButton = document.getElementById("add-task-button");
const deleteTasksButton = document.getElementById("delete-tasks-button");
const taskInput = document.getElementById("task-input");
const tasksList = document.getElementById("tasks");
let draggedItem = null;

sortableList.addEventListener("dragstart", (e) => {
    draggedItem = e.target;
    setTimeout(() => {
        e.target.style.display = "none";
    }, 0);
});

sortableList.addEventListener("dragend", (e) => {
    setTimeout(() => {
        e.target.style.display = "";
        draggedItem = null;
    }, 0);
});

sortableList.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(sortableList, e.clientY);
    const currentElement = document.querySelector(".dragging");
    if (afterElement == null) {
        sortableList.appendChild(draggedItem);
    } else {
        sortableList.insertBefore(draggedItem, afterElement);
    }
});

const getDragAfterElement = (container, y) => {
    const draggableElements = [
        ...container.querySelectorAll("li:not(.dragging)"),
    ];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return {
                offset: offset,
                element: child,
            };
        } else {
            return closest;
        }
    }, {
        offset: Number.NEGATIVE_INFINITY,
    }).element;
};

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
