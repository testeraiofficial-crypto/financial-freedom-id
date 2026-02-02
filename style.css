/* style.css */
:root {
    --bg-color: #f4f4f9;
    --card-bg: #ffffff;
    --text-color: #333;
    --primary-color: #2ecc71;
    --accent-color: #e74c3c;
}

/* Default Dark Mode */
body.dark-mode {
    --bg-color: #1a1a2e;
    --card-bg: #16213e;
    --text-color: #e9ecef;
    --primary-color: #00d2ff;
}

body {
    font-family: 'Segoe UI', sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    transition: 0.3s;
    margin: 0;
    display: flex;
    justify-content: center;
    padding: 20px; /* Tambahan padding agar tidak mepet di HP */
    box-sizing: border-box;
}

.container {
    width: 100%;
    max-width: 500px;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

header h1 {
    margin: 0;
    font-size: 1.5rem;
}

#theme-toggle {
    background: var(--card-bg);
    border: 1px solid var(--text-color);
    color: var(--text-color);
    padding: 8px 12px;
    border-radius: 20px;
    cursor: pointer;
    transition: 0.2s;
}

#theme-toggle:hover {
    background: var(--bg-color);
}

.summary-card {
    background: var(--card-bg);
    padding: 20px;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    margin-bottom: 20px;
}

.summary-card h2 {
    font-size: 2.5rem;
    margin: 10px 0;
    color: var(--primary-color);
}

.lunas-badge {
    background: #ff0055;
    box-shadow: 0 0 15px rgba(255, 0, 85, 0.5);
    font-size: 1.1rem;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: bold;
    margin-top: 10px;
    display: inline-block;
    animation: pulse 2s infinite;
    color: white;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

.actions {
    margin-bottom: 20px;
}

.btn-main {
    width: 100%;
    padding: 15px;
    border: none;
    border-radius: 10px;
    background: var(--primary-color);
    color: white;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: 0.2s;
}

.btn-main:active { transform: scale(0.95); }
.btn-main:disabled { background: #7f8c8d; cursor: not-allowed; }

.btn-reset {
    width: 100%;
    margin-top: 10px;
    padding: 10px;
    border: 1px solid var(--accent-color);
    background: transparent;
    color: var(--accent-color);
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: 0.2s;
}

.btn-reset:hover {
    background: rgba(231, 76, 60, 0.1);
}

.chart-container, .history {
    background: var(--card-bg);
    margin-top: 20px;
    padding: 15px;
    border-radius: 15px;
}

ul { list-style: none; padding: 0; }
li {
    padding: 10px;
    border-bottom: 1px solid #444;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Pastikan container grafik punya tinggi minimal agar tidak hilang */
.chart-container {
    min-height: 250px;
    position: relative;
}

canvas {
    max-width: 100%;
}
