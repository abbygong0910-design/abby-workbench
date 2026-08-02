/**
 * todo.js - 待办清单模块
 */

const Todo = {
  getTodos() {
    return Store.get('todos', []);
  },

  saveTodos(todos) {
    Store.set('todos', todos);
  },

  add(text, priority = 'normal', dueDate = null) {
    const todos = this.getTodos();
    const todo = {
      id: Store.uuid(),
      text: text,
      priority: priority,
      done: false,
      dueDate: dueDate,
      createdAt: new Date().toISOString()
    };
    todos.unshift(todo);
    this.saveTodos(todos);
    return todo;
  },

  toggle(id) {
    const todos = this.getTodos();
    const todo = todos.find(t => t.id === id);
    if (todo) {
      todo.done = !todo.done;
      if (todo.done) todo.completedAt = new Date().toISOString();
      this.saveTodos(todos);
    }
  },

  remove(id) {
    const todos = this.getTodos().filter(t => t.id !== id);
    this.saveTodos(todos);
  },

  getPendingCount() {
    return this.getTodos().filter(t => !t.done).length;
  },

  priorityConfig(p) {
    return {
      high: { text: '高', color: '#D64545', icon: '🔴' },
      normal: { text: '中', color: '#D4A000', icon: '🟡' },
      low: { text: '低', color: '#2D9D5B', icon: '🟢' }
    }[p] || { text: '中', color: '#D4A000', icon: '🟡' };
  },

  renderPage() {
    const el = document.getElementById('page-todo');
    const todos = this.getTodos();
    const pending = todos.filter(t => !t.done);
    const completed = todos.filter(t => t.done);

    const renderTodo = t => {
      const pc = this.priorityConfig(t.priority);
      const dueText = t.dueDate ? `<span class="tag tag-coral" style="margin-left:8px;">📅 ${t.dueDate}</span>` : '';
      return `
        <div class="card" style="padding:12px 16px;${t.done ? 'opacity:0.5;' : ''}">
          <div class="flex" style="align-items:flex-start;gap:12px;">
            <div onclick="Todo.toggle('${t.id}')" style="cursor:pointer;font-size:22px;margin-top:2px;">
              ${t.done ? '✅' : '⬜'}
            </div>
            <div style="flex:1;">
              <div style="font-size:15px;color:var(--text-primary);text-decoration:${t.done?'line-through':'none'};">${t.text}</div>
              <div style="margin-top:4px;font-size:12px;">
                <span style="color:${pc.color}">${pc.icon} ${pc.text}</span>
                ${dueText}
              </div>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="Todo.remove('${t.id}');Todo.renderPage();Home.render()">🗑</button>
          </div>
        </div>
      `;
    };

    el.innerHTML = `
      <div class="card">
        <div class="card-title"><span class="card-icon">✏️</span>新建待办</div>
        <div class="form-row">
          <input type="text" class="input" id="newTodoText" placeholder="今天要做什么？" onkeypress="if(event.key==='Enter')Todo.addFromForm()">
          <select class="select" id="newTodoPriority" style="width:auto;">
            <option value="normal">🟡 中</option>
            <option value="high">🔴 高</option>
            <option value="low">🟢 低</option>
          </select>
        </div>
        <input type="date" class="input mt-8" id="newTodoDate" placeholder="截止日期（可选）" style="color-scheme:dark;">
        <button class="btn btn-primary btn-block mt-8" onclick="Todo.addFromForm()">+ 添加</button>
      </div>

      ${pending.length > 0 ? `<div class="card-title mt-16"><span class="card-icon">📋</span>待完成 (${pending.length})</div>${pending.map(renderTodo).join('')}` : ''}

      ${completed.length > 0 ? `<div class="card-title mt-16"><span class="card-icon">✅</span>已完成 (${completed.length})</div>${completed.map(renderTodo).join('')}` : ''}

      ${todos.length === 0 ? '<div class="empty-state"><div class="empty-state-icon">📋</div>暂无待办，享受深海吧 🐟</div>' : ''}
    `;
  },

  addFromForm() {
    const text = document.getElementById('newTodoText').value.trim();
    if (!text) {
      UI.toast('请输入待办内容');
      return;
    }
    const priority = document.getElementById('newTodoPriority').value;
    const dueDate = document.getElementById('newTodoDate').value || null;
    this.add(text, priority, dueDate);
    this.renderPage();
    Home.render();
  }
};
