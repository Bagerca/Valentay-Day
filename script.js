// ... (DOMContentLoaded и checkPassword остаются без изменений)
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('password')) {
        // Логика для страницы входа
    } 
    else if (document.getElementById('player')) {
        const isVerified = sessionStorage.getItem('isVerified');
        if (isVerified !== 'true') { window.location.href = 'index.html'; } 
        else {
            startValentine();
            sessionStorage.removeItem('isVerified');
        }
    }
});
function checkPassword() {
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const correctPassword = '12345'; // !!! НЕ ЗАБУДЬ ПОМЕНЯТЬ ПАРОЛЬ

    if (passwordInput.value === correctPassword) {
        sessionStorage.setItem('isVerified', 'true');
        window.location.href = 'valentine.html';
    } else {
        errorMessage.textContent = 'Неверный ключ, попробуй еще раз!';
        passwordInput.value = '';
    }
}


// ... (Блок анализа аудио остается без изменений)
let audioContext, analyser, audioSource, dataArray, bufferLength;
let animationId = null;
let currentPulseIntensity = 0;
let lastBeatTime = 0;
let energyHistory = [];
let energyAverage = 0;

function initAudioAnalyzer(audioElement) { /* ... */ }
function analyzeAudioFeatures() { /* ... */ }
function visualize() { /* ... */ }


// --- НАЧАЛО ОСНОВНОЙ ЛОГИКИ ---

// Иконки для кнопки Play/Pause
const playIconSVG = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
const pauseIconSVG = '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

function startValentine() {
    const audio = document.getElementById('player');
    const card = document.querySelector('.card');
    const image = document.querySelector('.card img');
    const lyricsContainer = document.getElementById('lyrics-container');
    const lyricsDisplay = document.getElementById('lyrics');
    const ghostText = document.getElementById('ghost-text');
    const letterContainer = document.getElementById('letter-container');
    const visualizer = document.getElementById('beat-visualizer');
    
    // НОВЫЕ ЭЛЕМЕНТЫ МИНИ-ПЛЕЕРА
    const miniPlayer = document.getElementById('miniPlayer');
    const miniPlayPauseBtn = document.getElementById('miniPlayPauseBtn');
    const miniProgressBar = document.getElementById('miniProgressBar');
    const miniProgress = document.getElementById('miniProgress');

    // ... (остальной код до playPromise без изменений)
    card.classList.add('lyrics-mode');
    image.style.opacity = 0;
    image.style.display = 'none';
    audio.currentTime = 23;
    const events = [
        { time: 23, type: 'lyric', text: "И я подонок, я изменщик,\nя gaslighter и абьюзер" },
        { time: 27, type: 'lyric', text: "Я не нравлюсь твоей маме,\nда и хуй с ней" },
        { time: 30, type: 'ghost', text: "(ну допустим)" },
        { time: 31, type: 'lyric', text: "Детка, хватит мне уже давать\nпоследний шанс" },
        { time: 34.5, type: 'ghost', text: "(ага)" },
        { time: 35, type: 'lyric', text: "Счастье — это не для нас" },
        { time: 38.5, type: 'showLetter' }
    ];
    audio.volume = 0;
    const playPromise = audio.play();
    playPromise.catch(error => { /* ... */ });
    audio.addEventListener('play', () => { /* ... */ }, { once: true });
    let fadeInInterval = setInterval(() => { /* ... */ }, 100);

    // ОСНОВНОЙ ОБРАБОТЧИК ВРЕМЕНИ ДЛЯ СТРОК
    let currentEventIndex = 0;
    const lyricsTimeUpdater = () => {
        if (currentEventIndex >= events.length) {
            audio.removeEventListener('timeupdate', lyricsTimeUpdater); // Отключаем, когда строки закончились
            return;
        }
        if (audio.currentTime >= events[currentEventIndex].time) {
            const currentEvent = events[currentEventIndex];
            if (currentEvent.type === 'lyric' || currentEvent.type === 'ghost') { /* ... */ } 
            else if (currentEvent.type === 'showLetter') { displayLetter(); }
            currentEventIndex++;
        }
    };
    audio.addEventListener('timeupdate', lyricsTimeUpdater);

    // НОВЫЙ ОБРАБОТЧИК ВРЕМЕНИ ДЛЯ ПРОГРЕСС-БАРА (работает всегда)
    const progressUpdater = () => {
        if (audio.duration) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            miniProgress.style.width = `${progressPercent}%`;
        }
    };
    audio.addEventListener('timeupdate', progressUpdater);

    // НОВЫЕ ОБРАБОТЧИКИ ДЛЯ СИНХРОНИЗАЦИИ КНОПКИ
    audio.addEventListener('play', () => {
        miniPlayPauseBtn.innerHTML = pauseIconSVG;
    });
    audio.addEventListener('pause', () => {
        miniPlayPauseBtn.innerHTML = playIconSVG;
    });

    // НОВЫЕ ОБРАБОТЧИКИ КЛИКОВ ДЛЯ МИНИ-ПЛЕЕРА
    miniPlayPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    });

    miniProgressBar.addEventListener('click', (e) => {
        if (audio.duration) {
            const barWidth = miniProgressBar.clientWidth;
            const clickX = e.offsetX;
            audio.currentTime = (clickX / barWidth) * audio.duration;
        }
    });

    function displayLetter() {
        lyricsDisplay.style.opacity = 0;
        ghostText.style.opacity = 0;
        let volumeInterval = setInterval(() => { /* ... */ }, 50);

        setTimeout(() => {
            lyricsContainer.style.display = 'none';
            card.classList.remove('lyrics-mode');
            image.style.display = 'block';
            letterContainer.style.display = 'block';
            visualizer.classList.add('visible');

            // ПОКАЗЫВАЕМ МИНИ-ПЛЕЕР
            miniPlayer.style.display = 'flex';
            setTimeout(() => {
                image.style.opacity = 1;
                letterContainer.style.opacity = 1;
                miniPlayer.style.opacity = 1; // Делаем его видимым
            }, 50);

            // ... (остальной код с печатной машинкой)
            const letterP = letterContainer.querySelector('p');
            const fullText = `...`; // Ваш текст письма
            typeWriter(); // Вызов функции
            
        }, 300);
    }
}
