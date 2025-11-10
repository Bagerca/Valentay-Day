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
    const ghostText = document.getElementById('ghost-text');
    const letterContainer = document.getElementById('letter-container');

    card.classList.add('lyrics-mode');
    image.style.opacity = 0;
    image.style.display = 'none';
    audio.currentTime = 23;

    // ИЗМЕНЕНО: Полностью переработанная временная шкала событий
    const events = [
        { time: 23, type: 'lyric', text: "И я подонок, я изменщик,\nя gaslighter и абьюзер" },
        { time: 27, type: 'lyric', text: "Я не нравлюсь твоей маме,\nда и хуй с ней" },
        { time: 30, type: 'ghost', text: "(ну допустим)" },
        { time: 31, type: 'lyric', text: "Детка, хватит мне уже давать\nпоследний шанс" },
        { time: 34.5, type: 'ghost', text: "(ага)" }, // Появляется чуть раньше для эффекта
        { time: 35, type: 'lyric', text: "Счастье — это не для нас" },
        { time: 38.5, type: 'showLetter' }
    ];

    audio.volume = 0;
    audio.play().catch(error => {
        lyricsDisplay.textContent = "Нажми, чтобы начать ♡";
        document.body.addEventListener('click', () => { audio.play(); }, { once: true });
    });

    let fadeInInterval = setInterval(() => {
        if (audio.volume < 0.7) { audio.volume = Math.min(0.7, audio.volume + 0.07); } 
        else { clearInterval(fadeInInterval); }
    }, 100);

    let currentEventIndex = 0;
    audio.addEventListener('timeupdate', function() {
        if (currentEventIndex >= events.length) return;
        if (audio.currentTime >= events[currentEventIndex].time) {
            const currentEvent = events[currentEventIndex];

            // ИЗМЕНЕНО: Новая логика для управления текстами
            if (currentEvent.type === 'lyric') {
                ghostText.style.opacity = 0; // Прячем призрак
                lyricsDisplay.innerText = currentEvent.text;
                lyricsDisplay.style.opacity = 1; // Показываем основной текст
            } 
            else if (currentEvent.type === 'ghost') {
                lyricsDisplay.style.opacity = 0; // Прячем основной текст
                ghostText.innerText = currentEvent.text;
                ghostText.style.opacity = 1; // Показываем призрак
            }
            else if (currentEvent.type === 'showLetter') {
                displayLetter();
            }
            currentEventIndex++;
        }
    });

    function displayLetter() {
        lyricsDisplay.style.opacity = 0;
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
        }, 300);
    }
}
