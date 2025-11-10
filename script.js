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

// --- БЛОК АНАЛИЗА АУДИО ---
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
    } catch (error) {
        console.error("Не удалось инициализировать Web Audio API", error);
    }
}

function analyzeAudioFeatures() {
    if (!analyser) return { rms: 0, isBeat: false };
    analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i] * dataArray[i];
    }
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
    if (currentPulseIntensity > 0) {
        currentPulseIntensity -= 0.07; 
    } else {
        currentPulseIntensity = 0;
    }
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

// --- КОНЕЦ БЛОКА АНАЛИЗА АУДИО ---

function startValentine() {
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
    const currentTimeDisplay = document.getElementById('current-time');
    const totalDurationDisplay = document.getElementById('total-duration');
    const volumeBtn = document.getElementById('volume-btn');
    const volumeIcon = document.getElementById('volume-icon');
    const muteIcon = document.getElementById('mute-icon');
    const volumeSlider = document.getElementById('volume-slider');

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
            document.body.addEventListener('click', () => { 
                audio.play();
            }, { once: true });
        });
    }

    audio.addEventListener('play', () => {
        initAudioAnalyzer(audio);
        if (!animationId) {
            visualize();
        }
        updatePlayButton();
    }, { once: true });
    
    audio.addEventListener('pause', updatePlayButton);

    let fadeInInterval = setInterval(() => {
        if (audio.volume < 0.7) { 
            const newVolume = Math.min(0.7, audio.volume + 0.07);
            audio.volume = newVolume;
            volumeSlider.value = newVolume;
        } 
        else { clearInterval(fadeInInterval); }
    }, 100);

    let currentEventIndex = 0;
    audio.addEventListener('timeupdate', function() {
        updateProgress();
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
            }
            else if (currentEvent.type === 'showLetter') {
                displayLetter();
            }
            currentEventIndex++;
        }
    });

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function updatePlayButton() {
        if (audio.paused) {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        } else {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        }
    }

    function updateVolumeIcon() {
        if (audio.muted || audio.volume === 0) {
            volumeIcon.style.display = 'none';
            muteIcon.style.display = 'block';
        } else {
            volumeIcon.style.display = 'block';
            muteIcon.style.display = 'none';
        }
    }

    function updateProgress() {
        progressBar.value = audio.currentTime;
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
        const progressPercent = (audio.duration > 0) ? (audio.currentTime / audio.duration) * 100 : 0;
        progressBar.style.setProperty('--progress-percent', `${progressPercent}%`);
    }

    // ИЗМЕНЕНО: Новая функция для обновления заливки ползунка громкости
    function updateVolumeSliderFill() {
        const percent = audio.muted ? 0 : audio.volume * 100;
        volumeSlider.style.setProperty('--volume-percent', `${percent}%`);
    }
    
    audio.addEventListener('loadedmetadata', () => {
        progressBar.max = audio.duration;
        totalDurationDisplay.textContent = formatTime(audio.duration);
        updateVolumeSliderFill(); // Устанавливаем начальное состояние
    });
    
    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    });
    
    progressBar.addEventListener('input', () => {
        audio.currentTime = progressBar.value;
    });

    volumeSlider.addEventListener('input', () => {
        audio.muted = false;
        audio.volume = volumeSlider.value;
        updateVolumeIcon();
    });

    volumeBtn.addEventListener('click', () => {
        audio.muted = !audio.muted;
        volumeSlider.value = audio.muted ? 0 : audio.volume;
        updateVolumeIcon();
    });
    
    audio.addEventListener('volumechange', () => {
        if (!audio.muted) {
            volumeSlider.value = audio.volume;
        }
        updateVolumeIcon();
        updateVolumeSliderFill(); // Обновляем заливку при любом изменении громкости
    });
    
    function displayLetter() {
        lyricsDisplay.style.opacity = 0;
        ghostText.style.opacity = 0;
        let volumeInterval = setInterval(() => {
            if (audio.volume < 1.0) { 
                const newVolume = Math.min(1.0, audio.volume + 0.05);
                audio.volume = newVolume;
                volumeSlider.value = newVolume;
            } 
            else { clearInterval(volumeInterval); }
        }, 50);

        setTimeout(() => {
            // ИЗМЕНЕНО: Добавляем класс для включения скролла
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
