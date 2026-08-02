/**
 * pomodoro-fish.js - 番茄钟像素鱼图鉴
 * 专注时长驱动解锁的像素鱼收集（《潜水员戴夫》风）
 */

const PomoFish = {
  // 像素鱼集合（8种，按累计专注分钟解锁）
  collection: [
    {
      id: 'pomo1', name: '番茄鱼', rarity: 'common', unlockAt: 60, desc: '第一颗专注的种子',
      colors: { main: '#E55A2B', belly: '#FF8A65', fin: '#C93B2B', eye: '#2B0D05', accent: '#4CAF50' },
      pattern: [
        [0,0,1,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,1,0],
        [1,1,2,2,1,1,1,1,1,1],
        [3,1,2,2,1,4,1,1,1,1],
        [1,1,2,2,1,1,1,1,1,1],
        [0,1,1,1,1,1,1,1,1,0],
        [0,0,1,1,1,1,1,1,0,0],
      ]
    },
    {
      id: 'pomo2', name: '黄金鲀', rarity: 'common', unlockAt: 180, desc: '专注积累的开始',
      colors: { main: '#F5A623', belly: '#FFE29A', fin: '#D4891A', eye: '#2B1A05', accent: '#FFF3D6' },
      pattern: [
        [0,0,1,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,1,0],
        [1,1,2,2,2,1,1,1,1,1],
        [1,2,2,2,2,1,4,1,1,1],
        [1,1,2,2,2,1,1,1,1,1],
        [0,1,1,1,1,1,1,1,1,0],
        [0,0,1,1,1,1,1,1,0,0],
      ]
    },
    {
      id: 'pomo3', name: '碧波梭', rarity: 'common', unlockAt: 400, desc: '游刃有余的小能手',
      colors: { main: '#00B8D4', belly: '#B2EBF2', fin: '#007C91', eye: '#052230', accent: '#E0F7FA' },
      pattern: [
        [0,0,0,1,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,1,1,2,1,1,1,1,1,0],
        [3,1,1,2,1,4,1,1,1,1],
        [0,1,1,2,1,1,1,1,1,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,0,0,1,1,1,1,0,0,0],
      ]
    },
    {
      id: 'pomo4', name: '紫焰鳐', rarity: 'rare', unlockAt: 800, desc: '沉稳的深海舞者',
      colors: { main: '#9B5DE5', belly: '#D8B4FE', fin: '#7A3CC0', eye: '#1A0533', accent: '#EDE7F6' },
      pattern: [
        [0,0,0,0,1,1,0,0,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,1,1,2,1,1,1,1,1,0],
        [3,1,1,2,1,4,1,1,1,1],
        [0,1,1,2,1,1,1,1,1,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,0,0,0,1,1,0,0,0,0],
      ]
    },
    {
      id: 'pomo5', name: '冰晶鳞', rarity: 'rare', unlockAt: 1500, desc: '专注如冰，意志如晶',
      colors: { main: '#60A5FA', belly: '#BFDBFE', fin: '#3B82C4', eye: '#052230', accent: '#E3F2FD' },
      pattern: [
        [0,0,1,1,1,1,1,1,0,0],
        [0,1,1,2,1,1,2,1,1,0],
        [1,1,1,2,1,1,2,1,1,1],
        [3,1,1,2,1,4,1,2,1,1],
        [1,1,1,2,1,1,2,1,1,1],
        [0,1,1,2,1,1,2,1,1,0],
        [0,0,1,1,1,1,1,1,0,0],
      ]
    },
    {
      id: 'pomo6', name: '珊瑚戟', rarity: 'epic', unlockAt: 3000, desc: '披坚执锐的专注战士',
      colors: { main: '#FF6B35', belly: '#FFB088', fin: '#D6452B', eye: '#2B0500', accent: '#FFD23F' },
      pattern: [
        [0,0,0,1,1,1,1,0,0,0],
        [0,0,1,1,2,1,1,1,0,0],
        [0,1,1,1,2,1,1,1,1,0],
        [3,1,1,1,2,1,4,1,1,1],
        [0,1,1,1,2,1,1,1,1,0],
        [0,0,1,1,2,1,1,1,0,0],
        [0,0,0,1,1,1,1,0,0,0],
      ]
    },
    {
      id: 'pomo7', name: '霓虹鲛', rarity: 'epic', unlockAt: 6000, desc: '午夜潜行的专注猎手',
      colors: { main: '#00E5FF', belly: '#84FFFF', fin: '#0097A7', eye: '#05181F', accent: '#E0F7FA' },
      pattern: [
        [0,0,0,1,1,1,1,1,0,0],
        [0,0,1,1,1,1,1,1,1,0],
        [0,1,1,2,1,1,1,1,1,1],
        [3,1,1,2,1,4,1,1,1,1],
        [0,1,1,2,1,1,1,1,1,1],
        [0,0,1,1,1,1,1,1,1,0],
        [0,0,0,1,1,1,1,1,0,0],
      ]
    },
    {
      id: 'pomo8', name: '深渊·番茄神', rarity: 'legendary', unlockAt: 10000, desc: '专注之海的终极主宰',
      colors: { main: '#C0392B', belly: '#FF8A65', fin: '#7B241C', eye: '#FFD700', accent: '#FFD700' },
      pattern: [
        [0,0,1,1,1,1,1,1,0,0],
        [0,1,1,2,2,1,1,1,1,0],
        [1,1,2,5,2,1,1,1,1,1],
        [3,1,2,5,2,1,4,1,1,1],
        [1,1,2,5,2,1,1,1,1,1],
        [0,1,1,2,2,1,1,1,1,0],
        [0,0,1,1,1,1,1,1,0,0],
      ]
    },
  ],

  // 存储 key
  storeKey: 'pomo_fish_unlocked',

  // 获取累计专注分钟
  getTotalMinutes() {
    const history = Store.get('pomodoro_history', []);
    return history.reduce((sum, h) => sum + (h.duration || 0), 0);
  },

  // 获取已解锁
  getUnlocked() {
    return Store.get(this.storeKey, []);
  },

  // 检查并解锁新番茄鱼
  checkUnlocks() {
    const total = this.getTotalMinutes();
    const unlocked = this.getUnlocked();
    const newFishes = [];

    this.collection.forEach(fish => {
      if (total >= fish.unlockAt && !unlocked.find(u => u.id === fish.id)) {
        unlocked.push({ id: fish.id, unlockDate: Store.today() });
        newFishes.push(fish);
      }
    });

    if (newFishes.length > 0) {
      Store.set(this.storeKey, unlocked);
    }
    return newFishes;
  },

  // 渲染像素鱼（canvas）
  renderFishCanvas(fish, canvasSize = 100, pixel = 6) {
    // 兼容：无 canvas 时返回 emoji 占位
    try {
      const canvas = document.createElement('canvas');
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvasSize, canvasSize);

      const rows = fish.pattern.length;
      const cols = fish.pattern[0].length;
      const cell = Math.floor(canvasSize / (cols + 2));
      const offsetX = (canvasSize - cols * cell) / 2;
      const offsetY = (canvasSize - rows * cell) / 2;

      const colors = {
        0: 'transparent',
        1: fish.colors.main,
        2: fish.colors.belly,
        3: fish.colors.fin,
        4: fish.colors.eye,
        5: fish.colors.accent
      };

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const c = fish.pattern[row][col];
          if (c === 0) continue;
          ctx.fillStyle = colors[c];
          ctx.fillRect(offsetX + col * cell, offsetY + row * cell, cell, cell);
        }
      }
      return canvas;
    } catch(e) {
      return null;
    }
  },

  // 生成鱼卡片HTML（含像素鱼）
  fishCardHTML(fish, unlocked, unlockedInfo) {
    const isUnlocked = !!unlockedInfo;
    const canvas = this.renderFishCanvas(fish);
    const fishHtml = canvas ? canvas.outerHTML : (isUnlocked ? '🐟' : '❓');

    return `
      <div class="flash-card ${fish.rarity} ${!isUnlocked ? 'locked' : ''}" style="padding:16px;">
        <div class="flash-card-emoji" style="font-size:40px;line-height:1;">${fishHtml}</div>
        <div class="flash-card-name" style="font-size:14px;">${isUnlocked ? fish.name : '???'}</div>
        ${isUnlocked ? `<div class="flash-card-desc" style="font-size:11px;">${fish.desc}</div>` :
          `<div class="flash-card-desc" style="font-size:11px;">专注 ${fish.unlockAt} 分钟解锁</div>`}
        <div class="flash-card-rarity" style="background:${Checkin.rarityColor(fish.rarity)};color:#052230;font-size:10px;padding:2px 8px;">
          ${Checkin.rarityText(fish.rarity)}
        </div>
      </div>
    `;
  }
};

window.PomoFish = PomoFish;
