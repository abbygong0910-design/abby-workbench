/**
 * calendar.js - 日历模块
 */

const Calendar = {
  viewDate: new Date(),

  renderPage() {
    const el = document.getElementById('page-calendar');
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = Store.today();
    const todayDate = new Date(today);

    // 获取有事件的日子
    const todos = Todo.getTodos();
    const records = Checkin.getAllRecords();
    const finances = Finance.getRecords();

    const eventDates = new Set();
    todos.forEach(t => {
      if (t.dueDate) eventDates.add(t.dueDate);
      if (t.done && t.completedAt) eventDates.add(t.completedAt.slice(0, 10));
    });
    records.forEach(r => eventDates.add(r.date));
    finances.forEach(r => eventDates.add(r.date));

    const weekdays = ['日','一','二','三','四','五','六'];
    let cells = '';

    // 星期表头
    weekdays.forEach(w => {
      cells += `<div style="text-align:center;font-size:13px;color:var(--text-muted);padding:8px 0;font-weight:700;">${w}</div>`;
    });

    // 空白
    for (let i = 0; i < firstDay; i++) {
      cells += '<div></div>';
    }

    // 日期
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const isToday = dateStr === today;
      const hasEvent = eventDates.has(dateStr);
      const dayRecords = records.filter(r => r.date === dateStr);
      const dayFinances = finances.filter(r => r.date === dateStr);
      const dayTodos = todos.filter(t => t.dueDate === dateStr);

      const dotStyle = 'width:5px;height:5px;border-radius:50%;display:inline-block;';
      let dots = [];
      if (dayRecords.length > 0) dots.push(`<span style="${dotStyle}background:#E55A2B;"></span>`);
      if (dayFinances.length > 0) dots.push(`<span style="${dotStyle}background:#D4A000;"></span>`);
      if (dayTodos.length > 0) dots.push(`<span style="${dotStyle}background:var(--aqua-dark);"></span>`);

      cells += `
        <div onclick="Calendar.selectDate('${dateStr}')" style="
          text-align:center;
          padding:8px 0 12px 0;
          cursor:pointer;
          border-radius:8px;
          position:relative;
          ${isToday ? 'background:#E55A2B;color:white;font-weight:800;' : 'color:var(--text-primary);'}
        ">
          ${d}
          ${dots.length > 0 ? `<div class="flex" style="justify-content:center;gap:3px;position:absolute;bottom:4px;left:0;right:0;">${dots.join('')}</div>` : ''}
        </div>
      `;
    }

    const monthName = `${year}年${month+1}月`;

    el.innerHTML = `
      <div class="card">
        <div class="flex-between mb-16">
          <button class="btn btn-secondary btn-sm" onclick="Calendar.prevMonth()">‹</button>
          <div style="font-size:18px;font-weight:800;color:var(--text-primary);">${monthName}</div>
          <button class="btn btn-secondary btn-sm" onclick="Calendar.nextMonth()">›</button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;">
          ${cells}
        </div>
        <div class="flex" style="justify-content:center;gap:16px;margin-top:16px;font-size:11px;color:var(--text-muted)">
          <span>🔴 打卡</span><span>🟡 记账</span><span>🔵 待办</span>
        </div>
      </div>

      <div class="card">
        <div class="card-title"><span class="card-icon">📌</span>今日待办</div>
        ${this.renderTodayTodos()}
      </div>
    `;
  },

  renderTodayTodos() {
    const today = Store.today();
    const todos = Todo.getTodos().filter(t => !t.done && (!t.dueDate || t.dueDate === today));
    if (todos.length === 0) return '<div style="color:var(--text-muted);font-size:13px;">今日无待办 ✨</div>';
    return todos.map(t => `
      <div class="flex-between" style="padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.3);">
        <span style="font-size:14px;color:var(--text-primary);">${t.text}</span>
        <span style="font-size:12px;color:var(--text-muted);">${Todo.priorityConfig(t.priority).icon}</span>
      </div>
    `).join('');
  },

  prevMonth() {
    this.viewDate.setMonth(this.viewDate.getMonth() - 1);
    this.renderPage();
  },

  nextMonth() {
    this.viewDate.setMonth(this.viewDate.getMonth() + 1);
    this.renderPage();
  },

  selectDate(dateStr) {
    const todos = Todo.getTodos().filter(t => t.dueDate === dateStr);
    const records = Checkin.getAllRecords().filter(r => r.date === dateStr);
    const finances = Finance.getRecords().filter(r => r.date === dateStr);

    let html = `<div class="modal-header">
      <div class="modal-title">📅 ${dateStr}</div>
      <button class="modal-close" onclick="UI.closeModal()">×</button>
    </div>`;

    if (todos.length === 0 && records.length === 0 && finances.length === 0) {
      html += '<div class="empty-state"><div class="empty-state-icon">🌊</div>这一天风平浪静</div>';
    } else {
      if (records.length > 0) {
        html += '<div class="card-title"><span class="card-icon">🔥</span>打卡记录</div>';
        html += records.map(r => `<div class="flex-between" style="padding:6px 0;font-size:14px;"><span>${r.emoji} ${r.taskName}</span><span style="color:var(--text-muted);font-size:12px;">${r.time}</span></div>`).join('');
      }
      if (finances.length > 0) {
        html += '<div class="card-title mt-16"><span class="card-icon">💰</span>收支记录</div>';
        html += finances.map(r => {
          const cat = Finance.getCategory(r.type, r.category);
          return `<div class="flex-between" style="padding:6px 0;font-size:14px;"><span>${cat.emoji} ${cat.name} ${r.note||''}</span><span style="color:${r.type==='income'?'#2D9D5B':'#E55A2B'};">${r.type==='income'?'+':'-'}${r.amount}</span></div>`;
        }).join('');
      }
      if (todos.length > 0) {
        html += '<div class="card-title mt-16"><span class="card-icon">📋</span>待办</div>';
        html += todos.map(t => `<div style="padding:6px 0;font-size:14px;color:var(--text-primary);${t.done?'text-decoration:line-through;opacity:0.5;':''}">${t.done?'✅':'⬜'} ${t.text}</div>`).join('');
      }
    }

    UI.modal(html);
  }
};
