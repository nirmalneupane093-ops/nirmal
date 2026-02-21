

let isLoggedIn = false;
let currentUser = '';
let charts = {};
let chartStates = { past: false, present: false, future: false };

// DATA SETS
const timeData = {
  past: { labels: ['2010', '2012', '2014', '2016', '2018', '2020'], values: [180, 175, 170, 165, 160, 155] },
  present: { labels: ['2021', '2022', '2023', '2024'], values: [152, 150, 148, 147] },
  future: { labels: ['2025', '2026', '2027', '2028', '2029', '2030'], values: [145, 143, 140, 138, 135, 132] }
};

const countries = [
  {name:"India", past:32.0, present:30.0, future:28.0, region:"Asia"},
  {name:"China", past:11.0, present:10.5, future:9.5, region:"Asia"},
  {name:"USA", past:6.5, present:6.1, future:5.8, region:"North America"},
  {name:"Brazil", past:10.0, present:9.4, future:8.5, region:"South America"},
  {name:"South Africa", past:7.5, present:7.0, future:6.5, region:"Africa"},
  {name:"Indonesia", past:9.0, present:8.6, future:8.0, region:"Asia"},
  {name:"Nigeria", past:5.8, present:5.3, future:5.0, region:"Africa"},
  {name:"Germany", past:1.5, present:1.3, future:1.1, region:"Europe"},
  {name:"UK", past:1.5, present:1.3, future:1.2, region:"Europe"},
  {name:"France", past:2.5, present:2.3, future:2.0, region:"Europe"},
  {name:"Japan", past:2.0, present:1.8, future:1.6, region:"Asia"},
  {name:"Canada", past:1.3, present:1.2, future:1.1, region:"North America"},
  {name:"Australia", past:0.8, present:0.7, future:0.6, region:"Oceania"},
  {name:"Mexico", past:2.5, present:2.2, future:2.0, region:"North America"},
  {name:"Nepal", past:1.8, present:1.5, future:1.3, region:"Asia"}
];

// AUTH FUNCTIONS
function showLogin(){
  document.getElementById('loginModal').style.display = 'flex';
  document.getElementById('username').value = 'student';
  document.getElementById('password').value = 'unemployed2026';
  document.getElementById('username').focus();
  document.getElementById('username').select();
}

function showLoginFromWorld(){
  if(!isLoggedIn){
    showLogin();
  } else {
    showPage('world');
  }
}

function closeLogin(){
  document.getElementById('loginModal').style.display = 'none';
}

function loginUser(){
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  
  if((username === 'student' && password === 'unemployed2026') || 
     (username === 'admin' && password === 'admin2026') ||
     (username === 'user' && password === 'user123')){
    
    isLoggedIn = true;
    currentUser = username.charAt(0).toUpperCase() + username.slice(1);
    
    // UPDATE UI
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('userInfo').style.display = 'flex';
    document.getElementById('userName').textContent = currentUser;
    document.getElementById('lockIcon').style.display = 'none';
    
    unlockWorldData();
    showPage('world');
    closeLogin();
    setTimeout(()=>{
      alert(`✅ Welcome ${currentUser}!\n🌍 World Data Portal Unlocked!`);
      initVisibleCharts();
    },500);
  } else {
    alert('❌ Invalid credentials!\n\nDemo Login:\n👤 student\n🔑 unemployed2026');
    document.getElementById('username').value = 'student';
    document.getElementById('password').value = 'unemployed2026';
  }
}

function logout(){
  isLoggedIn = false;
  currentUser = '';
  document.getElementById('loginBtn').style.display = 'block';
  document.getElementById('userInfo').style.display = 'none';
  document.getElementById('lockIcon').style.display = 'inline';
  lockWorldData();
  chartStates = { past: false, present: false, future: false };
  resetChartToggles();
  // Destroy regional chart on logout
  if(charts.regionalPie) charts.regionalPie.destroy();
}

function unlockWorldData(){
  document.getElementById('lockedContent').style.display = 'none';
  document.getElementById('unlockedContent').style.display = 'block';
}

function lockWorldData(){
  document.getElementById('lockedContent').style.display = 'block';
  document.getElementById('unlockedContent').style.display = 'none';
}

