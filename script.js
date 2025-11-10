// --- Этот код будет работать на обеих страницах ---

// Проверяем, какая сейчас страница, чтобы выполнить нужный код
document.addEventListener('DOMContentLoaded', () => {
    // Если на странице есть элемент с id 'password', значит это страница входа
    if (document.getElementById('password')) {
        // Код для login.html
        // Функция checkPassword вызывается по клику на кнопку в HTML
    } 
    // Если есть элемент с id 'player', значит это основная страница
    else if (document.getElementById('player')) {
        // Код для index.html
        startValentine();
    }
});


// --- Логика для страницы входа (login.html) ---

function checkPassword() {
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    
    // !!! ВАЖНО: Замените '12345' на ваш настоящий секретный пароль
    const correctPassword = '12345'; 

    if (passwordInput.value === correctPassword) {
        // Если пароль верный, переходим на главную страницу
        window.location.href = 'index.html';
    } else {
        // Если пароль неверный, показываем ошибку
        errorMessage.textContent = 'Неверный ключ, попробуй еще раз!';
        passwordInput.value = ''; // Очищаем поле ввода
    }
}


// --- Логика для основной страницы (index.html) ---

function startValentine() {
    const audio = document.getElementById('player');
    const lyricsDisplay = document.getElementById('lyrics');

    // !!! ВАЖНО: Настройте тайминги и текст песни здесь
    // time: время в секундах, когда должна появиться строчка
    // text: текст строчки
    const lyrics = [
        { time: 0, text: "Ты готова?" },
        { time: 2.5, text: "Ты — моя последняя любовь" },
        { time: 6, text: "Моя последняя любовь" },
        { time: 9.5, text: "Я не хочу другую" },
        { time: 13, text: "Мне не нужна другая" },
        { time: 16.5, text: "Ты — моя последняя любовь" },
        { time: 20, text: "И первая тоже..." },
        { time: 24, text: "С Днём Святого Валентина!" },
        // ... Добавьте столько строчек, сколько нужно
    ];

    // Пытаемся запустить аудио автоматически
    // Современные браузеры могут блокировать это до первого клика.
    // Переход со страницы логина часто считается таким взаимодействием.
    audio.play().catch(error => {
        console.log("Воспроизведение заблокировано браузером. Требуется действие пользователя.");
        // Как запасной вариант, можно показать кнопку "Начать"
        lyricsDisplay.textContent = "Нажми, чтобы начать ♡";
        document.body.addEventListener('click', () => {
            audio.play();
        }, { once: true }); // Cработает только один раз
    });

    let currentLyricIndex = 0;

    // Эта функция будет вызываться каждый раз, когда меняется время воспроизведения
    audio.addEventListener('timeupdate', function() {
        // Проверяем, есть ли еще строчки и подошло ли время для следующей
        if (currentLyricIndex < lyrics.length && audio.currentTime >= lyrics[currentLyricIndex].time) {
            lyricsDisplay.style.opacity = 0; // Делаем текст прозрачным
            
            // Ждем завершения анимации исчезновения, а потом меняем текст
            setTimeout(() => {
                lyricsDisplay.textContent = lyrics[currentLyricIndex].text;
                lyricsDisplay.style.opacity = 1; // Делаем текст видимым
                currentLyricIndex++;
            }, 300); // 300 миллисекунд
        }
    });

    // Когда песня закончится, можно показать финальное сообщение
    audio.addEventListener('ended', function() {
        lyricsDisplay.textContent = "Я тебя люблю ❤️";
    });
}```

### Что делать дальше:

1.  **Создайте 4 файла** с указанными именами и скопируйте в них соответствующий код.
2.  **Добавьте музыку**: Найдите песню "Последняя любовь", переименуйте файл в `music.mp3` и положите его в ту же папку, где лежат все остальные файлы.
3.  **Настройте пароль**: В файле `script.js` найдите строку `const correctPassword = '12345';` и измените пароль на свой.
4.  **Настройте тайминги**: Включите песню и с помощью секундомера запишите, на какой секунде начинается каждая фраза. Затем отредактируйте массив `lyrics` в файле `script.js`.
5.  **Загрузите на GitHub**: Загрузите все пять файлов (`login.html`, `index.html`, `style.css`, `script.js`, `music.mp3`) в один репозиторий на GitHub и опубликуйте его через GitHub Pages.

Ваша интерактивная валентинка готова
