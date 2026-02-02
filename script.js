const TOTAL_DEBT = 300000;
const INSTALLMENT = 25000;
const START_DATE = new Date(2026, 1, 2); // 02 Februari 2026

const remainingEl = document.getElementById('remainingDebt');
const estimateEl = document.getElementById('estimateBadge');
const payBtn = document.getElementById('payBtn');
const resetBtn = document.getElementById('resetBtn');
const historyList = document.getElementById('historyList');

let payments = JSON.parse(localStorage.getItem('payments')) || [];
let chart;

function formatRupiah(num) {
    return 'Rp ' + num.toLocaleString('id-ID');
}

function formatDate(date) {
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

function getPaymentDate(index) {
    const d = new Date(START_DATE);
    d.setDate(d.getDate() + index);
    return d;
}

function updateUI() {
    const totalPaid = payments.length * INSTALLMENT;
    const remaining = Math.max(TOTAL_DEBT - totalPaid, 0);

    remainingEl.textContent = formatRupiah(remaining);

    if (remaining === 0) {
        estimateEl.textContent = 'LUNAS!';
        payBtn.disabled = true;
    } else if (payments.length > 0) {
        const lastDate = getPaymentDate(payments.length - 1);
        const daysNeeded = Math.ceil(remaining / INSTALLMENT);
        const est = new Date(lastDate);
        est.setDate(est.getDate() + daysNeeded);
        estimateEl.textContent = `Estimasi Lunas: ${formatDate(est)}`;
    } else {
        estimateEl.textContent = 'Estimasi Lunas';
    }

    renderHistory();
    updateChart();
}

function renderHistory() {
    historyList.innerHTML = '';
    [...payments].reverse().forEach((_, i) => {
        const realIndex = payments.length - 1 - i;
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${formatDate(getPaymentDate(realIndex))}</span>
            <span>${formatRupiah(INSTALLMENT)}</span>
        `;
        historyList.appendChild(li);
    });
}

function triggerConfetti() {
    confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
    });
}

function updateChart() {
    const labels = payments.map((_, i) => formatDate(getPaymentDate(i)));
    const data = payments.map(() => INSTALLMENT);

    if (!chart) {
        chart = new Chart(document.getElementById('paymentChart'), {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Angsuran',
                    data,
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34,197,94,0.3)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { ticks: { color: '#94a3b8' } },
                    y: {
                        ticks: {
                            color: '#94a3b8',
                            callback: v => formatRupiah(v)
                        }
                    }
                }
            }
        });
    } else {
        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        chart.update();
    }
}

payBtn.addEventListener('click', () => {
    payments.push(INSTALLMENT);
    localStorage.setItem('payments', JSON.stringify(payments));
    triggerConfetti();
    updateUI();
});

resetBtn.addEventListener('click', () => {
    if (confirm('Yakin ingin menghapus semua data angsuran?')) {
        localStorage.removeItem('payments');
        payments = [];
        payBtn.disabled = false;
        updateUI();
    }
});

updateUI();