/* CHART TOGGLE LOGIC */
function toggleCharts(period) {
  const chartsSection = document.getElementById(`${period}Charts`);
  const toggleBtn = event.target;
  
  if (chartStates[period]) {
    chartsSection.style.display = 'none';
    chartStates[period] = false;
    toggleBtn.classList.remove('active');
    toggleBtn.textContent = `${getPeriodEmoji(period)} Show ${getPeriodTitle(period)} Data`;
  } else {
    chartsSection.style.display = 'grid';
    chartStates[period] = true;
    toggleBtn.classList.add('active');
    toggleBtn.textContent = `${getPeriodEmoji(period)} Hide ${getPeriodTitle(period)} Data`;
    createPeriodCharts(period);
  }
}

function getPeriodEmoji(period) {
  return period === 'past' ? '📉' : period === 'present' ? '📊' : '🔮';
}

function getPeriodTitle(period) {
  return period === 'past' ? 'Past' : period === 'present' ? 'Present' : 'Future';
}

function resetChartToggles() {
  Object.keys(chartStates).forEach(period => {
    const chartsSection = document.getElementById(`${period}Charts`);
    const toggleBtn = document.querySelector(`[onclick="toggleCharts('${period}')"]`);
    chartsSection.style.display = 'none';
    chartStates[period] = false;
    toggleBtn.classList.remove('active');
    toggleBtn.textContent = `${getPeriodEmoji(period)} Show ${getPeriodTitle(period)} Data`;
  });
}

/* PAGE SWITCH */
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if(id==='home'){animateCounter();}
}

/* PARTICLE SYSTEM */
function initParticles(){
  const canvas=document.getElementById('particles');
  const ctx=canvas.getContext('2d');
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  
  const particles=[];
  for(let i=0;i<100;i++){
    particles.push({
      x:Math.random()*canvas.width,
      y:Math.random()*canvas.height,
      vx:Math.random()*0.5-0.25,
      vy:Math.random()*0.5-0.25,
      radius:Math.random()*2+0.5,
      color:['#a64dff','#ff1e1e','#00ffe0'][Math.floor(Math.random()*3)]
    });
  }
  
  function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>canvas.width)p.vx*=-1;
      if(p.y<0||p.y>canvas.height)p.vy*=-1;
      
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
      ctx.fillStyle=p.color+'40';
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

function animateCounter(){
  let target=countries.reduce((sum,c)=>sum+c.present,0).toFixed(1);
  let count=0;
  let interval=setInterval(()=>{
    count+=0.2;
    document.getElementById("globalCounter").innerText=count.toFixed(1)+" M";
    if(count>=parseFloat(target)) {
      clearInterval(interval);
      document.getElementById("globalCounter").innerText=target+" M";
    }
  },15);
}

// CHART FUNCTIONS
function getRating(value){
  if(value<2) return "⭐ Low";
  if(value<10) return "⭐⭐⭐ Medium";
  return "⭐⭐⭐⭐⭐ High";
}

function initVisibleCharts() {
  updateTimeChart('past');
  renderRegionalPieChart(); // NEW: Shows main pie chart immediately
  updateTable();
}

// NEW: Render the "Global Overview" Pie Chart
function renderRegionalPieChart() {
    const ctx = document.getElementById('regionalPieChart').getContext('2d');
    
    // Aggregate data by region
    const regionData = {};
    countries.forEach(c => {
        if (!regionData[c.region]) regionData[c.region] = 0;
        regionData[c.region] += c.present;
    });

    const labels = Object.keys(regionData);
    const data = Object.values(regionData);
    const colors = ['#a64dff', '#ff1e1e', '#00ffe0', '#ffaa00', '#88aaff', '#ff4d4d'];

    if (charts.regionalPie) charts.regionalPie.destroy();

    charts.regionalPie = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: '#1a0000',
                borderWidth: 2,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    position: 'right', 
                    labels: { color: '#eee', font: { size: 12 } }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) { label += ': '; }
                            label += context.raw.toFixed(1) + ' Million';
                            return label;
                        }
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
}

