window.onload = loadData;

function openTab(evt, tabName) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
    if (tabName === 'cal') renderCal();
}

function addExtra(containerId, className, value = '') {
    const container = document.getElementById(containerId);
    const input = document.createElement('input');
    input.type = 'number';
    input.placeholder = 'Nota';
    input.className = className;
    input.value = value;
    input.min = '0';
    input.max = '10';
    input.oninput = saveAndCalc;
    container.appendChild(input);
}

function saveAndCalc() {
    const data = {};
    document.querySelectorAll('input').forEach(i => {
        if (i.type === 'number' && i.value !== '') {
            let val = parseFloat(i.value);
            if (val > 10) i.value = 10;
            if (val < 0) i.value = 0;
        }
        if (i.id) data[i.id] = i.value;
    });
    ['c1_extras', 'pmc_extras', 'm_extras', 'pmc_finais'].forEach(id => {
        const className = id.includes('finais') ? '.pmc-final' : '.extra-input';
        data[id] = Array.from(document.querySelectorAll(`#${id} ${className}`)).map(i => i.value);
    });
    localStorage.setItem('gradesData', JSON.stringify(data));
    calculateAll();
}

function loadData() {
    const saved = localStorage.getItem('gradesData');
    if (saved) {
        const data = JSON.parse(saved);
        for (let id in data) {
            const el = document.getElementById(id);
            if (el && !Array.isArray(data[id])) el.value = data[id];
            if (Array.isArray(data[id])) {
                const className = id.includes('finais') ? 'pmc-final' : 'extra-input';
                data[id].forEach(val => addExtra(id, className, val));
            }
        }
    }
    calculateAll();
}

function calculateAll() { calcC1(); calcPMC(); calcMicro(); }

function getSum(selector) {
    let sum = 0, count = 0;
    document.querySelectorAll(selector).forEach(i => { sum += (parseFloat(i.value) || 0); count++; });
    return { sum, count, avg: count > 0 ? sum / count : 0 };
}

function updateProgress(idBar, idTxt, value) {
    const bar = document.getElementById(idBar);
    const txt = document.getElementById(idTxt);
    bar.style.width = Math.min(value * 10, 100) + '%';

    const isPass = value >= 5.0;
    const statusText = isPass ? 'Aprovado' : 'Reprovado';
    const badgeClass = isPass ? 'status-pass' : 'status-fail';

    txt.innerHTML = `${value.toFixed(1)} <span class="status-badge ${badgeClass}">${statusText}</span>`;
    bar.className = 'progress-bar' + (!isPass ? ' fail' : '');
}

function calcC1() {
    let grades = Array.from(document.querySelectorAll('.c1-grade')).map(i => parseFloat(i.value) || 0);
    const sub = parseFloat(document.getElementById('c1_sub').value) || 0;
    const at = parseFloat(document.getElementById('c1_at').value) || 0;
    const extra = getSum('#c1_extras .extra-input').sum;
    let minIdx = grades.indexOf(Math.min(...grades));
    if (sub > grades[minIdx]) grades[minIdx] = sub;
    updateProgress('barC1', 'txtC1', (grades.reduce((a,b)=>a+b,0)*0.3) + (at*0.1) + extra);
}

function calcPMC() {
    let grades = Array.from(document.querySelectorAll('.pmc-grade')).map(i => parseFloat(i.value) || 0);
    const sub = parseFloat(document.getElementById('pmc_sub').value) || 0;
    const finais = getSum('#pmc_finais .pmc-final').avg;
    const extra = getSum('#pmc_extras .extra-input').sum;
    let minIdx = grades.indexOf(Math.min(...grades));
    if (sub > grades[minIdx]) grades[minIdx] = sub;
    updateProgress('barPMC', 'txtPMC', (grades.reduce((a,b)=>a+b,0)*0.2) + (finais*0.4) + extra);
}

function calcMicro() {
    let grades = Array.from(document.querySelectorAll('.m-grade')).map(i => parseFloat(i.value) || 0);
    const sub = parseFloat(document.getElementById('m_sub').value) || 0;
    const extra = getSum('#m_extras .extra-input').sum;
    let minIdx = grades.indexOf(Math.min(...grades));
    if (sub > grades[minIdx]) grades[minIdx] = sub;
    updateProgress('barM', 'txtM', (grades.reduce((a,b)=>a+b,0)*0.5) + extra);
}

function clearFields(tabId) {
    document.querySelectorAll(`#${tabId} input`).forEach(i => i.value = '');
    document.querySelectorAll(`#${tabId} .extra-list`).forEach(l => l.innerHTML = '');
    saveAndCalc();
}

function renderCal() {
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const examInputs = Array.from(document.querySelectorAll('input[type="date"]'))
        .filter(i => i.value !== '');

    for (let i = 1; i <= daysInMonth; i++) {
        const div = document.createElement('div');
        div.className = 'calendar-day' + (i === now.getDate() ? ' today' : '');
        div.innerText = i;

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

        examInputs.forEach(input => {
            if (input.value === dateStr) {
                const tag = document.createElement('div');
                tag.className = 'event-tag';
                const subject = input.dataset.subject || 'Prova';
                const examName = input.dataset.exam || '';
                tag.innerText = `${subject} - ${examName}`;
                div.appendChild(tag);
            }
        });

        grid.appendChild(div);
    }
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker registrado com sucesso:', registration);
            })
            .catch(error => {
                console.log('Falha no registro do Service Worker:', error);
            });
    });
}
