const STORAGE_KEY = 'todoListData';
let todosData = { todos: [], nextId: 1 };
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', init);

function init() {
    loadTodos();
    setupEventListeners();
    renderTodos();
}

function loadTodos() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) todosData = JSON.parse(data);
}

function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todosData));
}

function setupEventListeners() {
    document.getElementById('addBtn').addEventListener('click', handleAddTodo);
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilterChange);
    });
}

function handleAddTodo() {
    const title = document.getElementById('todoTitle').value;
    const desc = document.getElementById('todoDescription').value;
    if (!title.trim()) return alert('Titolo obbligatorio!');

    todosData.todos.push({
        id: todosData.nextId++,
        title: title.trim(),
        description: desc.trim(),
        completed: false
    });

    saveTodos();
    renderTodos();

    document.getElementById('todoTitle').value = '';
    document.getElementById('todoDescription').value = '';
}

function handleFilterChange(e) {
    currentFilter = e.target.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    renderTodos();
}

function renderTodos() {
    const list = document.getElementById('todoList');
    list.innerHTML = '';
    const filtered = getFilteredTodos();

    filtered.forEach(todo => {
        const div = document.createElement('div');
        div.className = 'todo-item' + (todo.completed ? ' completed' : '');
        div.innerHTML = `
            <span class="title">${todo.title}</span>
            <div class="actions">
                <button class="edit">Modifica</button>
                <button class="delete">Elimina</button>
            </div>
        `;
        div.querySelector('.title').addEventListener('click', () => {
            todo.completed = !todo.completed;
            saveTodos();
            renderTodos();
        });

        div.querySelector('.edit').addEventListener('click', () => {
            const newTitle = prompt('Modifica titolo', todo.title);
            if (newTitle && newTitle.trim()) {
                todo.title = newTitle.trim();
                const newDesc = prompt('Modifica descrizione', todo.description);
                todo.description = newDesc.trim();
                saveTodos();
                renderTodos();
            }
        });

        div.querySelector('.delete').addEventListener('click', () => {
            if (confirm('Eliminare questa task?')) {
                todosData.todos = todosData.todos.filter(t => t.id !== todo.id);
                saveTodos();
                renderTodos();
            }
        });

        list.appendChild(div);
    });

    const count = todosData.todos.filter(t => !t.completed).length;
    document.getElementById('activeCount').textContent = `${count} task attive`;
}

function getFilteredTodos() {
    if (currentFilter === 'active') return todosData.todos.filter(t => !t.completed);
    if (currentFilter === 'completed') return todosData.todos.filter(t => t.completed);
    return todosData.todos;
}
