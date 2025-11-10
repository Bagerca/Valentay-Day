document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('password')) {
        // Логика для страницы входа
    } 
    else if (document.getElementById('player')) {
        const isVerified = sessionStorage.getItem('isVerified');
        if (isVerified !== 'true') {
            window.location.href = 'index.html';
        } else {
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
    const audio = document.getElementById('player');
    const card = document.querySelector('.card');
    const image = document.querySelector('.card img');
    const lyricsContainer = document.getElementById('lyrics-container');
    const lyricsDisplay = document.getElementById('lyrics');
    const letterContainer = document.getElementById('letter-container');
    
    // --- ИЗМЕНЕНО: Управление визуалом и громкостью ---
    card.classList.add('lyrics-mode');
    image.style.opacity = 0;
    image.style.display = 'none';
    audio.volume = 0.7; // Устанавливаем громкость на 70%
    audio.currentTime = 23;

    const events = [
        { time: 23, text: "И я подонок, я изменщик, я gaslighter и абьюзер", type: 'lyric' },
        { time: 27, text: "Я не нравлюсь твоей маме, да и хуй с ней", type: 'lyric' },
        { time: 31, text: "Детка, хватит мне уже давать последний шанс", type: 'lyric' },
        { time: 35, text: "Счастье — это не для нас", type: 'lyric' },
        { time: 39, type: 'showLetter' } 
    ];

    audio.play().catch(error => {
        lyricsDisplay.textContent = "Нажми, чтобы начать ♡";
        document.body.addEventListener('click', () => {
            audio.currentTime = 23;
            audio.play();
        }, { once: true });
    });

    let currentEventIndex = 0;
    audio.addEventListener('timeupdate', function() {
        if (currentEventIndex >= events.length) return;
        if (audio.currentTime >= events[currentEventIndex].time) {
            const currentEvent = events[currentEventIndex];
            if (currentEvent.type === 'lyric') {
                lyricsDisplay.style.opacity = 0;
                setTimeout(() => {
                    lyricsDisplay.textContent = currentEvent.text;
                    lyricsDisplay.style.opacity = 1;
                }, 200);
            } 
            else if (currentEvent.type === 'showLetter') {
                displayLetter();
            }
            currentEventIndex++;
        }
    });

    function displayLetter() {
        // --- ИЗМЕНЕНО: НОВАЯ ЛОГИКА ПЕРЕХОДА ---
        // 1. Плавно прячем текст песни
        lyricsContainer.style.opacity = 0;

        // 2. Начинаем плавно увеличивать громкость до 100%
        let volumeInterval = setInterval(() => {
            if (audio.volume < 1.0) {
                // Math.min, чтобы случайно не превысить 1.0
                audio.volume = Math.min(1.0, audio.volume + 0.02);
            } else {
                clearInterval(volumeInterval);
            }
        }, 50); // Увеличиваем громкость каждые 50мс

        // 3. Через полсекунды после исчезновения текста начинаем показывать фон
        setTimeout(() => {
            lyricsContainer.style.display = 'none'; // Убираем окончательно
            card.classList.remove('lyrics-mode'); // Запускает плавное появление фона
            
            // 4. Показываем картинку и письмо уже ВНУТРИ появившегося фона
            image.style.display = 'block';
            letterContainer.style.display = 'block';
            
            // Небольшая задержка для срабатывания display, затем включаем opacity
            setTimeout(() => {
                image.style.opacity = 1;
                letterContainer.style.opacity = 1;
            }, 100);

        }, 500); // 500ms = 0.5s
    }
}
