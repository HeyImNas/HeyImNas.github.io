class TodoApp {
    constructor() {
        // DOM elements
        this.todoInput = document.getElementById('todoInput');
        this.addTodoBtn = document.getElementById('addTodoBtn');
        this.todoList = document.getElementById('todoList');
        this.tagFilter = document.getElementById('tagFilter');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.darkModeToggle = document.getElementById('darkModeToggle');
        
        // State
        this.todos = JSON.parse(localStorage.getItem('todos') || '[]');
        this.tags = this.extractTags();
        this.categories = this.extractCategories();
        this.darkMode = localStorage.getItem('darkMode') === 'true';
        
        this.setupEventListeners();
        this.renderTodos();
        this.updateFilters();
        this.applyTheme();
    }

    setupEventListeners() {
        this.addTodoBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        if (this.tagFilter) {
            this.tagFilter.addEventListener('change', () => this.filterTodos());
        }
        
        if (this.categoryFilter) {
            this.categoryFilter.addEventListener('change', () => this.filterTodos());
        }
        
        if (this.darkModeToggle) {
            this.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
        }
    }
    
    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        localStorage.setItem('darkMode', this.darkMode);
        this.applyTheme();
    }
    
    applyTheme() {
        if (this.darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            this.darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            this.darkModeToggle.title = 'Switch to light mode';
        } else {
            document.documentElement.removeAttribute('data-theme');
            this.darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            this.darkModeToggle.title = 'Switch to dark mode';
        }
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;
        
        const newTodo = {
            id: Date.now().toString(),
            text,
            completed: false,
            tags: [],
            category: '',
            createdAt: new Date().toISOString()
        };
        
        this.todos.unshift(newTodo);
        this.saveTodos();
        this.renderTodo(newTodo);
        this.todoInput.value = '';
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.updateFilters();
    }

    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
        }
    }

    editTodo(id, newText) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.text = newText;
            this.saveTodos();
        }
    }

    addTag(id, tag) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo && tag && !todo.tags.includes(tag)) {
            todo.tags.push(tag);
            this.saveTodos();
            this.updateFilters();
        }
    }

    removeTag(id, tag) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.tags = todo.tags.filter(t => t !== tag);
            this.saveTodos();
            this.updateFilters();
        }
    }

    setCategory(id, category) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.category = category;
            this.saveTodos();
            this.updateFilters();
        }
    }

    extractTags() {
        const tags = new Set();
        this.todos.forEach(todo => {
            todo.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags);
    }

    extractCategories() {
        const categories = new Set();
        this.todos.forEach(todo => {
            if (todo.category) categories.add(todo.category);
        });
        return Array.from(categories);
    }

    updateFilters() {
        this.tags = this.extractTags();
        this.categories = this.extractCategories();
        
        if (this.tagFilter) {
            const selectedTag = this.tagFilter.value;
            this.tagFilter.innerHTML = '<option value="">All Tags</option>';
            this.tags.forEach(tag => {
                const option = document.createElement('option');
                option.value = tag;
                option.textContent = tag;
                this.tagFilter.appendChild(option);
            });
            this.tagFilter.value = selectedTag;
        }
        
        if (this.categoryFilter) {
            const selectedCategory = this.categoryFilter.value;
            this.categoryFilter.innerHTML = '<option value="">All Categories</option>';
            this.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                this.categoryFilter.appendChild(option);
            });
            this.categoryFilter.value = selectedCategory;
        }
    }

    filterTodos() {
        const selectedTag = this.tagFilter ? this.tagFilter.value : '';
        const selectedCategory = this.categoryFilter ? this.categoryFilter.value : '';
        
        const filteredTodos = this.todos.filter(todo => {
            const matchesTag = !selectedTag || todo.tags.includes(selectedTag);
            const matchesCategory = !selectedCategory || todo.category === selectedCategory;
            return matchesTag && matchesCategory;
        });
        
        this.renderTodos(filteredTodos);
    }

    renderTodos(todosToRender = this.todos) {
        this.todoList.innerHTML = '';
        todosToRender.forEach(todo => this.renderTodo(todo));
    }

    renderTodo(todo) {
        const todoItem = document.createElement('div');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        todoItem.dataset.id = todo.id;
        
        // Main content
        const content = document.createElement('div');
        content.className = 'todo-content';
        
        // Text that can be edited
        const todoText = document.createElement('span');
        todoText.className = 'todo-text';
        todoText.textContent = todo.text;
        todoText.addEventListener('dblclick', () => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = todo.text;
            input.className = 'edit-input';
            
            const saveEdit = () => {
                const newText = input.value.trim();
                if (newText) {
                    this.editTodo(todo.id, newText);
                    todoText.textContent = newText;
                }
                content.replaceChild(todoText, input);
            };
            
            input.addEventListener('blur', saveEdit);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') saveEdit();
            });
            
            content.replaceChild(input, todoText);
            input.focus();
        });
        content.appendChild(todoText);
        
        // Category and tags
        if (todo.category || todo.tags.length > 0) {
            const metaInfo = document.createElement('div');
            metaInfo.className = 'todo-meta';
            
            if (todo.category) {
                const category = document.createElement('span');
                category.className = 'todo-category';
                category.textContent = todo.category;
                metaInfo.appendChild(category);
            }
            
            todo.tags.forEach(tag => {
                const tagEl = document.createElement('span');
                tagEl.className = 'todo-tag';
                tagEl.textContent = tag;
                tagEl.addEventListener('click', () => {
                    this.removeTag(todo.id, tag);
                    todoItem.querySelector(`.todo-tag[data-tag="${tag}"]`).remove();
                });
                tagEl.dataset.tag = tag;
                metaInfo.appendChild(tagEl);
            });
            
            content.appendChild(metaInfo);
        }
        
        todoItem.appendChild(content);
        
        // Action buttons
        const actions = document.createElement('div');
        actions.className = 'todo-actions';
        
        // Toggle complete button
        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-btn';
        completeBtn.innerHTML = `<i class="fas ${todo.completed ? 'fa-times' : 'fa-check'}"></i>`;
        completeBtn.title = todo.completed ? 'Mark as incomplete' : 'Mark as complete';
        completeBtn.addEventListener('click', () => {
            this.toggleTodo(todo.id);
            todoItem.classList.toggle('completed');
            completeBtn.innerHTML = `<i class="fas ${todoItem.classList.contains('completed') ? 'fa-times' : 'fa-check'}"></i>`;
            completeBtn.title = todoItem.classList.contains('completed') ? 'Mark as incomplete' : 'Mark as complete';
        });
        actions.appendChild(completeBtn);
        
        // Tag button
        const tagBtn = document.createElement('button');
        tagBtn.className = 'tag-btn';
        tagBtn.innerHTML = `<i class="fas fa-tag"></i>`;
        tagBtn.title = 'Add tag';
        tagBtn.addEventListener('click', () => {
            const tag = prompt('Enter a tag:');
            if (tag && tag.trim()) {
                this.addTag(todo.id, tag.trim());
                this.updateFilters();
                this.renderTodos();
            }
        });
        actions.appendChild(tagBtn);
        
        // Category button
        const categoryBtn = document.createElement('button');
        categoryBtn.className = 'category-btn';
        categoryBtn.innerHTML = `<i class="fas fa-folder"></i>`;
        categoryBtn.title = 'Set category';
        categoryBtn.addEventListener('click', () => {
            const category = prompt('Enter a category:');
            if (category !== null) {
                this.setCategory(todo.id, category.trim());
                this.updateFilters();
                this.renderTodos();
            }
        });
        actions.appendChild(categoryBtn);
        
        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;
        deleteBtn.title = 'Delete todo';
        deleteBtn.addEventListener('click', () => {
            this.deleteTodo(todo.id);
            todoItem.remove();
        });
        actions.appendChild(deleteBtn);
        
        todoItem.appendChild(actions);
        this.todoList.appendChild(todoItem);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
}); 