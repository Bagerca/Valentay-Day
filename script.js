document.addEventListener('DOMContentLoaded', () => {
    // Этот код определяет, на какой мы странице.
    // Если есть элемент 'password', значит мы на странице входа.
    if (document.getElementById('password')) {
        // Ничего не делаем, так как весь код плеера находится внутри startValentine()
    } 
    // Если есть элемент 'player', значит мы на главной странице.
    else if (document.getElementById('player')) {
        const isVerified = sessionStorage.getItem('isVerified');
        if (isVerified !== 'true') { 
            window.location.href = 'index.html'; 
        } else {
            // Запускаем основную функцию ТОЛЬКО на нужной странице
            startValentine();
            sessionStorage.removeItem('isVerified');
        }
    }
});

function checkPassword() {
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const correctPassword = '12345';

    if (passwordInput.value === correctPassword) {
        sessionStorage.setItem('isVerified', 'true');
        window.location.href = 'valentine.html';
    } else {
        errorMessage.textContent = 'Неверный ключ, попробуй еще раз!';
        passwordInput.value = '';
    }
}

// --- БЛОК АНАЛИЗА АУДИО (без изменений) ---
let audioContext, analyser, audioSource, dataArray, bufferLength;
let animationId = null;
let currentPulseIntensity = 0;
let lastBeatTime = 0;
let energyHistory = [];
let energyAverage = 0;

function initAudioAnalyzer(audioElement) {
    if (audioContext) return;
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        audioSource = audioContext.createMediaElementSource(audioElement);
        audioSource.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 256;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
    } catch (error) { console.error("Не удалось инициализировать Web Audio API", error); }
}

function analyzeAudioFeatures() {
    if (!analyser) return { rms: 0, isBeat: false };
    analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) { sum += dataArray[i] * dataArray[i]; }
    const rms = Math.sqrt(sum / bufferLength) / 255;
    energyHistory.push(rms);
    if (energyHistory.length > 30) energyHistory.shift();
    energyAverage = energyHistory.reduce((a, b) => a + b, 0) / energyHistory.length;
    let isBeat = false;
    const currentTime = Date.now();
    const threshold = energyAverage * 1.2 + 0.08; 
    if (rms > threshold && (currentTime - lastBeatTime) > 200) {
        isBeat = true;
        lastBeatTime = currentTime;
        currentPulseIntensity = 1.0;
    }
    if (currentPulseIntensity > 0) { currentPulseIntensity -= 0.07; } else { currentPulseIntensity = 0; }
    return { rms, isBeat };
}

function visualize() {
    const features = analyzeAudioFeatures();
    const leftGlow = document.querySelector('.left-glow');
    const rightGlow = document.querySelector('.right-glow');
    if (leftGlow && rightGlow) {
        let opacity = 0.4 + features.rms * 1.2;
        let blur = 10 + features.rms * 40;
        let spread = 20 + features.rms * 50;
        if (features.isBeat) {
            opacity = 1.0;
            blur = 40 + currentPulseIntensity * 35;
            spread = 55 + currentPulseIntensity * 45;
        }
        const shadowStyle = `0 0 ${blur}px var(--accent-color), 0 0 ${spread}px var(--accent-color)`;
        leftGlow.style.opacity = opacity;
        leftGlow.style.boxShadow = shadowStyle;
        rightGlow.style.opacity = opacity;
        rightGlow.style.boxShadow = shadowStyle;
    }
    animationId = requestAnimationFrame(visualize);
}

