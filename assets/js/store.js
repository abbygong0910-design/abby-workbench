/**
 * store.js - 本地数据存储模块
 * 使用 localStorage 封装，所有数据真实持久化
 */

const Store = {
  // 存储前缀
  prefix: 'abby_',
  version: '2.2',

  // 版本检查：升级时清空旧数据
  checkVersion() {
    const savedVer = localStorage.getItem(this.prefix + 'version');
    if (savedVer !== this.version) {
      this.clear();
      localStorage.setItem(this.prefix + 'version', this.version);
    }
  },

  // 读取
  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(this.prefix + key);
      if (raw === null) return defaultValue;
      return JSON.parse(raw);
    } catch(e) {
      console.error('Store.get error:', key, e);
      return defaultValue;
    }
  },

  // 写入
  set(key, value) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
      return true;
    } catch(e) {
      console.error('Store.set error:', key, e);
      return false;
    }
  },

  // 删除
  remove(key) {
    localStorage.removeItem(this.prefix + key);
  },

  // 清空所有
  clear() {
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith(this.prefix)) localStorage.removeItem(k);
    });
  },

  // ========== 初始化默认数据 ==========
  initDefaults() {
    this.checkVersion();

    // 默认打卡任务
    if (!this.get('checkin_tasks')) {
      this.set('checkin_tasks', [
        { id: 'work', name: '工作', emoji: '💼', color: '#FF6B35', fields: [
          { key: 'content', label: '工作内容', type: 'textarea', placeholder: '今天做了什么？' },
          { key: 'duration', label: '时长（小时）', type: 'number', placeholder: '2' }
        ]},
        { id: 'fitness', name: '健身', emoji: '💪', color: '#4ECDC4', fields: [
          { key: 'part', label: '锻炼部位', type: 'text', placeholder: '如：胸/背/腿/有氧' },
          { key: 'duration', label: '时长（分钟）', type: 'number', placeholder: '45' },
          { key: 'feeling', label: '感受', type: 'text', placeholder: '爽！' }
        ]},
        { id: 'water', name: '喝水', emoji: '💧', color: '#1BE7FF', fields: [
          { key: 'amount', label: '饮水量（ml）', type: 'number', placeholder: '500' }
        ]}
      ]);
    }

    // 打卡记录
    if (!this.get('checkin_records')) {
      this.set('checkin_records', []);
    }

    // 待办
    if (!this.get('todos')) {
      this.set('todos', []);
    }

    // 记账
    if (!this.get('finance_records')) {
      this.set('finance_records', []);
    }

    // 已解锁的海洋生物
    if (!this.get('unlocked_fish')) {
      this.set('unlocked_fish', []);
    }

    // 连续打卡天数
    if (!this.get('streak')) {
      this.set('streak', { count: 0, lastDate: null });
    }

    // 设置
    if (!this.get('settings')) {
      this.set('settings', {
        weatherKey: '182be39a459441dcab09d56c97c009a5',
        city: '深圳',
        locationId: '101280601',
        apiHost: 'm76e4gpu2b.re.qweatherapi.com',
        reminderEnabled: true,
        reminderTime: '09:00',
        nickname: 'abby'
      });
    }

    // 主题颜色记录
    if (!this.get('theme')) {
      this.set('theme', 'ocean');
    }
  },

  // ========== 工具方法 ==========

  // 获取今天日期 YYYY-MM-DD
  today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  },

  // 获取当前时间 HH:mm
  nowTime() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  },

  // 格式化日期
  formatDate(date) {
    const d = new Date(date);
    const weekdays = ['日','一','二','三','四','五','六'];
    return `${d.getMonth()+1}月${d.getDate()}日 周${weekdays[d.getDay()]}`;
  },

  // 格式化时间
  formatTime(date) {
    const d = new Date(date);
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  },

  // 获取星期几（中文）
  weekday(date) {
    const d = new Date(date);
    return ['日','一','二','三','四','五','六'][d.getDay()];
  },

  // 生成唯一ID
  uuid() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  },

  // 获取问候语
  greeting() {
    const h = new Date().getHours();
    if (h < 6) return '夜深了，注意休息 🌙';
    if (h < 11) return '早上好，新的一天 🌅';
    if (h < 14) return '中午好，午休一下 ☀️';
    if (h < 18) return '下午好，喝杯奶茶继续冲 🧋';
    if (h < 22) return '晚上好，辛苦啦 🌊';
    return '深夜了，早些休息 💤';
  }
};

// 启动时初始化默认数据
Store.initDefaults();
