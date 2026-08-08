/**
 * checkin.js - 打卡图鉴系统
 * 打卡卡片 + 详情记录 + 连续天数 + 海洋生物闪卡收集
 */

const Checkin = {
  // 海洋生物图鉴（30种，按稀有度分）
  fishCollection: [
    // 普通
    { id:'f01', emoji:'🐟', name:'沙丁鱼', desc:'成群结队的旅行者', img:'assets/img/fish/sardine.png', cutout:'assets/img/fish-cutout/sardine.png', cutoutThumb:'assets/img/fish-cutout/thumb/sardine.png', cutoutType:'transparent', rarity:'common', unlockAt:1 },
    { id:'f02', emoji:'🐟', name:'石斑鱼', desc:'礁石间的巨大猎手', img:'assets/img/fish/grouper.png', cutout:'assets/img/fish-cutout/grouper.png', cutoutThumb:'assets/img/fish-cutout/thumb/grouper.png', cutoutType:'transparent', rarity:'common', unlockAt:3 },
    { id:'f03', emoji:'🐟', name:'剑鱼', desc:'速度惊人的海洋剑客', img:'assets/img/fish/swordfish.png', cutout:'assets/img/fish-cutout/swordfish.png', cutoutThumb:'assets/img/fish-cutout/thumb/swordfish.png', cutoutType:'transparent', rarity:'common', unlockAt:5 },
    { id:'f04', emoji:'🐟', name:'大黄鱼', desc:'南海的黄金美味', img:'assets/img/fish/croaker.png', cutout:'assets/img/fish-cutout/croaker.png', cutoutThumb:'assets/img/fish-cutout/thumb/croaker.png', cutoutType:'transparent', rarity:'common', unlockAt:7 },
    { id:'f05', emoji:'🐟', name:'带鱼', desc:'深海中的银色长刀', img:'assets/img/fish/hairtail.png', cutout:'assets/img/fish-cutout/hairtail.png', cutoutThumb:'assets/img/fish-cutout/thumb/hairtail.png', cutoutType:'transparent', rarity:'common', unlockAt:10 },
    { id:'f06', emoji:'🐟', name:'比目鱼', desc:'左右不对称的伪装大师', img:'assets/img/fish/flounder.png', cutout:'assets/img/fish-cutout/flounder.png', cutoutThumb:'assets/img/fish-cutout/thumb/flounder.png', cutoutType:'transparent', rarity:'common', unlockAt:12 },
    { id:'f07', emoji:'🐟', name:'海鲈鱼', desc:'近海常见的勇猛猎手', img:'assets/img/fish/bass.png', cutout:'assets/img/fish-cutout/bass.png', cutoutThumb:'assets/img/fish-cutout/thumb/bass.png', cutoutType:'transparent', rarity:'common', unlockAt:15 },
    { id:'f08', emoji:'🐟', name:'黑鲷', desc:'礁石区的黑色贵客', img:'assets/img/fish/black_seabream.png', cutout:'assets/img/fish-cutout/black_seabream.png', cutoutThumb:'assets/img/fish-cutout/thumb/black_seabream.png', cutoutType:'transparent', rarity:'common', unlockAt:18 },
    { id:'f28', emoji:'🐟', name:'红鲈', desc:'赤红身影的浅海猎手', img:'assets/img/fish/rockfish.png', cutout:'assets/img/fish-cutout/rockfish.png', cutoutThumb:'assets/img/fish-cutout/thumb/rockfish.png', cutoutType:'transparent', rarity:'common', unlockAt:2 },
    { id:'f29', emoji:'🐟', name:'黄尾笛鲷', desc:'尾巴金黄的热带鱼', img:'assets/img/fish/yellowtail_snapper.png', cutout:'assets/img/fish-cutout/yellowtail_snapper.png', cutoutThumb:'assets/img/fish-cutout/thumb/yellowtail_snapper.png', cutoutType:'transparent', rarity:'common', unlockAt:4 },
    // 稀有
    { id:'f09', emoji:'🦈', name:'锤头鲨', desc:'头部形似锤子的凶猛猎手', img:'assets/img/fish/hammerhead.png', cutout:'assets/img/fish-cutout/hammerhead.png', cutoutThumb:'assets/img/fish-cutout/thumb/hammerhead.png', cutoutType:'transparent', rarity:'rare', unlockAt:7 },
    { id:'f10', emoji:'🐎', name:'海马', desc:'直立游动的海洋小精灵', img:'assets/img/fish/seahorse.png', cutout:'assets/img/fish-cutout/seahorse.png', cutoutThumb:'assets/img/fish-cutout/thumb/seahorse.png', cutoutType:'transparent', rarity:'rare', unlockAt:14 },
    { id:'f11', emoji:'🦋', name:'蝴蝶鱼', desc:'色彩斑斓的珊瑚舞者', img:'assets/img/fish/butterflyfish.png', cutout:'assets/img/fish-cutout/butterflyfish.png', cutoutThumb:'assets/img/fish-cutout/thumb/butterflyfish.png', cutoutType:'transparent', rarity:'rare', unlockAt:21 },
    { id:'f12', emoji:'🐍', name:'皇带鱼', desc:'深海中的银色巨带', img:'assets/img/fish/oarfish.png', cutout:'assets/img/fish-cutout/oarfish.png', cutoutThumb:'assets/img/fish-cutout/thumb/oarfish.png', cutoutType:'transparent', rarity:'rare', unlockAt:25 },
    { id:'f13', emoji:'👑', name:'皇帝神仙鱼', desc:'色彩尊贵的珊瑚贵族', img:'assets/img/fish/emperor_angelfish.png', cutout:'assets/img/fish-cutout/emperor_angelfish.png', cutoutThumb:'assets/img/fish-cutout/thumb/emperor_angelfish.png', cutoutType:'transparent', rarity:'rare', unlockAt:30 },
    { id:'f14', emoji:'🐟', name:'蓝马林鱼', desc:'热带海域的蓝色闪电', img:'assets/img/fish/blue_marlin.png', cutout:'assets/img/fish-cutout/blue_marlin.png', cutoutThumb:'assets/img/fish-cutout/thumb/blue_marlin.png', cutoutType:'transparent', rarity:'rare', unlockAt:35 },
    { id:'f15', emoji:'🐡', name:'蓑鲉', desc:'身披棘刺的海洋舞者', img:'assets/img/fish/lionfish.png', cutout:'assets/img/fish-cutout/lionfish.png', cutoutThumb:'assets/img/fish-cutout/thumb/lionfish.png', cutoutType:'transparent', rarity:'rare', unlockAt:40 },
    { id:'f30', emoji:'🦜', name:'鹦鹉鱼', desc:'长着喙状嘴的珊瑚雕刻师', img:'assets/img/fish/parrotfish.png', cutout:'assets/img/fish-cutout/parrotfish.png', cutoutThumb:'assets/img/fish-cutout/thumb/parrotfish.png', cutoutType:'transparent', rarity:'rare', unlockAt:20 },
    // 史诗
    { id:'f16', emoji:'🐳', name:'蓝鲸', desc:'海洋中最大的生命', rarity:'epic', unlockAt:14 },
    { id:'f17', emoji:'🦈', name:'大白鲨', desc:'海洋顶级掠食者', rarity:'epic', unlockAt:30 },
    { id:'f18', emoji:'🐋', name:'座头鲸', desc:'会唱歌的温柔巨兽', rarity:'epic', unlockAt:45 },
    { id:'f19', emoji:'🦭', name:'虎鲸', desc:'海洋中的黑色猎手', rarity:'epic', unlockAt:60 },
    { id:'f20', emoji:'🐙', name:'深海巨型章鱼', desc:'北欧传说中的克拉肯', rarity:'epic', unlockAt:75 },
    { id:'f27', emoji:'🌟', name:'海之灵', desc:'海洋之心的守护精灵', rarity:'epic', unlockAt:50 },
    // 传说
    { id:'f21', emoji:'🐉', name:'海龙', desc:'传说中的海洋守护者', rarity:'legendary', unlockAt:30 },
    { id:'f22', emoji:'🧜‍♀️', name:'人鱼', desc:'深海中的神秘歌者', rarity:'legendary', unlockAt:50 },
    { id:'f23', emoji:'🐊', name:'海洋鳄神', desc:'远古时代的活化石', rarity:'legendary', unlockAt:80 },
    { id:'f24', emoji:'🐍', name:'海蛇皇', desc:'盘踞深海的神秘力量', rarity:'legendary', unlockAt:100 },
    { id:'f25', emoji:'🐲', name:'利维坦', desc:'圣经中的深海巨兽', rarity:'legendary', unlockAt:120 },
    { id:'f26', emoji:'🧜‍♂️', name:'波塞冬', desc:'海洋之主，掌控潮汐', rarity:'legendary', unlockAt:150 },
  ],

  rarityText(r) {
    return { common:'普通', rare:'稀有', epic:'史诗', legendary:'传说' }[r];
  },

  rarityColor(r) {
    return { common:'#8B9AAF', rare:'#2E9BD0', epic:'#9B5DE5', legendary:'#D4A000' }[r];
  },

  // 获取打卡任务
  getTasks() {
    return Store.get('checkin_tasks', []);
  },

  // 保存打卡任务
  saveTasks(tasks) {
    Store.set('checkin_tasks', tasks);
  },

  // 获取今日记录
  getTodayRecords() {
    const today = Store.today();
    return Store.get('checkin_records', []).filter(r => r.date === today);
  },

  // 获取某任务今日记录
  getTaskTodayRecord(taskId) {
    const today = Store.today();
    return Store.get('checkin_records', []).find(r => r.taskId === taskId && r.date === today);
  },

  // 获取所有记录
  getAllRecords() {
    return Store.get('checkin_records', []);
  },

  // 获取连续打卡天数
  getStreak() {
    return Store.get('streak', { count: 0, lastDate: null });
  },

  // 更新连续打卡
  updateStreak() {
    const today = Store.today();
    const streak = this.getStreak();

    if (streak.lastDate === today) return streak;

    // 检查昨天
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,'0')}-${String(yesterday.getDate()).padStart(2,'0')}`;

    if (streak.lastDate === yStr) {
      streak.count += 1;
    } else {
      streak.count = 1;
    }
    streak.lastDate = today;
    Store.set('streak', streak);

    // 检查解锁海洋生物
    this.checkUnlocks(streak.count);

    return streak;
  },

  // 检查是否解锁新的海洋生物
  checkUnlocks(streakCount) {
    const unlocked = Store.get('unlocked_fish', []);
    const newUnlocks = [];

    this.fishCollection.forEach(fish => {
      if (streakCount >= fish.unlockAt && !unlocked.find(u => u.id === fish.id)) {
        unlocked.push({ id: fish.id, unlockDate: Store.today() });
        newUnlocks.push(fish);
      }
    });

    if (newUnlocks.length > 0) {
      Store.set('unlocked_fish', unlocked);
      // 显示闪卡解锁动画
      this.showUnlockAnimation(newUnlocks);
    }
  },

  // 闪卡解锁动画
  showUnlockAnimation(fishes) {
    const overlay = document.getElementById('flashUnlockOverlay');
    const cardEl = document.getElementById('flashUnlockCard');
    let idx = 0;

    const showNext = () => {
      if (idx >= fishes.length) {
        overlay.classList.remove('show');
        setTimeout(() => overlay.style.display = 'none', 300);
        return;
      }
      const f = fishes[idx];
      cardEl.innerHTML = `
        <div class="flash-unlock-shine"></div>
        <div class="flash-unlock-title">NEW DISCOVERY</div>
        <div class="flash-unlock-emoji">${f.cutout ? `<img src="${f.cutoutThumb || f.cutout}" alt="${f.name}" class="cutout-fish ${f.cutoutType === 'ocean' ? 'ocean' : ''}" style="width:200px;max-height:160px;">` : (f.img ? `<img src="${f.img}" alt="${f.name}" style="width:180px;border-radius:12px;display:block;margin:0 auto;">` : f.emoji)}</div>
        <div class="flash-unlock-name">${f.name}</div>
        <div class="flash-unlock-desc">${f.desc}</div>
        <div class="flash-card-rarity" style="background:${this.rarityColor(f.rarity)};color:#052230;margin-top:16px;">
          ${this.rarityText(f.rarity)} ★
        </div>
        <button class="btn btn-primary mt-24" onclick="Checkin.nextUnlock(${idx})">收下</button>
      `;
      overlay.style.display = 'flex';
      setTimeout(() => overlay.classList.add('show'), 50);
      idx++;
    };

    this._unlockQueue = fishes;
    this._showNext = showNext;
    showNext();
  },

  nextUnlock(idx) {
    this._showNext();
  },

  // 临时测试功能：解锁所有图鉴（项目完成后删除）
  unlockAllForPreview() {
    // 解锁所有海洋生物
    const allFish = this.fishCollection.map(f => ({ id: f.id, unlockDate: Store.today() }));
    Store.set('unlocked_fish', allFish);
    // 解锁所有番茄鱼
    if (typeof PomoFish !== 'undefined') {
      const allPomo = PomoFish.collection.map(f => ({ id: f.id, unlockDate: Store.today() }));
      Store.set(PomoFish.storeKey, allPomo);
    }
    UI.toast('已解锁全部图鉴（测试预览）🔓');
    this.renderPage();
  },

  // 点击图鉴卡片放大查看（跟随鼠标旋转）
  viewCard(fishId) {
    const fish = this.fishCollection.find(f => f.id === fishId);
    if (!fish) return;
    const unlocked = Store.get('unlocked_fish', []);
    if (!unlocked.find(u => u.id === fishId)) return;

    // 关闭现有查看层
    this.closeCardView();

    const overlay = document.createElement('div');
    overlay.id = 'cardViewOverlay';
    overlay.className = 'card-view-overlay';

    const content = document.createElement('div');
    content.className = 'card-view-content';

    const isPomoFish = fish.img && fish.img.startsWith('assets/img/fish');
    const imageHtml = fish.img
      ? `<img src="${fish.img}" alt="${fish.name}">`
      : `<div class="card-view-emoji">${fish.emoji}</div>`;

    content.innerHTML = `
      <button class="card-view-close" onclick="Checkin.closeCardView()">×</button>
      <div class="card-view-stage">
        <div class="card-view-card">
          ${imageHtml}
          <div class="card-view-info">
            <div class="card-view-name">${fish.name}</div>
            <div class="card-view-desc">${fish.desc}</div>
            <div class="card-view-rarity" style="background:${this.rarityColor(fish.rarity)};color:#052230;">
              ${this.rarityText(fish.rarity)} ★
            </div>
          </div>
        </div>
      </div>
    `;

    overlay.appendChild(content);
    document.body.appendChild(overlay);
    // 触发动画
    requestAnimationFrame(() => overlay.classList.add('show'));

    // 鼠标跟随旋转
    const stage = content.querySelector('.card-view-stage');
    const card = content.querySelector('.card-view-card');
    let raf = null;
    let targetRX = 0, targetRY = 0, currentRX = 0, currentRY = 0;

    overlay.addEventListener('mousemove', (e) => {
      const rect = overlay.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;   // 0~1
      const y = (e.clientY - rect.top) / rect.height;   // 0~1
      targetRY = (x - 0.5) * 24;   // 左右旋转 ±12°
      targetRX = (0.5 - y) * 20;   // 上下旋转 ±10°
      if (!raf) raf = requestAnimationFrame(animate);
    });

    function animate() {
      currentRX += (targetRX - currentRX) * 0.12;
      currentRY += (targetRY - currentRY) * 0.12;
      card.style.transform = `rotateX(${currentRX}deg) rotateY(${currentRY}deg)`;
      raf = null;
      if (Math.abs(targetRX - currentRX) > 0.05 || Math.abs(targetRY - currentRY) > 0.05) {
        raf = requestAnimationFrame(animate);
      }
    }

    // 点击遮罩关闭
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.closeCardView();
    });
  },

  // 关闭卡片查看层
  closeCardView() {
    const overlay = document.getElementById('cardViewOverlay');
    if (overlay) {
      overlay.classList.remove('show');
      setTimeout(() => overlay.remove(), 250);
    }
  },

  // 完成打卡
  doCheckin(taskId, formData) {
    const task = this.getTasks().find(t => t.id === taskId);
    if (!task) return;

    const record = {
      id: Store.uuid(),
      taskId: taskId,
      taskName: task.name,
      emoji: task.emoji,
      date: Store.today(),
      time: Store.nowTime(),
      data: formData
    };

    const records = Store.get('checkin_records', []);
    // 移除今日同任务的旧记录（覆盖）
    const filtered = records.filter(r => !(r.taskId === taskId && r.date === Store.today()));
    filtered.push(record);
    Store.set('checkin_records', filtered);

    // 更新连续打卡
    this.updateStreak();

    return record;
  },

  // 删除打卡记录
  removeCheckin(recordId) {
    const records = Store.get('checkin_records', []);
    Store.set('checkin_records', records.filter(r => r.id !== recordId));
  },

  // 添加自定义打卡任务
  addTask(name, emoji, fields) {
    const tasks = this.getTasks();
    const newTask = {
      id: Store.uuid(),
      name: name,
      emoji: emoji || '⭐',
      color: '#FF6B35',
      fields: fields || [{ key: 'content', label: '记录', type: 'text', placeholder: '今天做了什么？' }]
    };
    tasks.push(newTask);
    this.saveTasks(tasks);
    return newTask;
  },

  // 删除打卡任务
  removeTask(taskId) {
    const tasks = this.getTasks().filter(t => t.id !== taskId);
    this.saveTasks(tasks);
  },

  // 渲染打卡图鉴页
  renderPage() {
    const el = document.getElementById('page-checkin');
    const tasks = this.getTasks();
    const todayRecords = this.getTodayRecords();
    const streak = this.getStreak();
    const unlocked = Store.get('unlocked_fish', []);

    // 打卡卡片
    let tasksHtml = tasks.map(task => {
      const record = todayRecords.find(r => r.taskId === task.id);
      const done = !!record;

      let detailHtml = '';
      if (done && record.data) {
        detailHtml = Object.entries(record.data).map(([key, val]) => {
          const field = task.fields.find(f => f.key === key);
          return field ? `<div style="font-size:12px;color:var(--text-muted);margin-top:2px;"><span style="color:var(--text-secondary)">${field.label}:</span> ${val}</div>` : '';
        }).join('');
      }

      return `
        <div class="card checkin-card ${done ? 'completed' : ''}" ${done ? `onclick="Checkin.viewRecord('${record.id}')"` : ''}>
          <div class="checkin-body">
            <div class="checkin-emoji">${task.emoji}</div>
            <div class="checkin-info">
              <div class="checkin-name">${task.name}</div>
              ${done ? detailHtml : `<div class="checkin-detail">今日未打卡</div>`}
            </div>
            ${done ?
              `<button class="checkin-btn done" onclick="event.stopPropagation();Checkin.viewRecord('${record.id}')">✓ 已完成</button>` :
              `<button class="checkin-btn todo" onclick="event.stopPropagation();Checkin.openCheckinForm('${task.id}')">打卡</button>`
            }
          </div>
        </div>
      `;
    }).join('');

    // 图鉴
    let collectionHtml = this.fishCollection.map(fish => {
      const unlockedFish = unlocked.find(u => u.id === fish.id);
      const isUnlocked = !!unlockedFish;
      // 有抠图则图鉴里显示抠图缩略图（点击放大才显示完整卡片），否则有卡片图显示卡片，都没有用 emoji
      const displayHtml = fish.cutout
        ? (isUnlocked
            ? `<img src="${fish.cutoutThumb || fish.cutout}" alt="${fish.name}" loading="lazy" class="cutout-fish ${fish.cutoutType === 'ocean' ? 'ocean' : ''}">`
            : `<div class="flash-card-emoji" style="font-size:40px;">❓</div>`)
        : fish.img
          ? (isUnlocked
              ? `<img src="${fish.img}" alt="${fish.name}" style="width:100%;border-radius:12px;display:block;image-rendering:auto;">`
              : `<div class="flash-card-emoji" style="font-size:40px;">❓</div>`)
          : `<div class="flash-card-emoji" style="font-size:40px;">${isUnlocked ? fish.emoji : '❓'}</div>`;
      const clickAttr = isUnlocked ? `onclick="Checkin.viewCard('${fish.id}')"` : '';
      const cursorStyle = isUnlocked ? 'cursor:pointer;' : '';
      return `
        <div class="flash-card ${fish.rarity} ${!isUnlocked ? 'locked' : ''}" style="padding:16px;${cursorStyle}" ${clickAttr}>
          <div style="font-size:0;margin-bottom:8px;">${displayHtml}</div>
          <div class="flash-card-name" style="font-size:14px;">${isUnlocked ? fish.name : '???'}</div>
          ${isUnlocked ? `<div class="flash-card-desc" style="font-size:11px;">${fish.desc}</div>` :
            `<div class="flash-card-desc" style="font-size:11px;">连续打卡 ${fish.unlockAt} 天解锁</div>`}
          <div class="flash-card-rarity" style="background:${this.rarityColor(fish.rarity)};color:#052230;font-size:10px;padding:2px 8px;">
            ${this.rarityText(fish.rarity)}
          </div>
        </div>
      `;
    }).join('');

    // 番茄钟专注图鉴
    let pomoHtml = '';
    if (typeof PomoFish !== 'undefined') {
      const pomoTotal = PomoFish.getTotalMinutes();
      const pomoUnlocked = PomoFish.getUnlocked();
      const pomoCollectionHtml = PomoFish.collection.map(fish => {
        const uInfo = pomoUnlocked.find(u => u.id === fish.id);
        return PomoFish.fishCardHTML(fish, false, uInfo);
      }).join('');

      pomoHtml = `
        <div class="card-title mt-24 mb-16"><span class="card-icon">🍅</span>专注图鉴</div>
        <div style="font-size:12px;color:var(--text-secondary);margin-bottom:12px;">累计专注 ${pomoTotal} 分钟 · 已收集 ${pomoUnlocked.length} / ${PomoFish.collection.length} 种</div>
        <div class="grid-3" style="gap:10px;">
          ${pomoCollectionHtml}
        </div>
      `;
    }

    el.innerHTML = `
      <div class="card text-center" style="background:linear-gradient(135deg,rgba(255,107,53,0.15),rgba(27,231,255,0.1));">
        <div style="font-size:48px;">🔥</div>
        <div style="font-size:36px;font-weight:900;color:#E55A2B;">${streak.count}</div>
        <div style="font-size:14px;color:var(--text-secondary);">连续打卡天数</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">
          已收集 ${unlocked.length} / ${this.fishCollection.length} 种海洋生物
        </div>
      </div>

      <div class="flex-between mb-16">
        <div class="card-title" style="margin:0"><span class="card-icon">📋</span>今日打卡</div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-secondary btn-sm" onclick="Checkin.unlockAllForPreview()">🔍 预览全部</button>
          <button class="btn btn-secondary btn-sm" onclick="Checkin.openAddTask()">+ 添加</button>
        </div>
      </div>

      ${tasksHtml || '<div class="empty-state"><div class="empty-state-icon">📋</div>暂无打卡任务，点击右上角添加</div>'}

      <div class="card-title mt-24 mb-16"><span class="card-icon">📖</span>海洋图鉴</div>
      <div class="grid-3" style="gap:10px;">
        ${collectionHtml}
      </div>

      ${pomoHtml}
    `;
  },

  // 打卡表单
  openCheckinForm(taskId) {
    const task = this.getTasks().find(t => t.id === taskId);
    if (!task) return;

    let fieldsHtml = task.fields.map(f => {
      const input = f.type === 'textarea' ?
        `<textarea class="textarea" id="field_${f.key}" placeholder="${f.placeholder || ''}"></textarea>` :
        `<input type="${f.type || 'text'}" class="input" id="field_${f.key}" placeholder="${f.placeholder || ''}">`;
      return `<div><label>${f.label}</label>${input}</div>`;
    }).join('');

    UI.modal(`
      <div class="modal-header">
        <div class="modal-title">${task.emoji} ${task.name} 打卡</div>
        <button class="modal-close" onclick="UI.closeModal()">×</button>
      </div>
      ${fieldsHtml}
      <button class="btn btn-primary btn-block mt-24" onclick="Checkin.submitCheckin('${taskId}')">
        ✓ 完成打卡
      </button>
    `);
  },

  // 提交打卡
  submitCheckin(taskId) {
    const task = this.getTasks().find(t => t.id === taskId);
    if (!task) return;

    const formData = {};
    let hasValue = false;
    task.fields.forEach(f => {
      const val = document.getElementById('field_' + f.key).value.trim();
      formData[f.key] = val;
      if (val) hasValue = true;
    });

    if (!hasValue) {
      UI.toast('请至少填写一项内容');
      return;
    }

    this.doCheckin(taskId, formData);
    UI.closeModal();
    UI.toast(`${task.emoji} ${task.name} 打卡成功！`);
    // 稍微延迟渲染，让解锁动画先出现
    setTimeout(() => {
      this.renderPage();
      Home.render();
    }, 100);
  },

  // 查看记录详情
  viewRecord(recordId) {
    const records = Store.get('checkin_records', []);
    const record = records.find(r => r.id === recordId);
    if (!record) return;

    const task = this.getTasks().find(t => t.id === record.taskId);
    let detailHtml = '';
    if (task && record.data) {
      detailHtml = Object.entries(record.data).map(([key, val]) => {
        const field = task.fields.find(f => f.key === key);
        return `<div class="flex-between" style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.3)">
          <span style="color:var(--text-secondary);font-size:13px;">${field ? field.label : key}</span>
          <span style="color:var(--text-primary);font-weight:600;text-align:right;max-width:60%;">${val}</span>
        </div>`;
      }).join('');
    }

    // 历史记录
    const allRecords = this.getAllRecords().filter(r => r.taskId === record.taskId).reverse().slice(0, 10);
    let historyHtml = allRecords.map(r => `
      <div class="flex-between" style="padding:6px 0;font-size:13px;">
        <span style="color:var(--text-secondary)">${r.date} ${r.time}</span>
        <span style="color:var(--text-muted)">${Object.values(r.data).join(' / ')}</span>
      </div>
    `).join('');

    UI.modal(`
      <div class="modal-header">
        <div class="modal-title">${record.emoji} ${record.taskName}</div>
        <button class="modal-close" onclick="UI.closeModal()">×</button>
      </div>
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:16px;">${record.date} ${record.time}</div>
      ${detailHtml || '<div class="empty-state">无详细记录</div>'}
      ${historyHtml ? `<div class="card-title mt-24"><span class="card-icon">📜</span>历史记录</div>${historyHtml}` : ''}
      <button class="btn btn-secondary btn-block mt-16" onclick="Checkin.deleteRecord('${recordId}')">🗑 删除此记录</button>
    `);
  },

  deleteRecord(recordId) {
    this.removeCheckin(recordId);
    UI.closeModal();
    UI.toast('记录已删除');
    this.renderPage();
    Home.render();
  },

  // 添加任务表单
  openAddTask() {
    UI.modal(`
      <div class="modal-header">
        <div class="modal-title">➕ 添加打卡任务</div>
        <button class="modal-close" onclick="UI.closeModal()">×</button>
      </div>
      <div>
        <label>任务名称</label>
        <input type="text" class="input" id="newTaskName" placeholder="如：阅读" maxlength="10">
      </div>
      <div>
        <label>Emoji 图标</label>
        <input type="text" class="input" id="newTaskEmoji" placeholder="如：📖" maxlength="4">
      </div>
      <div>
        <label>记录字段（用逗号分隔）</label>
        <input type="text" class="input" id="newTaskFields" placeholder="如：内容,页数,时长">
      </div>
      <button class="btn btn-primary btn-block mt-24" onclick="Checkin.submitAddTask()">添加</button>
    `);
  },

  submitAddTask() {
    const name = document.getElementById('newTaskName').value.trim();
    const emoji = document.getElementById('newTaskEmoji').value.trim() || '⭐';
    const fieldsStr = document.getElementById('newTaskFields').value.trim();

    if (!name) {
      UI.toast('请输入任务名称');
      return;
    }

    const fields = (fieldsStr || '内容').split(',').map((s, i) => ({
      key: 'field_' + i,
      label: s.trim(),
      type: 'text',
      placeholder: ''
    }));

    this.addTask(name, emoji, fields);
    UI.closeModal();
    UI.toast(`已添加「${name}」`);
    this.renderPage();
    Home.render();
  }
};

window.Checkin = Checkin;