// --- ОСНОВНАЯ ФУНКЦИЯ ПРОЕКТА ---
function startValentine() {
    // Все переменные для элементов плеера находятся ЗДЕСЬ.
    // Это гарантирует, что скрипт будет искать их только на нужной странице.
    const audio = document.getElementById('player');
    const card = document.querySelector('.card');
    const image = document.querySelector('.card img');
    const lyricsContainer = document.getElementById('lyrics-container');
    const lyricsDisplay = document.getElementById('lyrics');
    const ghostText = document.getElementById('ghost-text');
    const letterContainer = document.getElementById('letter-container');
    const visualizer = document.getElementById('beat-visualizer');
    const playerContainer = document.getElementById('player-container');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const progressBar = document.getElementById('progress-bar');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const currentTimeDisplay = document.getElementById('current-time');
    const totalDurationDisplay = document.getElementById('total-duration');
    const volumeBtn = document.getElementById('volume-btn');
    const volumeIcon = document.getElementById('volume-icon');
    const muteIcon = document.getElementById('mute-icon');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeSliderFill = document.getElementById('volume-slider-fill');

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
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            lyricsDisplay.textContent = "Нажми, чтобы начать ♡";
            document.body.addEventListener('click', () => { audio.play(); }, { once: true });
        });
    }

    audio.addEventListener('play', () => {
        initAudioAnalyzer(audio);
        if (!animationId) { visualize(); }
        updatePlayButton();
    }, { once: true });
    
    audio.addEventListener('pause', updatePlayButton);

    let fadeInInterval = setInterval(() => {
        if (audio.volume < 0.7) { 
            audio.volume = Math.min(0.7, audio.volume + 0.07);
        } else { clearInterval(fadeInInterval); }
    }, 100);

    // --- Функции управления плеером ---
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function updatePlayButton() {
        playIcon.style.display = audio.paused ? 'block' : 'none';
        pauseIcon.style.display = audio.paused ? 'none' : 'block';
    }

    function updateVolumeIcon() {
        const isMuted = audio.muted || audio.volume === 0;
        volumeIcon.style.display = isMuted ? 'none' : 'block';
        muteIcon.style.display = isMuted ? 'block' : 'none';
    }

    function updateProgress() {
        if (progressBarFill) {
            const progressPercent = (audio.duration > 0) ? (audio.currentTime / audio.duration) * 100 : 0;
            progressBarFill.style.width = `${progressPercent}%`;
            progressBar.value = audio.currentTime;
        }
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
    }

    function updateVolumeSliderFill() {
        if (volumeSliderFill) {
            const percent = audio.muted ? 0 : audio.volume * 100;
            volumeSliderFill.style.width = `${percent}%`;
            volumeSlider.value = audio.volume;
        }
    }

    // --- Обработчики событий плеера ---
    audio.addEventListener('loadedmetadata', () => {
        progressBar.max = audio.duration;
        totalDurationDisplay.textContent = formatTime(audio.duration);
        updateVolumeSliderFill();
    });

    audio.addEventListener('timeupdate', () => {
        updateProgress();
        // Логика смены текста песни
        if (currentEventIndex >= events.length) return;
        if (audio.currentTime >= events[currentEventIndex].time) {
            const currentEvent = events[currentEventIndex];
            if (currentEvent.type === 'lyric' || currentEvent.type === 'ghost') {
                lyricsDisplay.style.opacity = 0;
                ghostText.style.opacity = 0;
                setTimeout(() => {
                    if (currentEvent.type === 'lyric') {
                        lyricsDisplay.innerText = currentEvent.text;
                        lyricsDisplay.style.opacity = 1;
                    } else {
                        ghostText.innerText = currentEvent.text;
                        ghostText.style.opacity = 1;
                    }
                }, 200);
            } else if (currentEvent.type === 'showLetter') {
                displayLetter();
            }
            currentEventIndex++;
        }
    });
    
    audio.addEventListener('volumechange', () => {
        updateVolumeIcon();
        updateVolumeSliderFill();
    });
    
    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) { audio.play(); } else { audio.pause(); }
    });
    
    progressBar.addEventListener('input', () => {
        audio.currentTime = progressBar.value;
    });

    volumeSlider.addEventListener('input', () => {
        audio.muted = false;
        audio.volume = volumeSlider.value;
    });

    volumeBtn.addEventListener('click', () => {
        audio.muted = !audio.muted;
    });
    
    // --- Финальная сцена с письмом ---
    let currentEventIndex = 0;
    function displayLetter() {
        lyricsDisplay.style.opacity = 0;
        ghostText.style.opacity = 0;
        let volumeInterval = setInterval(() => {
            if (audio.volume < 1.0) { 
                audio.volume = Math.min(1.0, audio.volume + 0.05);
            } else { clearInterval(volumeInterval); }
        }, 50);

        setTimeout(() => {
            document.body.classList.add('scrollable');
            lyricsContainer.style.display = 'none';
            card.classList.remove('lyrics-mode');
            image.style.display = 'block';
            playerContainer.style.display = 'block';
            letterContainer.style.display = 'block';
            visualizer.classList.add('visible');
            setTimeout(() => {
                image.style.opacity = 1;
                playerContainer.style.opacity = 1;
                letterContainer.style.opacity = 1;
                
                const letterP = letterContainer.querySelector('p');
                const fullText = `Ты сказала "забить". Я пытался. Не вышло.<br><br>Назвать тебя Спящей Красавицей — ирония, ведь ты вообще не даешь мне спать.<br><br>И хватит себя ругать. Ты даже не представляешь, насколько ты крутая, даже со всеми своими "сложностями". Я вижу твой свет, даже когда ты сама его не замечаешь.<br><br>Понятия не имею, что будет дальше. Знаю только одно: я всё ещё здесь.<br><br><b>Bagerca для Fasil</b>`;
                letterP.innerHTML = ''; 
                
                let i = 0;
                function typeWriter() {
                    if (i < fullText.length) {
                        if (fullText.charAt(i) === '<') {
                            const closingTagIndex = fullText.indexOf('>', i);
                            const tag = fullText.substring(i, closingTagIndex + 1);
                            letterP.innerHTML += tag;
                            i = closingTagIndex + 1;
                        } else {
                            letterP.innerHTML += fullText.charAt(i);
                            i++;
                        }
                        setTimeout(typeWriter, 55); 
                    } else {
                        letterP.classList.add('finished-typing');
                    }
                }
                typeWriter();
            }, 50);
        }, 300);
    }
}
