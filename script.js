document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('password')) {
        // Логика для страницы входа (index.html)
    } 
    else if (document.getElementById('player')) {
        // --- ЛОГИКА ЗАЩИТЫ СТРАНИЦЫ ---
        // Проверяем, есть ли в хранилище сессии "ключ"
        const isVerified = sessionStorage.getItem('isVerified');

        if (isVerified !== 'true') {
            // Если ключа нет — отправляем на страницу входа
            window.location.href = 'index.html';
        } else {
            // Если ключ есть — запускаем валентинку
            startValentine();
            // И сразу же удаляем ключ. Теперь при перезагрузке страницы его не будет,
            // и пользователя снова перекинет на страницу входа.
            sessionStorage.removeItem('isVerified');
        }
    }
});

function checkPassword() {
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    
    // !!! ВАЖНО: Замените '12345' на ваш настоящий секретный пароль
    const correctPassword = '12345'; 

    if (passwordInput.value === correctPassword) {
        // --- ЛОГИКА ВХОДА ---
        // Перед переходом на страницу валентинки, создаем "ключ" в хранилище сессии
        sessionStorage.setItem('isVerified', 'true');
        window.location.href = 'valentine.html';
    } else {
        errorMessage.textContent = 'Неверный ключ, попробуй еще раз!';
        passwordInput.value = '';
    }
}

function startValentine() {
    const audio = document.getElementById('player');
    const card = document.querySelector('.card'); // Находим карточку
    const image = document.querySelector('.card img'); // Находим картинку
    const lyricsContainer = document.getElementById('lyrics-container');
    const lyricsDisplay = document.getElementById('lyrics');
    const letterContainer = document.getElementById('letter-container');
    
    // --- УПРАВЛЕНИЕ ВИЗУАЛОМ ---
    // Сразу же скрываем фон карточки и картинку
    card.classList.add('lyrics-mode');
    image.style.opacity = 0;
    image.style.display = 'none'; // Также убираем из потока

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
                }, 150); // Уменьшили задержку для резкости
            } 
            else if (currentEvent.type === 'showLetter') {
                displayLetter();
            }
            currentEventIndex++;
        }
    });

    function displayLetter() {
        lyricsContainer.style.opacity = 0;
        
        // --- Возвращаем фон и картинку на место ---
        card.classList.remove('lyrics-mode');
        image.style.display = 'block';
        setTimeout(() => { // Небольшая задержка, чтобы display сработал до opacity
             image.style.opacity = 1;
        }, 50);

        setTimeout(() => {
            lyricsContainer.style.display = 'none';
        }, 500);

        letterContainer.style.display = 'block';
        setTimeout(() => {
            letterContainer.style.opacity = 1;
        }, 600);
    }
}
