// ИЗМЕНЕНО: Упрощенная логика, так как все на одной странице
function checkPassword() {
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const correctPassword = '12345'; // !!! НЕ ЗАБУДЬ ПОМЕНЯТЬ ПАРОЛЬ

    if (passwordInput.value === correctPassword) {
        // Пароль верный. Начинаем переход.
        const loginScreen = document.getElementById('login-screen');
        const valentineScreen = document.getElementById('valentine-screen');

        // 1. Плавно прячем экран входа
        loginScreen.style.opacity = 0;
        loginScreen.style.pointerEvents = 'none';

        // 2. Показываем экран валентинки (он пока прозрачный)
        valentineScreen.style.opacity = 1;
        
        // 3. ЗАПУСКАЕМ ВСЁ ШОУ.
        // Клик по кнопке "Войти" теперь является тем самым "взаимодействием",
        // которое разрешает браузеру проигрывать аудио.
        startValentine();

    } else {
        errorMessage.textContent = 'Неверный ключ, попробуй еще раз!';
        passwordInput.value = '';
    }
}

function startValentine() {
    const audio = document.getElementById('player');
    const card = document.querySelector('.card');
    const lyricsContainer = document.getElementById('lyrics-container');
    const lyricsDisplay = document.getElementById('lyrics');
    const ghostText = document.getElementById('ghost-text');
    const letterContainer = document.getElementById('letter-container');
    const canvas = document.getElementById('visualizer');
    const ctx = canvas.getContext('2d');
    let audioContext, analyser, source, dataArray;
    let isVisualizerInitialized = false;

    card.classList.add('lyrics-mode');
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

    // Музыка запускается сразу и без проблем
    audio.play();
    audio.volume = 0; 
    
    // ... (весь остальной код startValentine остается без изменений: fadeInInterval, timeupdate, displayLetter, initVisualizer, drawVisualizer) ...
}

// Функции displayLetter, initVisualizer, drawVisualizer и другие остаются здесь без изменений
