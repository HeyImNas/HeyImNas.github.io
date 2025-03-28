class TodoApp {
    constructor() {
        // Replace this with your Railway deployment URL when deployed
        this.apiUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:3000/api/todos'
            : 'https://your-railway-app-name.railway.app/api/todos'; // You'll update this URL once deployed
        this.todoInput = document.getElementById('todoInput');
        this.addTodoBtn = document.getElementById('addTodoBtn');
        this.todoList = document.getElementById('todoList');
        
        this.setupEventListeners();
        this.loadTodos();
    }

    setupEventListeners() {
        this.addTodoBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });
    }

    async loadTodos() {
        try {
            const response = await fetch(this.apiUrl);
            const todos = await response.json();
            this.renderTodos(todos);
        } catch (error) {
            console.error('Error loading todos:', error);
        }
    }

    async addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    completed: false,
                    createdAt: new Date().toISOString()
                })
            });

            const newTodo = await response.json();
            this.renderTodo(newTodo);
            this.todoInput.value = '';
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    }

    async toggleTodo(id, completed) {
        try {
            await fetch(`${this.apiUrl}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed })
            });
        } catch (error) {
            console.error('Error toggling todo:', error);
        }
    }

    async deleteTodo(id) {
        try {
            await fetch(`${this.apiUrl}/${id}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    }

    renderTodos(todos) {
        this.todoList.innerHTML = '';
        todos.forEach(todo => this.renderTodo(todo));
    }

    renderTodo(todo) {
        const todoItem = document.createElement('div');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        todoItem.innerHTML = `
            <span class="todo-text">${todo.text}</span>
            <div class="todo-actions">
                <button class="complete-btn" title="${todo.completed ? 'Mark as incomplete' : 'Mark as complete'}">
                    <i class="fas ${todo.completed ? 'fa-times' : 'fa-check'}"></i>
                </button>
                <button class="delete-btn" title="Delete todo">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        const completeBtn = todoItem.querySelector('.complete-btn');
        const deleteBtn = todoItem.querySelector('.delete-btn');

        completeBtn.addEventListener('click', async () => {
            const newCompleted = !todo.completed;
            await this.toggleTodo(todo.id, newCompleted);
            todoItem.classList.toggle('completed');
            completeBtn.innerHTML = `<i class="fas ${newCompleted ? 'fa-times' : 'fa-check'}"></i>`;
            completeBtn.title = newCompleted ? 'Mark as incomplete' : 'Mark as complete';
        });

        deleteBtn.addEventListener('click', async () => {
            await this.deleteTodo(todo.id);
            todoItem.remove();
        });

        this.todoList.appendChild(todoItem);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
}); 