// TODOアプリケーション
class TodoApp {
    constructor() {
        this.todos = this.loadFromStorage();
        this.currentFilter = 'all';
        this.editingId = null;

        this.initElements();
        this.attachEventListeners();
        this.render();
    }

    // DOM要素の初期化
    initElements() {
        this.todoInput = document.getElementById('todoInput');
        this.prioritySelect = document.getElementById('prioritySelect');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.totalCount = document.getElementById('totalCount');
        this.activeCount = document.getElementById('activeCount');
        this.completedCount = document.getElementById('completedCount');
    }

    // イベントリスナーの設定
    attachEventListeners() {
        // 追加ボタン
        this.addBtn.addEventListener('click', () => this.addTodo());

        // Enterキーで追加
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        // フィルタボタン
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentFilter = e.target.dataset.filter;
                this.updateFilterButtons();
                this.render();
            });
        });
    }

    // TODOの追加
    addTodo() {
        const text = this.todoInput.value.trim();

        if (text === '') {
            alert('TODOを入力してください');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            priority: this.prioritySelect.value,
            createdAt: new Date().toISOString()
        };

        this.todos.push(todo);
        this.todoInput.value = '';
        this.saveToStorage();
        this.render();
    }

    // TODOの削除
    deleteTodo(id) {
        if (confirm('このTODOを削除しますか？')) {
            this.todos = this.todos.filter(todo => todo.id !== id);
            this.saveToStorage();
            this.render();
        }
    }

    // TODOの完了状態の切り替え
    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToStorage();
            this.render();
        }
    }

    // TODOの編集開始
    startEdit(id) {
        this.editingId = id;
        this.render();
    }

    // TODOの編集保存
    saveEdit(id, newText) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo && newText.trim() !== '') {
            todo.text = newText.trim();
            this.editingId = null;
            this.saveToStorage();
            this.render();
        }
    }

    // TODOの編集キャンセル
    cancelEdit() {
        this.editingId = null;
        this.render();
    }

    // フィルタリングされたTODOを取得
    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    // フィルタボタンの更新
    updateFilterButtons() {
        this.filterBtns.forEach(btn => {
            if (btn.dataset.filter === this.currentFilter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // 統計の更新
    updateStats() {
        const total = this.todos.length;
        const active = this.todos.filter(todo => !todo.completed).length;
        const completed = this.todos.filter(todo => todo.completed).length;

        this.totalCount.textContent = `全て: ${total}`;
        this.activeCount.textContent = `未完了: ${active}`;
        this.completedCount.textContent = `完了: ${completed}`;
    }

    // 優先度のラベルを取得
    getPriorityLabel(priority) {
        const labels = {
            high: '高',
            medium: '中',
            low: '低'
        };
        return labels[priority] || '中';
    }

    // TODOアイテムのHTML生成
    createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item priority-${todo.priority}`;
        if (todo.completed) {
            li.classList.add('completed');
        }
        if (this.editingId === todo.id) {
            li.classList.add('editing');
        }

        // チェックボックス
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => this.toggleTodo(todo.id));

        // コンテンツ部分
        const content = document.createElement('div');
        content.className = 'todo-content';

        if (this.editingId === todo.id) {
            // 編集モード
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.className = 'todo-edit-input';
            editInput.value = todo.text;

            editInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.saveEdit(todo.id, editInput.value);
                }
            });

            editInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.cancelEdit();
                }
            });

            content.appendChild(editInput);

            setTimeout(() => {
                editInput.focus();
                editInput.select();
            }, 0);
        } else {
            // 通常表示モード
            const text = document.createElement('div');
            text.className = 'todo-text';
            text.textContent = todo.text;

            const priority = document.createElement('div');
            priority.className = `todo-priority priority-${todo.priority}`;
            priority.textContent = `優先度: ${this.getPriorityLabel(todo.priority)}`;

            content.appendChild(text);
            content.appendChild(priority);
        }

        // アクションボタン
        const actions = document.createElement('div');
        actions.className = 'todo-actions';

        if (this.editingId === todo.id) {
            const saveBtn = document.createElement('button');
            saveBtn.className = 'edit-btn';
            saveBtn.textContent = '保存';
            saveBtn.addEventListener('click', () => {
                const input = li.querySelector('.todo-edit-input');
                this.saveEdit(todo.id, input.value);
            });

            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'delete-btn';
            cancelBtn.textContent = 'キャンセル';
            cancelBtn.addEventListener('click', () => this.cancelEdit());

            actions.appendChild(saveBtn);
            actions.appendChild(cancelBtn);
        } else {
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.textContent = '編集';
            editBtn.addEventListener('click', () => this.startEdit(todo.id));

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '削除';
            deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);
        }

        // 全て組み立て
        li.appendChild(checkbox);
        li.appendChild(content);
        li.appendChild(actions);

        return li;
    }

    // レンダリング
    render() {
        // リストをクリア
        this.todoList.innerHTML = '';

        // フィルタリングされたTODOを取得
        const filteredTodos = this.getFilteredTodos();

        if (filteredTodos.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = 'TODOがありません';
            this.todoList.appendChild(emptyMessage);
        } else {
            // 優先度でソート（高→中→低）
            const sortedTodos = [...filteredTodos].sort((a, b) => {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });

            sortedTodos.forEach(todo => {
                const todoElement = this.createTodoElement(todo);
                this.todoList.appendChild(todoElement);
            });
        }

        // 統計の更新
        this.updateStats();
    }

    // LocalStorageに保存
    saveToStorage() {
        try {
            localStorage.setItem('todos', JSON.stringify(this.todos));
        } catch (e) {
            console.error('LocalStorageへの保存に失敗しました:', e);
        }
    }

    // LocalStorageから読み込み
    loadFromStorage() {
        try {
            const data = localStorage.getItem('todos');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('LocalStorageからの読み込みに失敗しました:', e);
            return [];
        }
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
