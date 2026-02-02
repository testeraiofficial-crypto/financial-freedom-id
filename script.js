// Konfigurasi Awal
const TOTAL_HUTANG = 300000;
const ANGSURAN_PER_HARI = 25000;
const TANGGAL_MULAI = new Date('2026-02-01');

// State Data
let dataHutang = {
    terbayar: 0,
    riwayat: []
};

// Inisialisasi Chart
let debtChart;

// Load saat halaman dibuka
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initChart();
    updateUI();
    
    // Event Listeners
    document.getElementById('btnBayar').addEventListener('click', bayarAngsuran);
    document.getElementById('btnReset').addEventListener('click', resetData);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Cek Dark Mode preference
    if(localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
});

function loadData() {
    const saved = localStorage.getItem('debtApp_v1');
    if (saved) {
        dataHutang = JSON.parse(saved);
    }
}

function saveData() {
    localStorage.setItem('debtApp_v1', JSON.stringify(dataHutang));
}

function bayarAngsuran() {
    const sisa = TOTAL_HUTANG - dataHutang.terbayar;
    
    if (sisa <= 0) {
        alert("Hutang sudah lunas! Anda bebas!");
        return;
    }

    // Update Data
    dataHutang.terbayar += ANGSURAN_PER_HARI;
    
    // Format Tanggal (dd-nama bulan-yyyy)
    const now = new Date();
    const options = { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' };
    const tanggalFormatted = now.toLocaleDateString('id-ID', options);

    // Tambah ke Riwayat
    dataHutang.riwayat.unshift({
        date: tanggalFormatted,
        amount: ANGSURAN_PER_HARI
    });

    saveData();
    updateUI();
    updateChart();
    
    // Panggil Animasi Gemerlap (Dopamine Trigger)
    triggerConfetti();
}

function resetData() {
    if(confirm("Yakin ingin mereset semua data?")) {
        dataHutang = { terbayar: 0, riwayat: [] };
        saveData();
        updateUI();
        updateChart();
    }
}

function updateUI() {
    const sisa = TOTAL_HUTANG - dataHutang.terbayar;
    
    // Update Angka
    document.getElementById('sisaHutang').innerText = `Rp ${sisa.toLocaleString('id-ID')}`;
    
    // Hitung Estimasi Lunas
    const sisaCicilan = Math.ceil(sisa / ANGSURAN_PER_HARI);
    if (sisa <= 0) {
        document.getElementById('estimasiLunas').innerText = "LUNAS!";
        document.getElementById('estimasiLunas').style.color = "#00b894";
    } else {
        // Estimasi tanggal selesai dari HARI INI
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + sisaCicilan);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        document.getElementById('estimasiLunas').innerText = targetDate.toLocaleDateString('id-ID', options);
    }

    // Update List Riwayat
    const list = document.getElementById('riwayatList');
    list.innerHTML = '';
    dataHutang.riwayat.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${item.date}</span> <strong>- Rp ${item.amount.toLocaleString()}</strong>`;
        list.appendChild(li);
    });
}

function initChart() {
    const ctx = document.getElementById('debtChart').getContext('2d');
    debtChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Terbayar', 'Sisa Hutang'],
            datasets: [{
                data: [0, 300000],
                backgroundColor: ['#6c5ce7', '#dfe6e9'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            cutout: '70%',
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
    updateChart(); // Load initial data
}

function updateChart() {
    const sisa = TOTAL_HUTANG - dataHutang.terbayar;
    // Mencegah nilai negatif di chart
    const sisaDisplay = sisa < 0 ? 0 : sisa;
    
    debtChart.data.datasets[0].data = [dataHutang.terbayar, sisaDisplay];
    debtChart.update();
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}
