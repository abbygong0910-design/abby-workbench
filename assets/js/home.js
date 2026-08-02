/**
 * home.js - 首页工作台
 */

const Home = {
  async render() {
    const el = document.getElementById('page-home');
    const today = Store.today();
    const tasks = Checkin.getTasks();
    const todayRecords = Checkin.getTodayRecords();
    const streak = Checkin.getStreak();
    const pendingTodos = Todo.getPendingCount();
    const financeStats = Finance.monthStats();

    // 天气卡片
    const weatherCard = await Weather.renderHomeCard();

    // 打卡卡片
    const checkinCards = tasks.map(task => {
      const record = todayRecords.find(r => r.taskId === task.id);
      const done = !!record;
      let detail = '';
      if (done && record.data) {
        const firstVal = Object.values(record.data)[0];
        detail = firstVal ? ` · ${firstVal}` : '';
      }
      return `
        <div class="card checkin-card ${done ? 'completed' : ''}" style="padding:12px 16px;" ${done ? `onclick="Checkin.viewRecord('${record.id}')"` : `onclick="Checkin.openCheckinForm('${task.id}')"`}>
          <div class="flex-between">
            <div class="flex" style="align-items:center;gap:12px;">
              <div style="font-size:28px;">${task.emoji}</div>
              <div>
                <div style="font-size:15px;font-weight:700;color:var(--text-primary);">${task.name}</div>
                <div style="font-size:11px;color:var(--text-muted);">${done ? '已完成'+detail : '今日未打卡'}</div>
              </div>
            </div>
            <div style="font-size:20px;">${done ? '✅' : '⭕'}</div>
          </div>
        </div>
      `;
    }).join('');

    const doneCount = todayRecords.length;
    const totalCount = tasks.length;
    const progress = totalCount > 0 ? Math.round(doneCount / totalCount * 100) : 0;

    el.innerHTML = `
      <!-- 顶部欢迎 -->
      <div class="card" style="background:linear-gradient(135deg,rgba(255,107,53,0.12),rgba(27,231,255,0.08));">
        <div style="font-size:14px;color:var(--text-secondary);">${Store.greeting()}</div>
        <div style="font-size:24px;font-weight:900;color:var(--text-primary);margin-top:4px;">Hi abby 👋</div>
        <div style="font-size:13px;color:var(--text-muted);margin-top:4px;">${Store.formatDate(new Date())}</div>
      </div>

      <!-- 天气 -->
      ${weatherCard}

      <!-- 今日概览 -->
      <div class="card">
        <div class="card-title"><span class="card-icon">📊</span>今日概览</div>
        <div class="grid-3" style="text-align:center;">
          <div onclick="App.navigate('todo')" style="cursor:pointer;">
            <div style="font-size:24px;font-weight:900;color:${pendingTodos > 0 ? '#E55A2B' : '#2D9D5B'}">${pendingTodos}</div>
            <div style="font-size:12px;color:var(--text-muted)">待办</div>
          </div>
          <div onclick="App.navigate('finance')" style="cursor:pointer;">
            <div style="font-size:24px;font-weight:900;color:${financeStats.balance >= 0 ? 'var(--aqua-dark)' : '#E55A2B'}">${financeStats.balance.toFixed(0)}</div>
            <div style="font-size:12px;color:var(--text-muted)">本月结余</div>
          </div>
          <div onclick="App.navigate('checkin')" style="cursor:pointer;">
            <div style="font-size:24px;font-weight:900;color:#E55A2B">${streak.count}</div>
            <div style="font-size:12px;color:var(--text-muted)">连续打卡</div>
          </div>
        </div>
      </div>

      <!-- 今日打卡进度 -->
      <div class="card">
        <div class="flex-between mb-16">
          <div class="card-title" style="margin:0;"><span class="card-icon">🔥</span>今日打卡</div>
          <div style="font-size:13px;color:var(--text-secondary);">${doneCount}/${totalCount}</div>
        </div>
        <div style="background:rgba(255,248,231,0.1);border-radius:12px;height:8px;overflow:hidden;margin-bottom:16px;">
          <div style="background:linear-gradient(90deg,#E55A2B,#D4A000);height:100%;width:${progress}%;border-radius:12px;transition:width 0.5s;"></div>
        </div>
        ${checkinCards || '<div class="empty-state"><div class="empty-state-icon">📋</div>暂无打卡任务</div>'}
      </div>

      <!-- 快捷入口 -->
      <div class="card">
        <div class="card-title"><span class="card-icon">🧭</span>快捷入口</div>
        <div class="grid-3">
          <div class="card" style="padding:16px;text-align:center;cursor:pointer;" onclick="App.navigate('pomodoro')">
            <div style="font-size:28px;">🍅</div>
            <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">番茄钟</div>
          </div>
          <div class="card" style="padding:16px;text-align:center;cursor:pointer;" onclick="App.navigate('todo')">
            <div style="font-size:28px;">📋</div>
            <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">待办</div>
          </div>
          <div class="card" style="padding:16px;text-align:center;cursor:pointer;" onclick="App.navigate('finance')">
            <div style="font-size:28px;">💰</div>
            <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">记账</div>
          </div>
        </div>
      </div>
    `;
  }
};
