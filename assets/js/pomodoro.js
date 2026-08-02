/**
 * pomodoro.js - 番茄钟模块
 * 专注计时 + 成就卡片联动
 */

const Pomodoro = {
  // 默认时长选项（分钟）
  durations: [
    { label: '15', value: 15, emoji: '⚡' },
    { label: '25', value: 25, emoji: '🍅' },
    { label: '45', value: 45, emoji: '🔥' },
    { label: '60', value: 60, emoji: '💎' }
  ],

  // 当前状态
  state: 'idle', // idle | running | paused | break
  totalSeconds: 0,
  remainingSeconds: 0,
  timerId: null,
  taskName: '',
  selectedDuration: 25,
  startTime: null,

  // 获取历史记录
  getHistory() {
    return Store.get('pomodoro_history', []);
  },

  saveHistory(record) {
    const history = this.getHistory();
    history.unshift(record);
    // 只保留最近100条
    if (history.length > 100) history.length = 100;
    Store.set('pomodoro_history', history);
  },

  // 获取今日完成数
  getTodayCount() {
    const today = Store.today();
    return this.getHistory().filter(h => h.date === today).length;
  },

  // 获取总完成数
  getTotalCount() {
    return this.getHistory().length;
  },

  // 格式化时间 mm:ss
  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  },

  // 开始计时
  start(taskName, durationMinutes) {
    this.taskName = taskName || '专注任务';
    this.selectedDuration = durationMinutes || 25;
    this.totalSeconds = this.selectedDuration * 60;
    this.remainingSeconds = this.totalSeconds;
    this.state = 'running';
    this.startTime = new Date().toISOString();

    this.tick();
    this.timerId = setInterval(() => this.tick(), 1000);
    this.renderRunning();
  },

  // 计时滴答
  tick() {
    if (this.state !== 'running') return;
    this.remainingSeconds--;

    // 更新显示
    const timeEl = document.getElementById('pomoTime');
    const progressEl = document.getElementById('pomoProgress');
    if (timeEl) timeEl.textContent = this.formatTime(this.remainingSeconds);
    if (progressEl) {
      const pct = ((this.totalSeconds - this.remainingSeconds) / this.totalSeconds) * 100;
      progressEl.style.strokeDashoffset = 283 - (283 * pct / 100);
    }

    // 更新标题
    document.title = `${this.formatTime(this.remainingSeconds)} · ${this.taskName}`;

    if (this.remainingSeconds <= 0) {
      this.complete();
    }
  },

  // 暂停
  pause() {
    if (this.state !== 'running') return;
    this.state = 'paused';
    clearInterval(this.timerId);
    this.renderRunning();
  },

  // 恢复
  resume() {
    if (this.state !== 'paused') return;
    this.state = 'running';
    this.timerId = setInterval(() => this.tick(), 1000);
    this.renderRunning();
  },

  // 放弃
  abort() {
    clearInterval(this.timerId);
    this.state = 'idle';
    this.remainingSeconds = 0;
    document.title = 'abby 工作台 🌊';
    this.renderIdle();
  },

  // 完成
  complete() {
    clearInterval(this.timerId);
    this.state = 'break';
    document.title = '完成！🎉 · abby 工作台';

    // 保存记录
    const record = {
      id: Store.uuid(),
      taskName: this.taskName,
      duration: this.selectedDuration,
      date: Store.today(),
      time: Store.nowTime(),
      completedAt: new Date().toISOString()
    };
    this.saveHistory(record);

    // 触发打卡（自动打卡到番茄钟任务）
    this.autoCheckin(record);

    // 播放完成动画
    this.renderComplete(record);
  },

  // 自动打卡到番茄钟任务
  autoCheckin(record) {
    // 查找或创建番茄钟打卡任务
    let tasks = Checkin.getTasks();
    let pomoTask = tasks.find(t => t.id === 'pomodoro');

    if (!pomoTask) {
      pomoTask = {
        id: 'pomodoro',
        name: '番茄钟',
        emoji: '🍅',
        color: '#FF6B35',
        fields: [
          { key: 'task', label: '专注内容', type: 'text', placeholder: '做了什么？' },
          { key: 'duration', label: '时长（分钟）', type: 'number', placeholder: '25' }
        ]
      };
      tasks.push(pomoTask);
      Checkin.saveTasks(tasks);
    }

    // 执行打卡
    Checkin.doCheckin('pomodoro', {
      task: record.taskName,
      duration: String(record.duration)
    });

    // 更新连续打卡
    Checkin.updateStreak();

    // 刷新首页和打卡页
    if (typeof Home !== 'undefined') Home.render();
  },

  // 渲染番茄钟页面
  renderPage() {
    const el = document.getElementById('page-pomodoro');
    if (!el) return;

    if (this.state === 'idle') {
      this.renderIdle();
    } else if (this.state === 'running' || this.state === 'paused') {
      this.renderRunning();
    } else if (this.state === 'break') {
      // 保持完成状态
    }
  },

  // 空闲状态 - 设置界面
  renderIdle() {
    const el = document.getElementById('page-pomodoro');
    const todayCount = this.getTodayCount();
    const totalCount = this.getTotalCount();
    const history = this.getHistory().slice(0, 5);

    let historyHtml = '';
    if (history.length > 0) {
      historyHtml = history.map(h => `
        <div class="flex-between" style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.3);">
          <div>
            <div style="font-size:14px;color:var(--text-primary);">${h.taskName}</div>
            <div style="font-size:11px;color:var(--text-muted);">${h.date} ${h.time}</div>
          </div>
          <div class="tag tag-coral">${h.duration}min</div>
        </div>
      `).join('');
    }

    el.innerHTML = `
      <div class="card text-center" style="background:linear-gradient(135deg,rgba(255,107,53,0.12),rgba(27,231,255,0.08));">
        <div style="font-size:48px;">🍅</div>
        <div style="font-size:36px;font-weight:900;color:#E55A2B;">${todayCount}</div>
        <div style="font-size:14px;color:var(--text-secondary);">今日番茄钟</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">累计完成 ${totalCount} 个</div>
      </div>

      <div class="card">
        <div class="card-title"><span class="card-icon">🎯</span>开始专注</div>
        <label>我要做什么</label>
        <input type="text" class="input" id="pomoTaskName" placeholder="例如：写代码、看书、背单词..." maxlength="30" onkeypress="if(event.key==='Enter')Pomodoro.startFromForm()">

        <label style="margin-top:16px;">专注时长</label>
        <div class="grid-4" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;">
          ${this.durations.map(d => `
            <div class="duration-option ${d.value === 25 ? 'active' : ''}" data-duration="${d.value}" onclick="Pomodoro.selectDuration(${d.value})">
              <div style="font-size:24px;">${d.emoji}</div>
              <div style="font-size:18px;font-weight:800;color:var(--text-primary);">${d.label}</div>
              <div style="font-size:11px;color:var(--text-muted);">分钟</div>
            </div>
          `).join('')}
        </div>

        <button class="btn btn-primary btn-block btn-lg" id="pomoStartBtn" onclick="Pomodoro.startFromForm()">
          🚀 开始专注
        </button>
      </div>

      ${historyHtml ? `<div class="card"><div class="card-title"><span class="card-icon">📜</span>最近记录</div>${historyHtml}</div>` : ''}
    `;
  },

  // 选择时长
  selectDuration(minutes) {
    this.selectedDuration = minutes;
    document.querySelectorAll('.duration-option').forEach(el => {
      el.classList.toggle('active', parseInt(el.dataset.duration) === minutes);
    });
  },

  // 从表单开始
  startFromForm() {
    const input = document.getElementById('pomoTaskName');
    const taskName = input ? input.value.trim() : '';
    if (!taskName) {
      UI.toast('请输入专注内容');
      return;
    }
    this.start(taskName, this.selectedDuration);
  },

  // 运行中界面
  renderRunning() {
    const el = document.getElementById('page-pomodoro');
    const isPaused = this.state === 'paused';
    const pct = ((this.totalSeconds - this.remainingSeconds) / this.totalSeconds) * 100;
    const dashOffset = 283 - (283 * pct / 100);

    el.innerHTML = `
      <div class="card text-center" style="padding:32px 20px;">
        <div style="font-size:14px;color:var(--text-muted);margin-bottom:16px;">
          ${isPaused ? '⏸️ 已暂停' : '🔥 专注中'}
        </div>
        <div style="font-size:16px;color:var(--text-primary);font-weight:700;margin-bottom:24px;">
          ${this.taskName}
        </div>

        <!-- 圆形进度条 -->
        <div style="position:relative;width:220px;height:220px;margin:0 auto 32px;">
          <svg width="220" height="220" viewBox="0 0 100 100" style="transform:rotate(-90deg);">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="6"/>
            <circle id="pomoProgress" cx="50" cy="50" r="45" fill="none" stroke="#E55A2B" stroke-width="6"
              stroke-linecap="round" stroke-dasharray="283" stroke-dashoffset="${dashOffset}"
              style="transition:stroke-dashoffset 0.3s;filter:drop-shadow(0 0 8px rgba(255,107,53,0.5));"/>
          </svg>
          <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
            <div id="pomoTime" style="font-size:48px;font-weight:900;color:var(--text-primary);font-family:var(--font-pixel);letter-spacing:2px;">
              ${this.formatTime(this.remainingSeconds)}
            </div>
            <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">
              / ${this.selectedDuration}分钟
            </div>
          </div>
        </div>

        <!-- 控制按钮 -->
        <div class="flex" style="justify-content:center;gap:16px;">
          ${isPaused ? `
            <button class="btn btn-primary btn-lg" onclick="Pomodoro.resume()" style="min-width:120px;">
              ▶ 继续
            </button>
          ` : `
            <button class="btn btn-secondary btn-lg" onclick="Pomodoro.pause()" style="min-width:120px;">
              ⏸ 暂停
            </button>
          `}
          <button class="btn btn-ghost" onclick="Pomodoro.abort()" style="color:#D64545;">
            ✕ 放弃
          </button>
        </div>
      </div>

      <div class="card text-center" style="font-size:13px;color:var(--text-muted);">
        💡 小贴士：保持专注，完成后会自动打卡并有机会解锁海洋生物卡片！
      </div>
    `;
  },

  // 完成界面
  renderComplete(record) {
    const el = document.getElementById('page-pomodoro');
    const todayCount = this.getTodayCount();

    // 检查解锁
    const streak = Checkin.getStreak();
    const unlocked = Store.get('unlocked_fish', []);
    const newUnlocks = Checkin.fishCollection.filter(f =>
      streak.count >= f.unlockAt && !unlocked.find(u => u.id === f.id)
    );

    el.innerHTML = `
      <div class="card text-center" style="padding:40px 20px;background:linear-gradient(135deg,rgba(255,107,53,0.15),rgba(127,255,208,0.1));">
        <div style="font-size:64px;animation:bounce 1s ease infinite;">🎉</div>
        <div style="font-size:24px;font-weight:900;color:var(--text-primary);margin-top:16px;">
          专注完成！
        </div>
        <div style="font-size:16px;color:var(--text-secondary);margin-top:8px;">
          「${record.taskName}」<br>
          专注了 ${record.duration} 分钟
        </div>
        <div style="font-size:14px;color:#E55A2B;margin-top:12px;font-weight:700;">
          今日已完成 ${todayCount} 个番茄钟
        </div>
        ${newUnlocks.length > 0 ? `<div style="font-size:13px;color:#D4A000;margin-top:8px;">✨ 解锁了 ${newUnlocks.length} 张新卡片！</div>` : ''}
        <button class="btn btn-primary btn-block mt-24" onclick="Pomodoro.renderIdle()">
          再来一个
        </button>
      </div>
    `;

    // 如果有新解锁，显示闪卡动画
    if (newUnlocks.length > 0) {
      setTimeout(() => Checkin.showUnlockAnimation(newUnlocks), 500);
    }
  }
};

// 时长选择卡片样式
const pomoStyle = document.createElement('style');
pomoStyle.textContent = `
  .duration-option {
    background: rgba(255,255,255,0.06);
    border: 2px solid rgba(255,255,255,0.15);
    border-radius: 16px;
    padding: 12px 8px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
  }
  .duration-option:hover {
    background: rgba(255,255,255,0.12);
    border-color: rgba(255,255,255,0.3);
    transform: translateY(-2px);
  }
  .duration-option.active {
    background: rgba(255,107,53,0.2);
    border-color: #E55A2B;
    box-shadow: 0 0 16px rgba(255,107,53,0.3);
  }
`;
document.head.appendChild(pomoStyle);

// 暴露到全局
window.Pomodoro = Pomodoro;
