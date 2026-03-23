// ============================================
// COSTANTI E CONFIGURAZIONE
// ============================================
const STORAGE_KEY = 'todoListData';

// ============================================
// STATO APPLICAZIONE
// ============================================
let todosData = {
    todos: [],
    nextId: 1
};

let currentFilter = 'all';

// ============================================
// INIZIALIZZAZIONE
// ============================================
document.addEventListener('DOMContentLoaded', init);

function init() {
    loadTodos();
    setupEventListeners();
    renderTodos();
}

// ============================================
// LOCAL STORAGE
// ============================================
function loadTodos() {
    try {
        const jsonString = localStorage.getItem(STORAGE_KEY);

        if (jsonString) {
            todosData = JSON.parse(jsonString);
        }
    } catch (error) {
        alert('Errore caricamento dati!');
        todosData = { todos: [], nextId: 1 };
    }
}

function saveTodos() {
    try {
        const jsonString = JSON.stringify(todosData);
        localStorage.setItem(STORAGE_KEY, jsonString);
    } catch (error) {
        alert('Errore salvataggio!');
    }
}

// ============================================
// CRUD
// ============================================
function addTodo(title, description = '') {
    if (!title || title.trim() === '') {
        alert('Il titolo è obbligatorio!');
        return false;
    }

    const newTodo = {
        id: todosData.nextId,
        title: title.trim(),
        description: description.trim(),
        completed: false,
        createdAt: new Date().toISOString()
    };

    todosData.todos.push(newTodo);
    todosData.nextId++;

    saveTodos();
    renderTodos();

    return true;
}

function deleteTodo(id) {
    if (!confirm('Sei sicuro di eliminare questa task?')) return;

    todosData.todos = todosData.todos.filter(t => t.id !== id);

    saveTodos();
    renderTodos();
}

function toggleTodo(id) {
    const todo = todosData.todos.find(t => t.id === id);

    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

// ============================================
// RENDERING
// ============================================
function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    const filteredTodos = getFilteredTodos();

    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<p>Nessuna task</p>';
        updateCounter();
        return;
    }

    filteredTodos.forEach(todo => {
        const el = createTodoElement(todo);
        todoList.appendChild(el);
    });

    updateCounter();
}

function createTodoElement(todo) {
    const div = document.createElement('div');
    div.className = `todo-item ${todo.completed ? 'completed' : ''}`;

    div.innerHTML = `
        <input type="checkbox" ${todo.completed ? 'checked' : ''}>
        <div>
            <h3>${escapeHtml(todo.title)}</h3>
            ${todo.description ? `<p>${escapeHtml(todo.description)}</p>` : ''}
            <small>${formatDate(todo.createdAt)}</small>
        </div>
        <button class="delete-btn">Elimina</button>
    `;

    // checkbox
    div.querySelector('input').addEventListener('change', () => {
        toggleTodo(todo.id);
    });

    // delete
    div.querySelector('.delete-btn').addEventListener('click', () => {
        deleteTodo(todo.id);
    });

    return div;
}

// ============================================
// FILTRI
// ============================================
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todosData.todos.filter(t => !t.completed);
        case 'completed':
            return todosData.todos.filter(t => t.completed);
        default:
            return todosData.todos;
    }
}

// ============================================
// CONTATORE
// ============================================
function updateCounter() {
    const count = todosData.todos.filter(t => !t.completed).length;
    const el = document.getElementById('activeCount');

    el.textContent = `${count} task ${count === 1 ? 'attiva' : 'attive'}`;
}

// ============================================
// UTILITÀ
// ============================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(iso) {
    const date = new Date(iso);

    return date.toLocaleDateString('it-IT') + ', ' +
        date.toLocaleTimeString('it-IT', {
            hour: '2-digit',
            minute: '2-digit'
        });
}

// ============================================
// EVENTI
// ============================================
function setupEventListeners() {
    document.getElementById('addBtn').addEventListener('click', handleAddTodo);

    document.getElementById('todoTitle').addEventListener('keypress', e => {
        if (e.key === 'Enter') handleAddTodo();
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilterChange);
    });
}

function handleAddTodo() {
    const titleInput = document.getElementById('todoTitle');
    const descInput = document.getElementById('todoDescription');

    const success = addTodo(titleInput.value, descInput.value);

    if (success) {
        titleInput.value = '';
        descInput.value = '';
        titleInput.focus();
    }
}

function handleFilterChange(e) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    e.target.classList.add('active');

    currentFilter = e.target.dataset.filter;
    renderTodos();
}
