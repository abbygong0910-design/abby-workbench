/**
 * finance.js - 记账模块
 */

const Finance = {
  getRecords() {
    return Store.get('finance_records', []);
  },

  saveRecords(records) {
    Store.set('finance_records', records);
  },

  add(type, amount, category, note, date) {
    const records = this.getRecords();
    records.unshift({
      id: Store.uuid(),
      type: type, // income / expense
      amount: parseFloat(amount),
      category: category,
      note: note || '',
      date: date || Store.today(),
      time: Store.nowTime()
    });
    this.saveRecords(records);
  },

  remove(id) {
    const records = this.getRecords().filter(r => r.id !== id);
    this.saveRecords(records);
  },

  categories: {
    expense: [
      { key:'food', name:'餐饮', emoji:'🍜' },
      { key:'transport', name:'交通', emoji:'🚌' },
      { key:'shopping', name:'购物', emoji:'🛍️' },
      { key:'entertainment', name:'娱乐', emoji:'🎮' },
      { key:'medical', name:'医疗', emoji:'💊' },
      { key:'housing', name:'居家', emoji:'🏠' },
      { key:'other', name:'其他', emoji:'📝' }
    ],
    income: [
      { key:'salary', name:'工资', emoji:'💰' },
      { key:'bonus', name:'奖金', emoji:'🎁' },
      { key:'invest', name:'理财', emoji:'📈' },
      { key:'other', name:'其他', emoji:'📝' }
    ]
  },

  getCategory(type, key) {
    return this.categories[type].find(c => c.key === key) || { name: '其他', emoji: '📝' };
  },

  // 本月统计
  monthStats() {
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    const records = this.getRecords().filter(r => r.date.startsWith(ym));
    const income = records.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0);
    const expense = records.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
    return { income, expense, balance: income - expense, count: records.length };
  },

  renderPage() {
    const el = document.getElementById('page-finance');
    const stats = this.monthStats();
    const records = this.getRecords().slice(0, 50);

    const renderRecord = r => {
      const cat = this.getCategory(r.type, r.category);
      return `
        <div class="card" style="padding:12px 16px;">
          <div class="flex-between">
            <div class="flex" style="align-items:center;gap:12px;">
              <div style="font-size:24px;">${cat.emoji}</div>
              <div>
                <div style="font-size:15px;color:var(--text-primary);">${cat.name}</div>
                <div style="font-size:12px;color:var(--text-muted)">${r.date} ${r.time} ${r.note ? '· '+r.note : ''}</div>
              </div>
            </div>
            <div style="font-weight:800;color:${r.type === 'income' ? '#2D9D5B' : '#E55A2B'};">
              ${r.type === 'income' ? '+' : '-'}${r.amount.toFixed(2)}
            </div>
          </div>
        </div>
      `;
    };

    el.innerHTML = `
      <div class="card text-center" style="background:linear-gradient(135deg,rgba(78,205,196,0.15),rgba(27,231,255,0.1));">
        <div style="font-size:13px;color:var(--text-muted)">本月结余</div>
        <div style="font-size:40px;font-weight:900;color:${stats.balance >= 0 ? 'var(--aqua-dark)' : '#E55A2B'}">
          ${stats.balance >= 0 ? '' : '-'}${Math.abs(stats.balance).toFixed(2)}
        </div>
        <div class="flex" style="justify-content:center;gap:32px;margin-top:12px;">
          <div>
            <div style="font-size:12px;color:var(--text-muted)">收入</div>
            <div style="font-size:18px;font-weight:700;color:#2D9D5B">+${stats.income.toFixed(2)}</div>
          </div>
          <div>
            <div style="font-size:12px;color:var(--text-muted)">支出</div>
            <div style="font-size:18px;font-weight:700;color:#E55A2B">-${stats.expense.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title"><span class="card-icon">➕</span>记一笔</div>
        <div class="flex gap-8" style="margin-bottom:12px;">
          <button class="btn btn-sm" id="typeExpense" style="flex:1;background:#E55A2B;color:white;" onclick="Finance.switchType('expense')">支出</button>
          <button class="btn btn-sm" id="typeIncome" style="flex:1;background:rgba(255,255,255,0.15);color:var(--text-secondary);" onclick="Finance.switchType('income')">收入</button>
        </div>
        <div id="categoryGrid"></div>
        <div class="form-row mt-8">
          <input type="number" class="input" id="financeAmount" placeholder="金额" step="0.01">
          <input type="date" class="input" id="financeDate" style="color-scheme:dark;">
        </div>
        <input type="text" class="input mt-8" id="financeNote" placeholder="备注（可选）">
        <button class="btn btn-primary btn-block mt-8" onclick="Finance.addFromForm()">记一笔</button>
      </div>

      ${records.length > 0 ? `<div class="card-title mt-16"><span class="card-icon">📜</span>近期记录</div>${records.map(renderRecord).join('')}` : ''}
    `;

    this.currentType = 'expense';
    this.renderCategories();
    document.getElementById('financeDate').value = Store.today();
  },

  currentType: 'expense',

  switchType(type) {
    this.currentType = type;
    document.getElementById('typeExpense').style.background = type === 'expense' ? '#E55A2B' : 'rgba(255,255,255,0.15)';
    document.getElementById('typeExpense').style.color = type === 'expense' ? 'white' : 'var(--text-secondary)';
    document.getElementById('typeIncome').style.background = type === 'income' ? '#2D9D5B' : 'rgba(255,255,255,0.15)';
    document.getElementById('typeIncome').style.color = type === 'income' ? 'white' : 'var(--text-secondary)';
    this.renderCategories();
  },

  renderCategories() {
    const cats = this.categories[this.currentType];
    document.getElementById('categoryGrid').innerHTML = cats.map((c, i) => `
      <div class="grid-3" style="display:inline-grid;gap:8px;margin-bottom:8px;">
      </div>
    `).join('');

    const html = `<div class="grid-3" style="gap:8px;">
      ${cats.map(c => `
        <div class="card" style="padding:12px;text-align:center;cursor:pointer;" id="cat_${c.key}" onclick="Finance.selectCat('${c.key}')">
          <div style="font-size:24px;">${c.emoji}</div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">${c.name}</div>
        </div>
      `).join('')}
    </div>`;

    document.getElementById('categoryGrid').innerHTML = html;
  },

  selectedCat: null,

  selectCat(key) {
    this.selectedCat = key;
    // 高亮选中
    this.categories[this.currentType].forEach(c => {
      const el = document.getElementById('cat_' + c.key);
      if (el) {
        el.style.borderColor = c.key === key ? '#E55A2B' : 'rgba(255,255,255,0.3)';
        el.style.background = c.key === key ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.1)';
      }
    });
  },

  addFromForm() {
    const amount = document.getElementById('financeAmount').value;
    const date = document.getElementById('financeDate').value || Store.today();
    const note = document.getElementById('financeNote').value.trim();

    if (!amount || parseFloat(amount) <= 0) {
      UI.toast('请输入有效金额');
      return;
    }
    if (!this.selectedCat) {
      UI.toast('请选择分类');
      return;
    }

    this.add(this.currentType, amount, this.selectedCat, note, date);
    UI.toast('记录成功 💰');
    this.renderPage();
    Home.render();
  }
};
