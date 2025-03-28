class TodoApp {
    constructor() {
        // Set the API URL based on the current environment
        const isProduction = window.location.hostname !== 'localhost';
        this.apiUrl = isProduction
            ? 'https://your-todo-backend.onrender.com/api/todos'  // Replace with your Render URL when you have it
            : 'http://localhost:3000/api/todos';
            
        console.log('API URL:', this.apiUrl); // Debug log
        
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
            if (!response.ok) throw new Error('Failed to load todos');
            const todos = await response.json();
            this.renderTodos(todos);
        } catch (error) {
            console.error('Error loading todos:', error);
            this.showError('Failed to load todos. Please try again later.');
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
                    completed: false
                })
            });

            if (!response.ok) throw new Error('Failed to add todo');
            const newTodo = await response.json();
            this.renderTodo(newTodo);
            this.todoInput.value = '';
        } catch (error) {
            console.error('Error adding todo:', error);
            this.showError('Failed to add todo. Please try again.');
        }
    }

    async toggleTodo(id, completed) {
        try {
            const response = await fetch(`${this.apiUrl}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed })
            });

            if (!response.ok) throw new Error('Failed to update todo');
        } catch (error) {
            console.error('Error updating todo:', error);
            this.showError('Failed to update todo. Please try again.');
        }
    }

    async deleteTodo(id) {
        try {
            const response = await fetch(`${this.apiUrl}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete todo');
        } catch (error) {
            console.error('Error deleting todo:', error);
            this.showError('Failed to delete todo. Please try again.');
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
            <span class="todo-text">${this.escapeHtml(todo.text)}</span>
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

    showError(message) {
        // You could enhance this to show a nice error notification
        alert(message);
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
}); 