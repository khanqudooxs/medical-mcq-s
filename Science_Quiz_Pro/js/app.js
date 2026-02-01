/**
 * Science Quiz Pro - Unified Master Logic
 */

let quizData = [];
let currentIndex = 0;
let score = 0;
let currentTopic = "";

// Reference to our pre-built library
// MASTER_LIBRARY is loaded from data/master_library.js
const DB = typeof MASTER_LIBRARY !== 'undefined' ? MASTER_LIBRARY : null;

function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
}

// Initial Landing Logic
function updateLibraryStats() {
    if (!DB) {
        console.error("Library not loaded correctly.");
        return;
    }

    let totalQ = 0;
    Object.keys(DB).forEach(sub => {
        Object.keys(DB[sub]).forEach(topic => {
            totalQ += DB[sub][topic].length;
        });
    });

    // Add a subtle status on landing
    const statsDiv = document.createElement('div');
    statsDiv.style.cssText = "margin-top: 20px; color: #00ff88; font-weight: 600; font-size: 0.9rem; opacity: 0.8;";
    statsDiv.innerHTML = `<i class="fas fa-check-double"></i> ${totalQ.toLocaleString()} MCQs Automatically Loaded & Ready`;
    document.querySelector('.hero').appendChild(statsDiv);
}

// Subject Selection
function selectSubject(s) {
    if (!DB || !DB[s]) {
        alert("Wait! The library for this subject is still loading or missing. Please refresh.");
        return;
    }

    document.getElementById('subject-title').innerText = `${s} Master Books`;
    const list = document.getElementById('topic-list');
    list.innerHTML = '';

    const subjectContent = DB[s];
    const sortedTopics = Object.keys(subjectContent).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    sortedTopics.forEach((title, idx) => {
        const item = document.createElement('div');
        item.className = 'topic-item animate-up';
        item.style.animationDelay = `${idx * 0.03}s`;
        item.innerHTML = `
            <div class="topic-num">${idx + 1}</div>
            <div class="topic-info">
                <strong>${title}</strong>
                <p>${subjectContent[title].length} Questions | Auto-Loaded <i class="fas fa-bolt" style="color: #ff9f43"></i></p>
            </div>
        `;
        item.onclick = () => {
            quizData = subjectContent[title];
            currentTopic = title;
            document.getElementById('mode-title').innerText = currentTopic;
            showView('mode-select');
        };
        list.appendChild(item);
    });

    showView('topics');
}

// Modes
function initQuizMode() {
    currentIndex = 0; score = 0;
    document.getElementById('quiz-topic-name').innerText = currentTopic;
    renderQuizQ();
    showView('quiz');
}

function initBookMode() {
    document.getElementById('book-header-title').innerText = currentTopic;
    const container = document.getElementById('book-content');
    container.innerHTML = '';

    quizData.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'book-q-item';
        div.innerHTML = `
            <h4>${idx + 1}. ${item.q}</h4>
            <div class="book-options">
                <div class="book-opt">A) ${item.o[0]}</div>
                <div class="book-opt">B) ${item.o[1]}</div>
                <div class="book-opt">C) ${item.o[2] || ''}</div>
                <div class="book-opt">D) ${item.o[3] || ''}</div>
            </div>
            <button class="btn-secondary btn-sm" onclick="this.nextElementSibling.classList.toggle('visible')">Reveal Answer</button>
            <div class="book-answer">Correct Answer: ${String.fromCharCode(65 + item.a)}</div>
        `;
        container.appendChild(div);
    });
    showView('book-mode');
    if (window.MathJax) MathJax.typesetPromise();
}

// Core Quiz Logic
function renderQuizQ() {
    if (!quizData[currentIndex]) return;
    const item = quizData[currentIndex];
    document.getElementById('current-q-num').innerText = currentIndex + 1;
    document.getElementById('question-text').innerText = item.q;
    const cont = document.getElementById('options-container');
    cont.innerHTML = '';
    item.o.forEach((o, i) => {
        const optLine = document.createElement('div');
        optLine.className = 'option';
        optLine.innerText = `${String.fromCharCode(65 + i)}) ${o}`;
        optLine.onclick = () => checkAns(i);
        cont.appendChild(optLine);
    });
    document.getElementById('next-btn').disabled = true;
    updateProg();
    if (window.MathJax) MathJax.typesetPromise();
}

function checkAns(i) {
    const correct = quizData[currentIndex].a;
    const opts = document.querySelectorAll('.option');
    opts.forEach(o => o.style.pointerEvents = 'none');
    if (i === correct) { opts[i].classList.add('correct'); score++; }
    else { opts[i].classList.add('wrong'); opts[correct].classList.add('correct'); }
    document.getElementById('next-btn').disabled = false;
}

function handleNext() {
    currentIndex++;
    if (currentIndex < quizData.length) renderQuizQ();
    else {
        showView('results');
        document.getElementById('score-val').innerText = score;
        document.getElementById('score-pct').innerText = `${Math.round((score / quizData.length) * 100)}%`;
    }
}

function updateProg() {
    document.getElementById('q-progress-fill').style.width = `${(currentIndex / quizData.length) * 100}%`;
}

function toggleAllAnswers() {
    document.querySelectorAll('.book-answer').forEach(a => a.classList.toggle('visible'));
}

function startSampleQuiz() {
    if (DB && DB['Physics'] && DB['Physics']['Topic 01 Measurements']) {
        quizData = DB['Physics']['Topic 01 Measurements'];
        currentTopic = "Topic 01 Measurements";
        document.getElementById('mode-title').innerText = currentTopic;
        showView('mode-select');
    } else {
        alert("Library loading... please wait 1 second.");
    }
}

// Initialize
window.onload = () => {
    updateLibraryStats();
};
