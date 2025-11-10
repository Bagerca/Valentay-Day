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

function startValentine() {
    // --- Основные элементы ---
    const audio = document.getElementById('player');
    const card = document.querySelector('.card');
    const lyricsContainer = document.getElementById('lyrics-container');
    const lyricsDisplay = document.getElementById('lyrics');
    const ghostText = document.getElementById('ghost-text');
    const letterContainer = document.getElementById('letter-container');
    
    // --- ДОБАВЛЕНО: Элементы для визуалайзера ---
    const canvas = document.getElementById('visualizer');
    const ctx = canvas.getContext('2d');
    let audioContext, analyser, source, dataArray;
    let isVisualizerInitialized = false;

    card.classList.add('lyrics-mode');
    audio.currentTime = 23;

    const events = [ /* ... (массив events остается без изменений) ... */ ];
    
    // ... (код для audio.play(), fadeInInterval, timeupdate остается без изменений) ...

    function displayLetter() {
        lyricsDisplay.style.opacity = 0;
        ghostText.style.opacity = 0;

        let volumeInterval = setInterval(() => { /* ... (без изменений) ... */ });

        setTimeout(() => {
            lyricsContainer.style.display = 'none';
            card.classList.remove('lyrics-mode');
            letterContainer.style.display = 'block';

            // ИЗМЕНЕНО: Показываем письмо и ЗАПУСКАЕМ ВИЗУАЛАЙЗЕР
            setTimeout(() => {
                letterContainer.style.opacity = 1;
                // Показываем холст и инициализируем визуалайзер
                canvas.style.opacity = 1;
                if (!isVisualizerInitialized) {
                    initVisualizer();
                }
            }, 50);
        }, 300);
    }
    
    // --- ДОБАВЛЕНО: ВСЯ ЛОГИКА ВИЗУАЛАЙЗЕРА ---
    function initVisualizer() {
        isVisualizerInitialized = true;
        // 1. Настройка Web Audio API
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        source = audioContext.createMediaElementSource(audio);

        // Соединяем всё в цепочку: источник -> анализатор -> выход (колонки)
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        // Настройка анализатора
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        // Запускаем цикл отрисовки
        drawVisualizer();
    }

    function drawVisualizer() {
        // Зацикливаем анимацию
        requestAnimationFrame(drawVisualizer);

        // Получаем данные о частотах в реальном времени
        analyser.getByteFrequencyData(dataArray);

        // Очищаем холст
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / dataArray.length) * 2;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
            const barHeight = dataArray[i] / 2;

            // Рисуем столбик
            ctx.fillStyle = `rgba(220, 20, 60, 0.8)`; // Алый цвет
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 1; // +1 для отступа между столбиками
        }
    }
}