function createPeriodCharts(period) {
  if (!charts[`${period}Bar`] || !charts[`${period}Pie`]) {
    updateBarPieCharts(period);
  }
}

function updateTimeChart(period, button = null){
  if(button){
    document.querySelectorAll('.tabBtn').forEach(b=>b.classList.remove('activeTab'));
    button.classList.add('activeTab');
  }
  
  const ctx = document.getElementById('timeChart').getContext('2d');
  if(charts.timeChart) charts.timeChart.destroy();
  
  charts.timeChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: timeData[period].labels,
      datasets: [{
        label: `Global Unemployment (${period})`,
        data: timeData[period].values,
        borderColor: period === 'past' ? '#a64dff' : period === 'present' ? '#ffaa00' : '#00ffe0',
        backgroundColor: period === 'past' ? 'rgba(166,77,255,0.1)' : period === 'present' ? 'rgba(255,170,0,0.1)' : 'rgba(0,255,224,0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: period === 'past' ? '#a64dff' : period === 'present' ? '#ffaa00' : '#00ffe0',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: false, grid: { color: 'rgba(255,255,255,0.1)' } },
        x: { grid: { color: 'rgba(255,255,255,0.1)' } }
      },
      plugins: {
        legend: { labels: { color: '#eee', font: { size: 14, weight: 'bold' } } }
      }
    }
  });
}

function updateBarPieCharts(period){
  const barCtx = document.getElementById(`${period}BarChart`).getContext('2d');
  const pieCtx = document.getElementById(`${period}PieChart`).getContext('2d');
  
  if(charts[`${period}Bar`]) charts[`${period}Bar`].destroy();
  if(charts[`${period}Pie`]) charts[`${period}Pie`].destroy();
  
  const data = countries.map(c => c[period]);
  const colors = ['#a64dff', '#ff1e1e', '#00ffe0', '#ffaa00', '#88aaff', '#ff4d4d', '#4dff88', '#ff88ff'];
  
  // BAR CHART
  charts[`${period}Bar`] = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: countries.map(c => c.name),
      datasets: [{
        label: `Unemployed (M) - ${period}`,
        data: data,
        backgroundColor: colors.slice(0, data.length).map(c => c + 'CC'),
        borderColor: colors.slice(0, data.length),
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { font: { size: 10 } } }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
  
  // PIE CHART (PER PERIOD)
  charts[`${period}Pie`] = new Chart(pieCtx, {
    type: 'pie',
    data: {
      labels: countries.map(c => c.name),
      datasets: [{
        data: data,
        backgroundColor: colors.slice(0, data.length),
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          position: 'bottom', 
          labels: { 
            color: '#eee', 
            padding: 15,
            font: { size: 10 }, // Smaller font for many items
            usePointStyle: true
          } 
        }
      }
    }
  });
}

function updateTable(){
  const table = document.getElementById("countryTable");
  table.innerHTML = "";
  countries.forEach(c => {
    table.innerHTML += `
      <tr>
        <td><strong>${c.name}</strong></td>
        <td>${c.present.toFixed(1)}M</td>
        <td>${c.region}</td>
        <td>${getRating(c.present)}</td>
      </tr>`;
  });
}

// Event Listeners for filters
document.addEventListener('DOMContentLoaded', function(){
  initParticles();
  animateCounter();
  
  if(document.getElementById("searchCountry")){
    document.getElementById("searchCountry").addEventListener("input", updateTableFilter);
    document.getElementById("regionFilter").addEventListener("change", updateTableFilter);
  }
});

function updateTableFilter(){
  const search = document.getElementById("searchCountry").value.toLowerCase();
  const region = document.getElementById("regionFilter").value;
  
  const table = document.getElementById("countryTable");
  const rows = table.querySelectorAll("tr");
  
  rows.forEach(row => {
    const country = row.cells[0].textContent.toLowerCase();
    const rowRegion = row.cells[2].textContent;
    
    const matchesSearch = country.includes(search);
    const matchesRegion = !region || rowRegion === region;
    
    row.style.display = (matchesSearch && matchesRegion) ? "" : "none";
  });
}

// ESC to close modal
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape') closeLogin();
});

