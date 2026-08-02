/**
 * app.js - 主应用控制器 + UI 工具
 */

// UI 工具
const UI = {
  modal(html) {
    document.getElementById('modalContent').innerHTML = html;
    document.getElementById('modalOverlay').classList.add('show');
  },
  closeModal() {
    document.getElementById('modalOverlay').classList.remove('show');
  },
  toast(msg, duration = 2000) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => t.classList.remove('show'), duration);
  },
  confirm(msg, onConfirm) {
    this.modal(`
      <div class="modal-header">
        <div class="modal-title">⚠️ 确认</div>
        <button class="modal-close" onclick="UI.closeModal()">×</button>
      </div>
      <div style="padding:16px 0;color:var(--text-primary);font-size:15px;">${msg}</div>
      <div class="flex gap-8 mt-16">
        <button class="btn btn-secondary btn-block" onclick="UI.closeModal()">取消</button>
        <button class="btn btn-primary btn-block" id="confirmBtn">确认</button>
      </div>
    `);
    document.getElementById('confirmBtn').onclick = () => {
      UI.closeModal();
      onConfirm();
    };
  }
};

// 主应用
const App = {
  currentPage: 'home',
  pageTitles: {
    home: { title: '首页', subtitle: '今日工作台' },
    weather: { title: '天气', subtitle: '实时天气' },
    todo: { title: '待办', subtitle: '任务清单' },
    calendar: { title: '日历', subtitle: '月度视图' },
    finance: { title: '记账', subtitle: '收支记录' },
    checkin: { title: '打卡图鉴', subtitle: '海洋收集' },
    pomodoro: { title: '番茄钟', subtitle: '专注计时' },
  },

  init() {
    this.bindEvents();
    this.generateOceanScene();
    this.generateBubbles();
    this.navigate('home');
    this.updateBadge();
  },

  bindEvents() {
    // 菜单按钮
    document.getElementById('menuBtn').addEventListener('click', () => this.toggleSidebar());
    document.getElementById('sidebarOverlay').addEventListener('click', () => this.closeSidebar());

    // 侧边栏导航
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const page = item.dataset.page;
        this.navigate(page);
        this.closeSidebar();
      });
    });

    // 模态关闭
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
      if (e.target.id === 'modalOverlay') UI.closeModal();
    });

    // PWA 注册
    if ('serviceWorker' in navigator) {
      // 可以注册 service worker（暂时用内联）
    }
  },

  navigate(page) {
    this.currentPage = page;

    // 切换页面
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');

    // 切换导航高亮
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });

    // 更新标题
    const titleInfo = this.pageTitles[page] || { title: '', subtitle: '' };
    document.getElementById('pageTitle').textContent = titleInfo.title;
    document.getElementById('pageSubtitle').textContent = titleInfo.subtitle;

    // 渲染对应页面
    switch(page) {
      case 'home': Home.render(); break;
      case 'weather': Weather.renderPage(); break;
      case 'todo': Todo.renderPage(); break;
      case 'calendar': Calendar.renderPage(); break;
      case 'finance': Finance.renderPage(); break;
      case 'checkin': Checkin.renderPage(); break;
      case 'pomodoro': Pomodoro.renderPage(); break;
      case 'settings': this.renderSettings(); break;
    }

    // 滚动到顶部
    document.querySelector('.main').scrollTop = 0;
  },

  toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('show');
  },

  closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('show');
  },

  updateBadge() {
    const count = Todo.getPendingCount();
    const badge = document.getElementById('todoBadge');
    if (count > 0) {
      badge.textContent = count;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  },

  // 生成海洋场景
  generateOceanScene() {
    const far = document.getElementById('oceanLayerFar');
    const mid = document.getElementById('oceanLayerMid');
    const near = document.getElementById('oceanLayerNear');
    if (!far || !mid || !near) return;

    // 远景岩石
    for (let i = 0; i < 5; i++) {
      const rock = document.createElement('div');
      rock.className = 'pixel-rock';
      const w = 80 + Math.random() * 120;
      rock.style.width = w + 'px';
      rock.style.height = (w * 0.7) + 'px';
      rock.style.left = (i * 22 + Math.random() * 8) + '%';
      rock.style.background = `linear-gradient(135deg, #5A8FA8 0%, #2E5C75 ${40 + Math.random() * 20}%, #143546 100%)`;
      far.appendChild(rock);
    }

    // 中海草
    for (let i = 0; i < 18; i++) {
      const weed = document.createElement('div');
      weed.className = 'pixel-seaweed';
      weed.style.height = (60 + Math.random() * 100) + 'px';
      weed.style.left = (i * 5.5 + Math.random() * 3) + '%';
      weed.style.animationDuration = (3 + Math.random() * 2) + 's';
      weed.style.animationDelay = (Math.random() * 2) + 's';
      mid.appendChild(weed);
    }

    // 近景海草 + 珊瑚
    for (let i = 0; i < 10; i++) {
      const weed = document.createElement('div');
      weed.className = 'pixel-seaweed';
      weed.style.height = (40 + Math.random() * 70) + 'px';
      weed.style.left = (i * 10 + Math.random() * 4) + '%';
      weed.style.animationDuration = (2.5 + Math.random() * 1.5) + 's';
      weed.style.animationDelay = (Math.random() * 1.5) + 's';
      weed.style.background = `linear-gradient(180deg, ${Math.random() > 0.5 ? '#7DFFD0' : '#A8E6CF'} 0%, ${Math.random() > 0.5 ? '#0A9B7A' : '#0891B2'} 100%)`;
      near.appendChild(weed);
    }

    // 珊瑚
    for (let i = 0; i < 4; i++) {
      const coral = document.createElement('div');
      coral.className = 'pixel-coral';
      coral.style.height = (30 + Math.random() * 40) + 'px';
      coral.style.left = (15 + i * 22 + Math.random() * 8) + '%';
      coral.style.bottom = Math.random() * 20 + 'px';
      coral.style.transform = `scale(${0.7 + Math.random() * 0.5})`;
      near.appendChild(coral);
    }

    // 小鱼群
    const app = document.getElementById('app');
    for (let i = 0; i < 6; i++) {
      const fish = document.createElement('div');
      fish.className = 'pixel-fish';
      fish.style.top = (30 + Math.random() * 45) + '%';
      fish.style.background = ['#D4A000', '#E55A2B', 'var(--aqua-dark)', '#FFD23F'][Math.floor(Math.random() * 4)];
      fish.style.animationDuration = (12 + Math.random() * 15) + 's';
      fish.style.animationDelay = (Math.random() * 8) + 's';
      fish.style.transform = `scale(${0.6 + Math.random() * 0.6})`;
      app.appendChild(fish);
    }
  },

  // 生成气泡背景
  generateBubbles() {
    const app = document.getElementById('app');
    for (let i = 0; i < 12; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      const size = 4 + Math.random() * 14;
      bubble.style.width = size + 'px';
      bubble.style.height = size + 'px';
      bubble.style.left = Math.random() * 100 + '%';
      bubble.style.setProperty('--drift', (Math.random() - 0.5) * 80 + 'px');
      bubble.style.animationDuration = (8 + Math.random() * 14) + 's';
      bubble.style.animationDelay = (Math.random() * 12) + 's';
      app.appendChild(bubble);
    }
  },

  // 设置页
  renderSettings() {
    const el = document.getElementById('page-settings');
    const settings = Store.get('settings', {});

    el.innerHTML = `
      <div class="card">
        <div class="card-title"><span class="card-icon">👤</span>个人信息</div>
        <label>昵称</label>
        <input type="text" class="input" id="settingNickname" value="${settings.nickname || 'abby'}">
      </div>

      <div class="card">
        <div class="card-title"><span class="card-icon">🌤️</span>天气设置</div>
        <label>城市</label>
        <input type="text" class="input" id="settingCity" value="${settings.city || '深圳'}">
        <label>和风天气 Key</label>
        <input type="text" class="input" id="settingWeatherKey" value="${settings.weatherKey || ''}">
        <label>API Host</label>
        <input type="text" class="input" id="settingApiHost" value="${settings.apiHost || 'm76e4gpu2b.re.qweatherapi.com'}" placeholder="xxx.qweatherapi.com">
        <button class="btn btn-primary btn-block mt-16" onclick="App.saveSettings()">保存设置</button>
      </div>

      <div class="card">
        <div class="card-title"><span class="card-icon">🔔</span>提醒设置</div>
        <div class="flex-between" style="padding:8px 0;">
          <span style="color:var(--text-primary);">每日打卡提醒</span>
          <label style="display:inline-flex;align-items:center;">
            <input type="checkbox" id="settingReminder" ${settings.reminderEnabled ? 'checked' : ''} style="width:20px;height:20px;cursor:pointer;">
          </label>
        </div>
        <label>提醒时间</label>
        <input type="time" class="input" id="settingReminderTime" value="${settings.reminderTime || '09:00'}" style="color-scheme:dark;">
        <button class="btn btn-secondary btn-block mt-8" onclick="App.setReminder()">设置设备闹钟</button>
      </div>

      <div class="card">
        <div class="card-title"><span class="card-icon">📱</span>PWA 安装</div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">
          在浏览器菜单中选择「添加到主屏幕」，即可像原生 App 一样使用 💫
        </div>
      </div>

      <div class="card">
        <div class="card-title"><span class="card-icon">🗑️</span>数据管理</div>
        <button class="btn btn-secondary btn-block" onclick="App.exportData()">📤 导出数据</button>
        <button class="btn btn-secondary btn-block mt-8" onclick="document.getElementById('importFile').click()">📥 导入数据</button>
        <input type="file" id="importFile" accept=".json,application/json" style="display:none;" onchange="App.importData(this.files[0])">
        <button class="btn btn-secondary btn-block mt-8" style="color:#D64545;" onclick="App.clearData()">⚠️ 清空所有数据</button>
      </div>

      <div class="card text-center" style="font-size:12px;color:var(--text-muted);">
        <div>abby workbench v1.0.0 🌊</div>
        <div style="margin-top:4px;">潜水员戴夫风格 · Keep diving!</div>
      </div>
    `;
  },

  saveSettings() {
    const settings = Store.get('settings', {});
    settings.nickname = document.getElementById('settingNickname').value.trim() || 'abby';
    settings.city = document.getElementById('settingCity').value.trim() || '深圳';
    settings.weatherKey = document.getElementById('settingWeatherKey').value.trim();
    settings.apiHost = document.getElementById('settingApiHost').value.trim() || 'm76e4gpu2b.re.qweatherapi.com';
    settings.reminderEnabled = document.getElementById('settingReminder').checked;
    settings.reminderTime = document.getElementById('settingReminderTime').value;
    Store.set('settings', settings);

    // 更新天气配置
    Weather.key = settings.weatherKey;
    Weather.apiHost = settings.apiHost;
    Weather.cityName = settings.city;

    // 更新侧边栏昵称
    document.querySelector('.sidebar-name').textContent = settings.nickname;

    UI.toast('设置已保存 ✓');
  },

  // 通过 Workbuddy 设备设置打卡提醒
  async setReminder() {
    const settings = Store.get('settings', {});
    const time = settings.reminderTime || '09:00';

    if (!settings.reminderEnabled) {
      UI.toast('请先开启提醒');
      return;
    }

    // 创建明天的闹钟
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [hh, mm] = time.split(':');
    tomorrow.setHours(parseInt(hh), parseInt(mm), 0, 0);

    try {
      await mcp__workbuddy_device__create_alarm({
        time: tomorrow.toISOString(),
        label: `abby 每日打卡提醒 🔥`
      });
      UI.toast('已设置每日打卡提醒闹钟 ⏰');
    } catch(e) {
      UI.toast('提醒设置失败，请稍后重试');
    }
  },

  exportData() {
    const data = {};
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith(Store.prefix)) {
        data[k] = localStorage.getItem(k);
      }
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abby-backup-${Store.today()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    UI.toast('数据已导出 📤');
  },

  importData(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const keys = Object.keys(data).filter(k => k.startsWith(Store.prefix));
        if (!keys.length) {
          UI.toast('不是有效的备份文件 ✗');
          return;
        }
        keys.forEach(k => localStorage.setItem(k, data[k]));
        UI.toast('数据导入成功 ✓');
        setTimeout(() => location.reload(), 800);
      } catch(err) {
        UI.toast('文件解析失败，请检查备份文件');
      }
    };
    reader.readAsText(file);
  },

  clearData() {
    UI.confirm('确定要清空所有数据吗？此操作不可恢复！', () => {
      Store.clear();
      Store.initDefaults();
      UI.toast('数据已清空');
      setTimeout(() => location.reload(), 1000);
    });
  }
};

// 让 navigate 全局可访问（HTML onclick 调用）
window.App = App;
window.UI = UI;
