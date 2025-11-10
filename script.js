// --- Этот код будет работать на обеих страницах ---

document.addEventListener('DOMContentLoaded', () => {
    // Если на странице есть элемент с id 'password', значит это страница входа
    if (document.getElementById('password')) {
        // Код для страницы входа (index.html)
        // Функция checkPassword вызывается по клику на кнопку в HTML
    } 
    // Если есть элемент с id 'player', значит это основная страница
    else if (document.getElementById('player')) {
        // Запускаем основную логику для страницы валентинки
        startValentine();
    }
});


// --- Логика для страницы входа (index.html) ---

function checkPassword() {
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    
    // !!! ВАЖНО: Замените '12345' на ваш настоящий секретный пароль !!!
    const correctPassword = '12345'; 

    if (passwordInput.value === correctPassword) {
        // Если пароль верный, переходим на главную страницу
        window.location.href = 'valentine.html';
    } else {
        // Если пароль неверный, показываем ошибку
        errorMessage.textContent = 'Неверный ключ, попробуй еще раз!';
        passwordInput.value = ''; // Очищаем поле ввода
    }
}


// --- Логика для основной страницы (valentine.html) ---

function startValentine() {
    const audio = document.getElementById('player');
    const lyricsContainer = document.getElementById('lyrics-container');
    const lyricsDisplay = document.getElementById('lyrics');
    const letterContainer = document.getElementById('letter-container');

    // Устанавливаем начальное время воспроизведения на 23 секунды
    audio.currentTime = 23;

    // Массив событий: 4 строчки песни и 1 событие для показа письма
    const events = [
        { time: 23, text: "И я подонок, я изменщик, я gaslighter и абьюзер", type: 'lyric' },
        { time: 27, text: "Я не нравлюсь твоей маме, да и хуй с ней", type: 'lyric' },
        { time: 31, text: "Детка, хватит мне уже давать последний шанс", type: 'lyric' },
        { time: 35, text: "Счастье — это не для нас", type: 'lyric' },
        // Специальное событие: в 39 секунд показываем письмо
        { time: 39, type: 'showLetter' } 
    ];

    // Пытаемся запустить аудио
    audio.play().catch(error => {
        console.log("Воспроизведение заблокировано браузером. Требуется действие пользователя.");
        lyricsDisplay.textContent = "Нажми, чтобы начать ♡";
        document.body.addEventListener('click', () => {
            audio.currentTime = 23; // Убедимся, что при клике тоже начнется с 23 сек
            audio.play();
        }, { once: true });
    });

    let currentEventIndex = 0;

    // Эта функция следит за временем песни и запускает события
    audio.addEventListener('timeupdate', function() {
        if (currentEventIndex >= events.length) return; // Если все события прошли, ничего не делаем

        if (audio.currentTime >= events[currentEventIndex].time) {
            const currentEvent = events[currentEventIndex];

            if (currentEvent.type === 'lyric') {
                // Показываем строчку песни
                lyricsDisplay.style.opacity = 0;
                setTimeout(() => {
                    lyricsDisplay.textContent = currentEvent.text;
                    lyricsDisplay.style.opacity = 1;
                }, 300);
            } 
            else if (currentEvent.type === 'showLetter') {
                // Показываем письмо
                displayLetter();
            }
            
            currentEventIndex++;
        }
    });

    // Функция для плавного перехода от текста песни к письму
    function displayLetter() {
        // Плавно прячем текст песни
        lyricsContainer.style.opacity = 0;
        setTimeout(() => {
            lyricsContainer.style.display = 'none';
        }, 500); // 0.5с

        // Плавно показываем письмо
        letterContainer.style.display = 'block';
        setTimeout(() => {
            letterContainer.style.opacity = 1;
        }, 600);
    }
}
