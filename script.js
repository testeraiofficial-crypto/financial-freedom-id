// Inisialisasi Data
let totalHutang = 300000;
let angsuranPerKlik = 25000;
let riwayat = JSON.parse(localStorage.getItem('riwayatHutang')) || [];
const startDate = new Date("2026-02-01");

const hutangEl = document.getElementById('total-hutang');
const lunasEl = document.getElementById('estimasi-lunas');
const historyList = document.getElementById('history-list');
const btnBayar = document.getElementById('btn-bayar');

// Inisialisasi Grafik
const ctx = document.getElementById('debtChart').getContext('2d');
let debtChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: riwayat.map(item => item.tanggal),
        datasets: [{
            label: 'Nilai Angsuran',
            data: riwayat.map(item => item.jumlah),
            borderColor: '#00d2ff',
            tension: 0.1,
            fill: true
        }]
    }
});

function updateUI() {
    const sisa = totalHutang - (riwayat.length * angsuranPerKlik);
    hutangEl.innerText = `Rp ${sisa.toLocaleString('id-ID')}`;
    
    // Hitung Estimasi Lunas
    const sisaHari = sisa / angsuranPerKlik;
    const estimasiTanggal = new Date(startDate);
    estimasiTanggal.setDate(startDate.getDate() + riwayat.length + sisaHari - 1);
    
    lunasEl.innerText = sisa <= 0 ? "LUNAS!" : `Estimasi Lunas: ${estimasiTanggal.toLocaleDateString('id-ID', {day:'2-digit', month:'long', year:'numeric'})}`;
    
    // Update List Riwayat
    historyList.innerHTML = riwayat.map(item => `<li><span>${item.tanggal}</span> <span>Rp ${item.jumlah.toLocaleString('id-ID')}</span></li>`).reverse().join('');
    
    // Update Grafik
    debtChart.data.labels = riwayat.map(item => item.tanggal);
    debtChart.data.datasets[0].data = riwayat.map(item => item.jumlah);
    debtChart.update();

    if(sisa <= 0) btnBayar.disabled = true;
}

btnBayar.addEventListener('click', () => {
    const sisa = totalHutang - (riwayat.length * angsuranPerKlik);
    if (sisa <= 0) return;

    // Animasi Gemerlap (Dopamine Trigger)
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00d2ff', '#2ecc71', '#f1c40f']
    });

    // Tambah Riwayat
    const tgl = new Date(startDate);
    tgl.setDate(startDate.getDate() + riwayat.length);
    const formatTgl = `${tgl.getDate()}-${tgl.toLocaleString('id-ID', {month:'long'})}-${tgl.getFullYear()}`;
    
    riwayat.push({ tanggal: formatTgl, jumlah: angsuranPerKlik });
    localStorage.setItem('riwayatHutang', JSON.stringify(riwayat));
    
    updateUI();
});

// Dark Mode Toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

updateUI();
