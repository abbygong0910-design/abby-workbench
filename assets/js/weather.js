/**
 * weather.js - 天气模块
 * 调用和风天气 API，真实数据
 */

const Weather = {
  key: '182be39a459441dcab09d56c97c009a5',
  apiHost: 'm76e4gpu2b.re.qweatherapi.com',
  locationId: '101280601',  // 深圳
  cityName: '深圳',
  data: null,
  loading: false,
  lastError: null,
  useMock: false,

  // Mock 天气数据（Key未配置或网络失败时使用）
  getMockData() {
    const today = Store.today();
    const t = new Date();
    const tmr = new Date(t); tmr.setDate(t.getDate()+1);
    const dat = new Date(t); dat.setDate(t.getDate()+2);
    const df = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    return {
      current: {
        temp: '30', feelsLike: '34', icon: '1', humidity: '68',
        windDir: '东南', windScale: '3'
      },
      forecast: [
        { fxDate: df(t), textDay: '1', tempMin: '26', tempMax: '31' },
        { fxDate: df(tmr), textDay: '3', tempMin: '25', tempMax: '30' },
        { fxDate: df(dat), textDay: '4', tempMin: '25', tempMax: '29' }
      ],
      indices: [
        { name: '穿衣', category: '热', text: '天气热，建议穿短袖、短裤等清凉夏季服装' },
        { name: '运动', category: '较适宜', text: '气温较高，户外运动请注意防晒补水' }
      ],
      cityName: this.cityName,
      updateTime: new Date().toISOString(),
      _mock: true
    };
  },

  async fetchWeather() {
    this.loading = true;
    this.lastError = null;

    if (this.useMock) {
      this.loading = false;
      this.data = this.getMockData();
      return this.data;
    }

    try {
      const base = `https://${this.apiHost}`;
      const headers = { 'X-QW-Api-Key': this.key };

      // 实时天气
      const res = await fetch(`${base}/v7/weather/now?location=${this.locationId}`, { headers });
      const data = await res.json();

      // 3天预报
      const fres = await fetch(`${base}/v7/weather/3d?location=${this.locationId}`, { headers });
      const fdata = await fres.json();

      // 生活指数（穿衣）
      const ires = await fetch(`${base}/v7/indices/3d?location=${this.locationId}&type=3,5`, { headers });
      const idata = await ires.json();

      if (data.code === '200') {
        this.data = {
          current: data.now,
          forecast: fdata.daily || [],
          indices: idata.daily || [],
          cityName: this.cityName,
          updateTime: new Date().toISOString()
        };
        Store.set('weather_cache', this.data);
        this.loading = false;
        this.useMock = false;
        return this.data;
      } else if (data.code === '403') {
        this.lastError = '你的和风天气 Key 未配置域名白名单';
      } else {
        this.lastError = `和风天气错误：${data.code}`;
      }
    } catch(e) {
      console.error('天气获取失败:', e);
      this.lastError = '网络错误，无法连接和风天气';
      this.loading = false;
      return Store.get('weather_cache') || this.getMockData();
    }

    this.loading = false;
    // 失败时返回 mock 数据，但不缓存，确保下次仍尝试真实 API
    return this.getMockData();
  },

  // 天气 SVG 图标
  weatherSvg(code) {
    const commonStyle = 'width:48px;height:48px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.2));';
    const c = parseInt(code) || 0;

    // 晴
    if ([100, 150].includes(c)) return `<svg style="${commonStyle}" viewBox="0 0 64 64"><circle cx="32" cy="32" r="14" fill="#FFD23F"/><g stroke="#FFD23F" stroke-width="4" stroke-linecap="round"><line x1="32" y1="6" x2="32" y2="12"/><line x1="32" y1="52" x2="32" y2="58"/><line x1="6" y1="32" x2="12" y2="32"/><line x1="52" y1="32" x2="58" y2="32"/><line x1="13.6" y1="13.6" x2="17.8" y2="17.8"/><line x1="46.2" y1="46.2" x2="50.4" y2="50.4"/><line x1="13.6" y1="50.4" x2="17.8" y2="46.2"/><line x1="46.2" y1="17.8" x2="50.4" y2="13.6"/></g></svg>`;

    // 多云/阴
    if ([101, 102, 103, 151, 152, 153, 104].includes(c)) return `<svg style="${commonStyle}" viewBox="0 0 64 64"><circle cx="26" cy="26" r="10" fill="#FFD23F"/><path d="M46 46h-22c-6.6 0-12-5.4-12-12 0-6.2 4.8-11.3 10.9-11.9.6-5.8 5.5-10.1 11.1-10.1 4.9 0 9.2 3.2 10.8 7.8 4.7.9 8.2 5 8.2 9.9 0 5.7-4.3 10.3-10 10.3z" fill="#E8E8E8"/></svg>`;

    // 小雨
    if ([300, 301, 305, 309, 314].includes(c)) return `<svg style="${commonStyle}" viewBox="0 0 64 64"><path d="M48 38H20c-6.6 0-12-5.4-12-12 0-5.7 4-10.5 9.4-11.7C18.6 8.5 23.8 4 30 4c5.2 0 9.8 3.3 11.6 8 4.3 1 7.4 4.9 7.4 9.3 0 5.3-4.3 9.7-10 9.7z" fill="#E8E8E8"/><g stroke="#5FFFF5" stroke-width="3" stroke-linecap="round"><line x1="22" y1="44" x2="20" y2="52"/><line x1="32" y1="44" x2="30" y2="54"/><line x1="42" y1="44" x2="40" y2="52"/></g></svg>`;

    // 中雨/大雨
    if ([306, 307, 308, 310, 311, 312, 315, 316, 317, 318, 399].includes(c)) return `<svg style="${commonStyle}" viewBox="0 0 64 64"><path d="M48 36H20c-6.6 0-12-5.4-12-12 0-5.7 4-10.5 9.4-11.7C18.6 6.5 23.8 2 30 2c5.2 0 9.8 3.3 11.6 8 4.3 1 7.4 4.9 7.4 9.3 0 5.3-4.3 9.7-10 9.7z" fill="#9BA4B5"/><g stroke="#1BE7FF" stroke-width="3" stroke-linecap="round"><line x1="20" y1="42" x2="17" y2="52"/><line x1="30" y1="42" x2="27" y2="54"/><line x1="40" y1="42" x2="37" y2="52"/><line x1="25" y1="48" x2="22" y2="58"/><line x1="35" y1="48" x2="32" y2="60"/></g></svg>`;

    // 雷阵雨
    if ([302, 303, 304].includes(c)) return `<svg style="${commonStyle}" viewBox="0 0 64 64"><path d="M48 34H20c-6.6 0-12-5.4-12-12 0-5.7 4-10.5 9.4-11.7C18.6 4.5 23.8 0 30 0c5.2 0 9.8 3.3 11.6 8 4.3 1 7.4 4.9 7.4 9.3 0 5.3-4.3 9.7-10 9.7z" fill="#6B7B8C"/><polygon points="34,34 26,48 32,48 28,64 42,46 34,46" fill="#FFD23F"/></svg>`;

    // 雪
    if ([400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 499].includes(c)) return `<svg style="${commonStyle}" viewBox="0 0 64 64"><path d="M46 36H22c-5.5 0-10-4.5-10-10 0-4.8 3.3-8.8 7.9-9.8C21.3 9.3 25.6 6 30.5 6c4.4 0 8.2 2.8 9.7 6.7 3.6.7 6.3 3.9 6.3 7.7 0 4.4-3.6 8-8 8z" fill="#E8E8E8"/><circle cx="22" cy="46" r="3" fill="#FFF"/><circle cx="34" cy="50" r="3" fill="#FFF"/><circle cx="44" cy="44" r="3" fill="#FFF"/></svg>`;

    // 雾/霾
    if ([500, 501, 502, 503, 504, 507, 508, 509, 510, 511, 512, 513, 514, 515].includes(c)) return `<svg style="${commonStyle}" viewBox="0 0 64 64"><g stroke="#E8E8E8" stroke-width="4" stroke-linecap="round"><line x1="8" y1="22" x2="56" y2="22"/><line x1="12" y1="32" x2="52" y2="32"/><line x1="8" y1="42" x2="56" y2="42"/><line x1="14" y1="52" x2="50" y2="52"/></g></svg>`;

    // 默认海浪
    return `<svg style="${commonStyle}" viewBox="0 0 64 64"><path d="M8 40c8-8 16 0 24-8s16 0 24-8" stroke="#5FFFF5" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M8 52c8-8 16 0 24-8s16 0 24-8" stroke="#5FFFF5" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;
  },

  // 天气代码 → emoji（备用）
  weatherIcon(code) { return '🌊'; },

  weatherText(code) {
    const map = {
      '0': '晴', '1': '多云', '2': '阴', '3': '阴', '4': '阴',
      '9': '阵雨', '10': '小雨', '11': '中雨', '13': '小雪', '14': '中雪',
      '15': '大雪', '16': '暴雪', '17': '大暴雨', '18': '雾',
      '30': '雾', '31': '浓雾', '32': '强风', '33': '强风', '34': '飓风',
      '38': '酷热', '39': '冷雨', '40': '冷雨',
      // 新版3位代码
      '100': '晴', '101': '多云', '102': '少云', '103': '晴间多云', '104': '阴',
      '150': '晴', '151': '多云', '152': '少云', '153': '晴间多云',
      '300': '阵雨', '301': '强阵雨', '302': '雷阵雨', '303': '强雷阵雨',
      '304': '雷阵雨伴有冰雹', '305': '小雨', '306': '中雨', '307': '大雨',
      '308': '极端降雨', '309': '毛毛雨', '310': '暴雨', '311': '大暴雨',
      '312': '特大暴雨', '313': '冻雨', '314': '小到中雨', '315': '中到大雨',
      '316': '大到暴雨', '317': '暴雨到大暴雨', '318': '大暴雨到特大暴雨',
      '399': '雨',
      '400': '小雪', '401': '中雪', '402': '大雪', '403': '暴雪',
      '404': '雨夹雪', '405': '雨雪天气', '406': '阵雨夹雪', '407': '阵雪',
      '408': '小到中雪', '409': '中到大雪', '410': '大到暴雪', '499': '雪',
      '500': '薄雾', '501': '雾', '502': '霾', '503': '扬沙', '504': '浮尘',
      '507': '沙尘暴', '508': '强沙尘暴', '509': '浓雾', '510': '强浓雾',
      '511': '中度霾', '512': '重度霾', '513': '严重霾', '514': '大雾',
      '515': '特强浓雾',
      '900': '热', '901': '冷', '999': '未知'
    };
    return map[code] || '未知';
  },

  // 穿衣建议
  clothingAdvice(temp) {
    const t = parseInt(temp);
    if (t >= 30) return { text: '炎热注意防晒', icon: '🧴' };
    if (t >= 25) return { text: '穿短袖即可', icon: '👕' };
    if (t >= 20) return { text: '舒适宜薄外套', icon: '🧥' };
    if (t >= 15) return { text: '需穿外套', icon: '🧥' };
    if (t >= 10) return { text: '需穿毛衣', icon: '🧶' };
    if (t >= 5) return { text: '需穿羽绒服', icon: '🧥' };
    return { text: '严寒保暖', icon: '🧣' };
  },

  // 渲染天气页面
  async renderPage() {
    const el = document.getElementById('page-weather');
    el.innerHTML = `
      <div class="card text-center">
        <div style="font-size:64px;">⏳</div>
        <div class="mt-8">正在获取天气...</div>
      </div>
    `;

    const data = await this.fetchWeather();
    if (!data) {
      el.innerHTML = `
        <div class="card text-center">
          <div style="font-size:48px;">🌊</div>
          <div class="mt-8">天气获取失败，请检查网络</div>
          <button class="btn btn-primary mt-16" onclick="Weather.renderPage()">重试</button>
        </div>
      `;
      return;
    }

    const isMock = data._mock;
    const errorBanner = isMock && this.lastError ? `
      <div class="card" style="border-color:#D4A000;background:rgba(255,210,63,0.1);">
        <div style="font-size:13px;color:#D4A000;line-height:1.6;">
          ⚠️ ${this.lastError}<br>
          当前显示为示例数据。请前往「设置→天气设置」查看配置说明。
        </div>
      </div>
    ` : '';

    const c = data.current;
    const advice = this.clothingAdvice(c.temp);
    let forecastHtml = '';
    if (data.forecast && data.forecast.length > 0) {
      forecastHtml = '<div class="flex gap-8" style="justify-content:space-around;margin-top:16px;">';
      data.forecast.forEach((f, i) => {
        const date = new Date(f.fxDate);
        const wd = ['日','一','二','三','四','五','六'][date.getDay()];
        forecastHtml += `
          <div class="text-center">
            <div style="font-size:12px;color:var(--text-muted)">${i === 0 ? '今天' : '周'+wd}</div>
            <div style="font-size:24px;margin:4px 0;">${this.weatherIcon(f.textDay)}</div>
            <div style="font-size:13px;">${f.tempMin}° ~ ${f.tempMax}°</div>
          </div>
        `;
      });
      forecastHtml += '</div>';
    }

    let indicesHtml = '';
    if (data.indices && data.indices.length > 0) {
      indicesHtml = data.indices.map(idx => `
        <div class="flex-between mt-8" style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.3)">
          <div>
            <div style="font-weight:700;color:var(--text-primary)">${idx.name}</div>
            <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">${idx.text}</div>
          </div>
          <div class="tag tag-coral">${idx.category}</div>
        </div>
      `).join('');
    }

    el.innerHTML = `${errorBanner}
      <div class="card text-center">
        <div style="font-size:14px;color:var(--text-muted)">${data.cityName}</div>
        <div style="margin:8px 0;display:flex;justify-content:center;">${this.weatherSvg(c.icon)}</div>
        <div style="font-size:48px;font-weight:900;color:var(--text-primary)">${c.temp}°C ${isMock ? '<span style="font-size:14px;color:var(--text-muted)">(示例)</span>' : ''}</div>
        <div style="font-size:16px;color:var(--text-secondary);margin-top:4px;">${this.weatherText(c.icon)} · 体感${c.feelsLike}°C</div>
        <div class="flex" style="justify-content:center;gap:24px;margin-top:12px;font-size:13px;color:var(--text-secondary)">
          <span>💧 ${c.humidity}%</span>
          <span>🌬️ ${c.windDir} ${c.windScale}级</span>
        </div>
      </div>

      <div class="card">
        <div class="card-title"><span class="card-icon">${advice.icon}</span>今日穿衣建议</div>
        <div style="font-size:16px;color:var(--text-primary);">${advice.text}</div>
      </div>

      ${forecastHtml ? `<div class="card"><div class="card-title"><span class="card-icon">📅</span>3天预报</div>${forecastHtml}</div>` : ''}

      ${indicesHtml ? `<div class="card"><div class="card-title"><span class="card-icon">📊</span>生活指数</div>${indicesHtml}</div>` : ''}

      <div class="card text-center" style="font-size:12px;color:var(--text-muted)">
        ${isMock ? '当前为示例数据 · ' : '数据来源：和风天气 · '}更新于 ${Store.formatTime(data.updateTime)}
      </div>
    `;
  },

  // 首页天气小卡片
  async renderHomeCard() {
    const data = await this.fetchWeather();
    if (!data) {
      return `<div class="card" onclick="App.navigate('weather')">
        <div class="flex-between">
          <div>
            <div style="font-size:12px;color:var(--text-muted)">深圳</div>
            <div style="font-size:14px;color:var(--text-secondary)">天气获取失败</div>
          </div>
          <div style="font-size:32px;">🌊</div>
        </div>
      </div>`;
    }
    const c = data.current;
    const mockTag = data._mock ? '<span style="font-size:10px;color:#D4A000;margin-left:6px;">示例</span>' : '';
    return `<div class="card" onclick="App.navigate('weather')" style="cursor:pointer">
      <div class="flex-between">
        <div>
          <div style="font-size:12px;color:var(--text-muted)">${data.cityName} · ${Store.nowTime()}${mockTag}</div>
          <div style="font-size:32px;font-weight:900;color:var(--text-primary)">${c.temp}°C</div>
          <div style="font-size:13px;color:var(--text-secondary)">${this.weatherText(c.icon)} · 湿度${c.humidity}%</div>
        </div>
        <div style="font-size:48px;">${this.weatherSvg(c.icon)}</div>
      </div>
    </div>`;
  }
};
