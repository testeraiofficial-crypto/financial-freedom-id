// CONFIG
const TOTAL_HUTANG = 300000; // (1) Nilai saldo hutang
const ANGSURAN = 25000;     // (2) Angsuran tetap
const START_DATE = new Date('2026-02-16'); // (3) Start 16 Februari 2026

// STATE
let appData = { terbayar: 0, history: [] };
let myChart;

// INIT
document.addEventListener('DOMContentLoaded', () => {
    loadLocal();
    initChart();
    renderUI();

    // Buttons
    document.getElementById('btnBayar').onclick = bayar;
    document.getElementById('btnReset').onclick = reset;
    document.getElementById('themeToggle').onclick = toggleTheme;

    // Check Theme
    if(localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
});

function loadLocal() {
    const saved = localStorage.getItem('hutangApp_v2');
    if(saved) appData = JSON.parse(saved);
}

function saveLocal() {
    localStorage.setItem('hutangApp_v2', JSON.stringify(appData));
}

function bayar() {
    if(appData.terbayar >= TOTAL_HUTANG) {
        alert("🎉 Hutang Sudah Lunas! Selamat!");
        return;
    }

    appData.terbayar += ANGSURAN;
    
    // Add History
    const now = new Date();
    appData.history.unshift({
        date: now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: '2-digit' }),
        jam: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute:'2-digit' }),
        val: ANGSURAN
    });

    saveLocal();
    renderUI();
    updateChart();
    triggerConfetti(); // Efek Dopamin
}

function reset() {
    if(confirm("Yakin reset data?")) {
        appData = { terbayar: 0, history: [] };
        saveLocal();
        renderUI();
        updateChart();
    }
}

function renderUI() {
    const sisa = TOTAL_HUTANG - appData.terbayar;
    document.getElementById('sisaHutang').innerText = `Rp ${sisa.toLocaleString('id-ID')}`;
    
    // Estimasi
    if(sisa <= 0) {
        document.getElementById('estimasiLunas').innerText = "LUNAS!";
        document.getElementById('estimasiLunas').style.color = "#00b894";
    } else {
        const hariSisa = Math.ceil(sisa / ANGSURAN);
        const target = new Date();
        target.setDate(target.getDate() + hariSisa);
        document.getElementById('estimasiLunas').innerText = target.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    // List History
    const ul = document.getElementById('riwayatList');
    ul.innerHTML = appData.history.map(h => `
        <li>
            <span>${h.date} <small>(${h.jam})</small></span>
            <strong>- Rp ${h.val.toLocaleString()}</strong>
        </li>
    `).join('');
}

function initChart() {
    const ctx = document.getElementById('debtChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Terbayar', 'Sisa'],
            datasets: [{
                data: [0, 300000],
                backgroundColor: ['#6c5ce7', '#dfe6e9'],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: { legend: { display: false } }
        }
    });
    updateChart();
}

function updateChart() {
    const sisa = Math.max(0, TOTAL_HUTANG - appData.terbayar);
    myChart.data.datasets[0].data = [appData.terbayar, sisa];
    myChart.update();
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}
