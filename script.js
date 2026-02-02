// Konfigurasi Dasar
let totalHutangAwal = 300000;
let angsuranPerKlik = 25000;
let riwayat = JSON.parse(localStorage.getItem('riwayatHutang')) || [];

// PERBAIKAN: Set start date ke 2 Februari 2026
const startDate = new Date("2026-02-02"); 

const hutangEl = document.getElementById('total-hutang');
const lunasEl = document.getElementById('estimasi-lunas');
const historyList = document.getElementById('history-list');
const btnBayar = document.getElementById('btn-bayar');
const btnReset = document.getElementById('btn-reset');

// Inisialisasi Grafik
const ctx = document.getElementById('debtChart').getContext('2d');
let debtChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: riwayat.map(item => item.tanggal),
        datasets: [{
            label: 'Angsuran Masuk (Rp)',
            data: riwayat.map(item => item.jumlah),
            borderColor: '#00d2ff',
            backgroundColor: 'rgba(0, 210, 255, 0.2)',
            tension: 0.3,
            fill: true
        }]
    },
    options: { responsive: true }
});

function updateUI() {
    const totalTerbayar = riwayat.length * angsuranPerKlik;
    const sisa = totalHutangAwal - totalTerbayar;
    
    hutangEl.innerText = `Rp ${sisa.toLocaleString('id-ID')}`;
    
    // Hitung Estimasi Lunas
    if (sisa > 0) {
        const sisaHari = Math.ceil(sisa / angsuranPerKlik);
        const estimasiTanggal = new Date(startDate);
        // Tanggal lunas adalah start date + jumlah yang sudah dibayar + sisa hari
        estimasiTanggal.setDate(startDate.getDate() + riwayat.length + sisaHari - 1);
        
        lunasEl.innerText = `ESTIMASI LUNAS: ${estimasiTanggal.toLocaleDateString('id-ID', {day:'2-digit', month:'long', year:'numeric'})}`;
        btnBayar.disabled = false;
        btnBayar.innerText = `Bayar Angsuran (Rp 25.000)`;
    } else {
        lunasEl.innerText = "ALHAMDULILLAH LUNAS!";
        lunasEl.style.background = "#2ecc71";
        btnBayar.disabled = true;
        btnBayar.innerText = "Sudah Lunas";
    }
    
    // Update List Riwayat (Data terbaru di atas)
    historyList.innerHTML = riwayat.map(item => `
        <li>
            <span>📅 ${item.tanggal}</span> 
            <span style="color:#2ecc71; font-weight:bold">+Rp ${item.jumlah.toLocaleString('id-ID')}</span>
        </li>
    `).reverse().join('');
    
    // Update Grafik
    debtChart.data.labels = riwayat.map(item => item.tanggal);
    debtChart.data.datasets[0].data = riwayat.map(item => item.jumlah);
    debtChart.update();
}

// Logika Bayar
btnBayar.addEventListener('click', () => {
    const totalTerbayar = riwayat.length * angsuranPerKlik;
    if (totalTerbayar >= totalHutangAwal) return;

    // Trigger Animasi Dopamine (Confetti)
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00d2ff', '#2ecc71', '#ff0055', '#ffffff']
    });

    // PERBAIKAN LOGIKA TANGGAL: 
    // Klik ke-1 (index 0) = startDate (2 Feb)
    // Klik ke-2 (index 1) = startDate + 1 hari (3 Feb), dst.
    const tglEntry = new Date(startDate);
    tglEntry.setDate(startDate.getDate() + riwayat.length);
    
    const formatTgl = `${String(tglEntry.getDate()).padStart(2, '0')}-${tglEntry.toLocaleString('id-ID', {month:'long'})}-${tglEntry.getFullYear()}`;
    
    riwayat.push({ tanggal: formatTgl, jumlah: angsuranPerKlik });
    localStorage.setItem('riwayatHutang', JSON.stringify(riwayat));
    
    updateUI();
});

// Fitur Reset Data
btnReset.addEventListener('click', () => {
    if (confirm("Apakah Anda yakin ingin menghapus semua data angsuran? Data yang dihapus tidak bisa dikembalikan.")) {
        riwayat = [];
        localStorage.removeItem('riwayatHutang');
        updateUI();
        alert("Data telah di-reset ke awal.");
    }
});

// Dark Mode Toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Jalankan UI pertama kali
updateUI();
