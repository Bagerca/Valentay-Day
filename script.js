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
    const audio = document.getElementById('player');
    const card = document.querySelector('.card');
    const image = document.querySelector('.card img');
    const lyricsContainer = document.getElementById('lyrics-container');
    const lyricsDisplay = document.getElementById('lyrics');
    const ghostText = document.getElementById('ghost-text'); // Находим новый элемент

    card.classList.add('lyrics-mode');
    image.style.opacity = 0;
    image.style.display = 'none';
    audio.currentTime = 23;

    // ИЗМЕНЕНО: Добавляем \n для переноса строк и свойство ghost для "призрачного" текста
    const events = [
        { time: 23, text: "И я подонок, я изменщик,\nя gaslighter и абьюзер", type: 'lyric' },
        { time: 27, text: "Я не нравлюсь твоей маме,\nда и хуй с ней", type: 'lyric', ghost: "(ну допустим)" },
        { time: 31, text: "Детка, хватит мне уже давать\nпоследний шанс", type: 'lyric', ghost: "(ага)"},
        { time: 35, text: "Счастье — это не для нас", type: 'lyric' },
        { time: 38.5, type: 'showLetter' } // ИЗМЕНЕНО: Ускоряем появление письма
    ];

    // ИЗМЕНЕНО: Логика плавного старта звука
    audio.volume = 0; // Начинаем с тишины
    audio.play().catch(error => {
        lyricsDisplay.textContent = "Нажми, чтобы начать ♡";
        document.body.addEventListener('click', () => { audio.play(); }, { once: true });
    });

    // Плавно увеличиваем громкость до 70% за 1 секунду
    let fadeInInterval = setInterval(() => {
        if (audio.volume < 0.7) {
            audio.volume = Math.min(0.7, audio.volume + 0.07);
        } else {
            clearInterval(fadeInInterval);
        }
    }, 100);

    let currentEventIndex = 0;
    audio.addEventListener('timeupdate', function() {
        if (currentEventIndex >= events.length) return;
        if (audio.currentTime >= events[currentEventIndex].time) {
            const currentEvent = events[currentEventIndex];
            if (currentEvent.type === 'lyric') {
                lyricsDisplay.style.opacity = 0;
                ghostText.style.opacity = 0; // Прячем "призрак" перед сменой основной строки
                setTimeout(() => {
                    lyricsDisplay.innerText = currentEvent.text; // innerText правильно обработает \n
                    lyricsDisplay.style.opacity = 1;
                    if (currentEvent.ghost) {
                        ghostText.innerText = currentEvent.ghost;
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

    function displayLetter() {
        // ИЗМЕНЕНО: Новая, быстрая и плавная логика перехода
        lyricsContainer.style.opacity = 0;
        ghostText.style.opacity = 0;

        let volumeInterval = setInterval(() => {
            if (audio.volume < 1.0) { audio.volume = Math.min(1.0, audio.volume + 0.05); } 
            else { clearInterval(volumeInterval); }
        }, 50);

        setTimeout(() => {
            lyricsContainer.style.display = 'none';
            card.classList.remove('lyrics-mode');
            image.style.display = 'block';
            letterContainer.style.display = 'block';
            setTimeout(() => {
                image.style.opacity = 1;
                letterContainer.style.opacity = 1;
            }, 50);
        }, 300); // ИЗМЕНЕНО: Уменьшили задержку
    }
}
