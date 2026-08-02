/**
 * splash.js - 开屏像素动画
 * 像素海洋 + 阳光波纹 + 鱼跃水面 + 气泡
 */

const Splash = {
  canvas: null,
  ctx: null,
  W: 0,
  H: 0,
  pixels: 6,  // 像素大小
  state: 'diving',  // diving → jumping → splash → done
  timer: 0,
  startTime: 0,
  fishY: 0,
  fishVY: 0,
  fishX: 0,
  fishAngle: 0,
  bubbles: [],
  particles: [],
  seaweeds: [],

  init() {
    this.canvas = document.getElementById('splashCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // 生成海草
    this.generateSeaweeds();
    // 生成初始气泡
    for (let i = 0; i < 15; i++) {
      this.bubbles.push({
        x: Math.random() * this.W,
        y: this.H + Math.random() * 200,
        r: 2 + Math.random() * 4,
        speed: 0.3 + Math.random() * 0.8,
        drift: (Math.random() - 0.5) * 0.3
      });
    }

    // 初始鱼位置（海底）
    this.fishX = this.W * 0.5;
    this.fishY = this.H * 0.7;
    this.fishVY = -14;
    this.fishAngle = 0;

    this.startTime = performance.now();
    this.loop();
  },

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.W = window.innerWidth;
    this.H = window.innerHeight;
    this.canvas.width = this.W * dpr;
    this.canvas.height = this.H * dpr;
    this.canvas.style.width = this.W + 'px';
    this.canvas.style.height = this.H + 'px';
    this.ctx.scale(dpr, dpr);
    this.ctx.imageSmoothingEnabled = false;
  },

  generateSeaweeds() {
    this.seaweeds = [];
    for (let i = 0; i < 6; i++) {
      this.seaweeds.push({
        x: (this.W / 7) * (i + 1) + (Math.random() - 0.5) * 40,
        height: 60 + Math.random() * 80,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.02 + Math.random() * 0.02,
        segments: 5 + Math.floor(Math.random() * 3)
      });
    }
  },

  // 绘制像素点
  pset(x, y, color, size) {
    size = size || this.pixels;
    const px = Math.floor(x / size) * size;
    const py = Math.floor(y / size) * size;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(px, py, size, size);
  },

  loop() {
    const now = performance.now();
    this.timer = (now - this.startTime) / 1000;
    this.update();
    this.draw();
    requestAnimationFrame(() => this.loop());
  },

  update() {
    // 鱼跃动画状态机
    if (this.state === 'diving') {
      // 鱼从海底向上加速
      this.fishVY += 0.3;
      this.fishY += this.fishVY;
      if (this.fishY < this.H * 0.5) {
        this.state = 'jumping';
        this.fishVY = -18;
      }
    } else if (this.state === 'jumping') {
      // 鱼跃出水面，角度跟随速度方向
      this.fishVY += 0.6; // 重力
      this.fishY += this.fishVY;
      // 用速度向量计算角度，让鱼始终朝向运动方向
      const angle = Math.atan2(this.fishVY, 8);
      // 平滑插值
      this.fishAngle += (angle - this.fishAngle) * 0.15;

      // 鱼到达最高点后下落
      if (this.fishVY > 0 && this.fishY > this.H * 0.5) {
        this.state = 'splash';
        this.spawnSplash();
      }
    } else if (this.state === 'splash') {
      // 水花飞溅
      this.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.life -= 0.025;
      });
      this.particles = this.particles.filter(p => p.life > 0);

      // 鱼沉入海底
      this.fishVY += 0.5;
      this.fishY += this.fishVY;
      if (this.fishY > this.H * 0.8) {
        this.state = 'done';
      }
    }

    // 气泡上浮
    this.bubbles.forEach(b => {
      b.y -= b.speed;
      b.x += Math.sin(this.timer + b.y * 0.01) * b.drift;
      if (b.y < -10) {
        b.y = this.H + 10;
        b.x = Math.random() * this.W;
      }
    });

    // 海草摇曳
    this.seaweeds.forEach(s => s.sway += s.swaySpeed);
  },

  spawnSplash() {
    for (let i = 0; i < 25; i++) {
      const angle = -Math.PI/2 + (Math.random() - 0.5) * Math.PI;
      const speed = 3 + Math.random() * 5;
      this.particles.push({
        x: this.fishX,
        y: this.H * 0.5,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: this.pixels,
        life: 1
      });
    }
  },

  draw() {
    const ctx = this.ctx;
    // 清空（保持透明，让壁纸背景透出）
    ctx.clearRect(0, 0, this.W, this.H);

    // 气泡
    this.drawBubbles();

    // 鱼（如果在水面下）
    if (this.fishY > this.H * 0.5 - 20) {
      this.drawFish(this.fishX, this.fishY, this.fishAngle, true);
    } else {
      // 鱼在空中
      this.drawFish(this.fishX, this.fishY, this.fishAngle, false);
    }

    // 水花粒子
    this.drawParticles();
  },

  drawSunRays() {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = 0.22;
    for (let i = 0; i < 5; i++) {
      const x = (this.W / 6) * (i + 1);
      const grad = ctx.createLinearGradient(x, 0, x + 40, this.H * 0.6);
      grad.addColorStop(0, 'rgba(255,255,255,0.8)');
      grad.addColorStop(0.5, 'rgba(255,255,255,0.1)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(x - 25, 0);
      ctx.lineTo(x + 25, 0);
      ctx.lineTo(x + 80, this.H * 0.6);
      ctx.lineTo(x - 30, this.H * 0.6);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  },

  drawWaterSurface() {
    const ctx = this.ctx;
    const surfaceY = this.H * 0.5;

    // 水面波纹 - 像素风格
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x <= this.W; x += 6) {
      const y = surfaceY + Math.sin(x * 0.015 + this.timer * 2) * 4;
      if (x === 0) ctx.moveTo(x, Math.floor(y / 3) * 3);
      else ctx.lineTo(x, Math.floor(y / 3) * 3);
    }
    ctx.stroke();

    // 水面高光
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x <= this.W; x += 6) {
      const y = surfaceY + Math.sin(x * 0.015 + this.timer * 2) * 4 + 6;
      if (x === 0) ctx.moveTo(x, Math.floor(y / 3) * 3);
      else ctx.lineTo(x, Math.floor(y / 3) * 3);
    }
    ctx.stroke();
  },

  // 多层海草绘制
  drawSeaweedsLayer(baseY, count, color, pixelSize) {
    const ctx = this.ctx;
    const step = this.W / count;
    for (let i = 0; i < count; i++) {
      const x = i * step + step * 0.3 + Math.random() * step * 0.4;
      const height = baseY * (0.25 + Math.random() * 0.25);
      const segments = Math.floor(height / (pixelSize * 3));
      const swayOffset = Math.random() * Math.PI * 2;

      ctx.fillStyle = color;
      let curX = x;
      let curY = baseY;
      for (let j = 0; j < segments; j++) {
        const nextY = curY - (height / segments);
        const sway = Math.sin(this.timer * 2 + swayOffset + j * 0.5) * (j * 1.5);
        const nextX = x + sway;
        ctx.fillRect(Math.floor(nextX / pixelSize) * pixelSize,
                     Math.floor(nextY / pixelSize) * pixelSize,
                     pixelSize, pixelSize);
        curX = nextX;
        curY = nextY;
      }
    }
  },

  drawSeaweeds() {
    this.drawSeaweedsLayer(this.H, 15, '#0A8B8C', 5);
  },

  drawBubbles() {
    const ctx = this.ctx;
    this.bubbles.forEach(b => {
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  },

  // 绘制像素鱼
  drawFish(cx, cy, angle, inWater) {
    const ctx = this.ctx;
    const px = this.pixels;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    // 鱼身像素图案（橙色调）
    const body = '#FF6B35';
    const belly = '#FFD23F';
    const eye = '#052230';
    const fin = '#C99846';

    // 像素鱼图案 12x8
    // 0=透明 1=body 2=belly 3=eye 4=fin
    const pattern = [
      [0,0,0,1,1,1,1,1,1,1,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,2,2,1,1,1,1,1,1,1],
      [4,1,2,2,2,1,3,1,1,1,1,1],
      [0,1,1,2,2,1,1,1,1,1,1,1],
      [0,0,1,1,1,1,1,1,1,1,1,0],
      [0,0,0,1,1,1,1,1,1,1,0,0],
      [0,0,0,0,4,0,0,0,0,0,0,0],
    ];

    const colors = ['transparent', body, belly, eye, fin];
    const offsetX = -6 * px;
    const offsetY = -4 * px;

    for (let row = 0; row < pattern.length; row++) {
      for (let col = 0; col < pattern[row].length; col++) {
        const c = pattern[row][col];
        if (c === 0) continue;
        ctx.fillStyle = colors[c];
        ctx.fillRect(offsetX + col * px, offsetY + row * px, px, px);
      }
    }

    // 尾巴
    ctx.fillStyle = fin;
    ctx.fillRect(offsetX - px, offsetY + 2 * px, px, px);
    ctx.fillRect(offsetX - px, offsetY + 3 * px, px, px);
    ctx.fillRect(offsetX - 2*px, offsetY + px, px, px);
    ctx.fillRect(offsetX - 2*px, offsetY + 4 * px, px, px);

    ctx.restore();
  },

  drawParticles() {
    const ctx = this.ctx;
    this.particles.forEach(p => {
      ctx.fillStyle = `rgba(27,231,255,${p.life})`;
      ctx.fillRect(Math.floor(p.x / this.pixels) * this.pixels,
                   Math.floor(p.y / this.pixels) * this.pixels,
                   this.pixels, this.pixels);
    });
  },

  // 隐藏开屏
  hide() {
    const splash = document.getElementById('splash');
    splash.classList.add('hidden');
    setTimeout(() => splash.style.display = 'none', 800);
  }
};

// 页面加载后启动开屏
window.addEventListener('DOMContentLoaded', () => {
  // 设置开屏日期
  document.getElementById('splashDate').textContent = Store.formatDate(new Date());
  Splash.init();

  // 3.5秒后隐藏开屏，进入主界面
  setTimeout(() => {
    Splash.hide();
    App.init();
  }, 3500);
});
