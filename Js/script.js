const form = document.getElementById('todoForm');
const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const filter = document.getElementById('filter');
const deleteAll = document.getElementById('deleteAll');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

form.addEventListener("submit", function(e) {
    e.preventDefault();

    if (taskInput.value === "" || dateInput.value === "") {
        alert("Please fill in all fields!!");
        return;
    }
    const todo = {
        task: taskInput.value,
        date: dateInput.value,
        completed: false
    };

    todos.push(todo);
    taskInput.value = "";
    dateInput.value = "";

    renderTodos();

});

filter.addEventListener("change", renderTodos);
deleteAll.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all tasks?")) {
        todos = [];
        renderTodos();
    }
});

function renderTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    deleteAll.disabled = todos.length === 0;
    todoList.innerHTML = "";

    let filteredTodos = todos;
    if (filter.value === "completed") {
        filteredTodos = todos.filter(todo => todo.completed);
    } else if (filter.value === "pending") {
        filteredTodos = todos.filter(todo => !todo.completed);
    }

    if (filteredTodos.length === 0) {
        todoList.innerHTML = `<tr><td colspan="4" class="empty">No Task Yet, Enjoy the Waves!</td></tr>`;
        return;
    }

    filteredTodos.forEach((todo, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="${todo.completed ? 'completed' : ''}">${todo.task}</td>
            <td class="date">${todo.date}</td>
            <td>
                <select class="statusSelect ${todo.completed ? 'completed' : 'pending'}">
                    <option value="pending" ${!todo.completed ? 'selected' : ''}>Pending</option>
                    <option value="completed" ${todo.completed ? 'selected' : ''}>Completed</option>
                </select>
            </td>
            <td><button class="deleteBtn">Delete</button></td>
        `;
        todoList.appendChild(row);

        row.querySelector(".statusSelect").addEventListener("change", (e) => {
            todo.completed = e.target.value === "completed";
            renderTodos();
        });
        row.querySelector(".deleteBtn").addEventListener("click", () => {
            todos = todos.filter(t => t !== todo);
            renderTodos();
        });
    });
}

renderTodos();