/**
 * Главный файл - точка входа в игру
 */

// Глобальные объекты
let novelEngine;
let storyData;
let saveSystem;
let monetization;
let casinoGames;
let imageGenerator;
let inventory;
let achievements;

/**
 * Инициализация игры
 */
async function initGame() {
    console.log('Инициализация игры...');
    
    try {
        // Создаем экземпляры классов
        imageGenerator = new HFImageGenerator();
        casinoGames = new CasinoGames();
        saveSystem = new SaveSystem();
        monetization = new Monetization();
        inventory = new Inventory();
        achievements = new Achievements();
        storyData = new StoryData();
        novelEngine = new NovelEngine();

        // Инициализируем движок новеллы
        novelEngine.init(imageGenerator, casinoGames, monetization, inventory, achievements);

        // Сохраняем в глобальную область для доступа из других модулей
        window.storyData = storyData;
        window.novelEngine = novelEngine;
        window.saveSystem = saveSystem;
        window.monetization = monetization;
        window.inventory = inventory;
        window.achievements = achievements;
        window.game = {
            inventory: inventory,
            achievements: achievements
        };

        // Обновляем UI инвентаря
        inventory.updateUI();

        // Настраиваем обработчики событий
        setupEventHandlers();

        // Показываем главное меню
        showScreen('main-menu');
        
        console.log('Игра инициализирована успешно');
    } catch (error) {
        console.error('Ошибка инициализации игры:', error);
        alert('Ошибка инициализации игры. Проверьте консоль.');
    }
}

/**
 * Настройка обработчиков событий
 */
function setupEventHandlers() {
    // Главное меню
    const btnNewGame = document.getElementById('btn-new-game');
    const btnLoadGame = document.getElementById('btn-load-game');
    const btnSettings = document.getElementById('btn-settings');
    
    if (btnNewGame) {
        btnNewGame.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('=== КЛИК ПО КНОПКЕ НОВОЙ ИГРЫ ===');
            console.log('novelEngine доступен:', typeof novelEngine !== 'undefined');
            console.log('storyData доступен:', typeof storyData !== 'undefined');
            console.log('startNewGame доступна:', typeof startNewGame !== 'undefined');
            
            if (typeof startNewGame === 'function') {
                startNewGame().catch(err => {
                    console.error('=== ОШИБКА В startNewGame ===');
                    console.error('Ошибка:', err);
                    console.error('Сообщение:', err.message);
                    console.error('Stack:', err.stack);
                    if (window.notifications) {
                        window.notifications.error('Ошибка запуска игры: ' + err.message, 'Ошибка');
                    } else {
                        console.error('Уведомления недоступны, используем alert');
                        alert('Ошибка: ' + err.message);
                    }
                });
            } else {
                console.error('startNewGame не является функцией!');
                if (window.notifications) {
                    window.notifications.error('Функция запуска игры не найдена', 'Ошибка');
                }
            }
            return false;
        });
        console.log('Обработчик новой игры привязан, элемент:', btnNewGame);
    } else {
        console.error('Кнопка новой игры не найдена!');
    }
    
    if (btnLoadGame) {
        btnLoadGame.addEventListener('click', showLoadScreen);
    }
    
    if (btnSettings) {
        btnSettings.addEventListener('click', showSettings);
    }

    // Меню в игре
    const btnMenuToggle = document.getElementById('btn-menu-toggle');
    const btnSave = document.getElementById('btn-save');
    const btnLoad = document.getElementById('btn-load');
    const btnMenuBack = document.getElementById('btn-menu-back');
    const btnQuit = document.getElementById('btn-quit');
    const btnExitMinigame = document.getElementById('btn-exit-minigame');
    const btnBackFromSave = document.getElementById('btn-back-from-save');
    
    if (btnMenuToggle) btnMenuToggle.addEventListener('click', toggleGameMenu);
    if (btnSave) btnSave.addEventListener('click', showSaveScreen);
    if (btnLoad) btnLoad.addEventListener('click', showLoadScreen);
    if (btnMenuBack) btnMenuBack.addEventListener('click', toggleGameMenu);
    if (btnQuit) btnQuit.addEventListener('click', returnToMainMenu);
    if (btnExitMinigame) btnExitMinigame.addEventListener('click', exitMinigame);
    if (btnBackFromSave) {
        btnBackFromSave.addEventListener('click', () => {
            showScreen('game-screen');
        });
    }
    
    console.log('Все обработчики событий привязаны');
}

/**
 * Показывает экран
 */
function showScreen(screenId) {
    console.log('Переключение экрана на:', screenId);
    
    // Скрываем все экраны
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Показываем нужный экран
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
        console.log('Экран активирован:', screenId);
    } else {
        console.error('Экран не найден:', screenId);
    }
}

/**
 * Начинает новую игру
 */
async function startNewGame() {
    console.log('=== НАЧАЛО НОВОЙ ИГРЫ ===');
    console.log('novelEngine:', novelEngine);
    console.log('storyData:', storyData);
    
    if (!novelEngine) {
        console.error('novelEngine is not defined!');
        if (window.notifications) {
            window.notifications.error('Game engine not initialized', 'Error');
        }
        return;
    }
    
    if (!storyData) {
        console.error('storyData is not defined!');
        if (window.notifications) {
            window.notifications.error('Story data not loaded', 'Error');
        }
        return;
    }
    
    try {
        console.log('Switching to loading screen...');
        showScreen('loading-screen');
        updateLoadingText('Loading game...');
        
        // Load first chapter
        console.log('Loading chapter chapter1...');
        updateLoadingText('Loading chapter...');
        const loaded = await novelEngine.loadChapter('chapter1', storyData);
        
        console.log('Chapter load result:', loaded);
        
        if (!loaded) {
            throw new Error('Failed to load chapter');
        }
        
        updateLoadingText('Ready!');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Switch to game screen
        console.log('Switching to game screen...');
        showScreen('game-screen');
        
        // Additional check
        const gameScreen = document.getElementById('game-screen');
        if (gameScreen) {
            if (!gameScreen.classList.contains('active')) {
                console.error('Game screen not activated! Forcing activation...');
                gameScreen.classList.add('active');
            }
            console.log('Game screen active:', gameScreen.classList.contains('active'));
        } else {
            console.error('game-screen element not found!');
        }
        
        console.log('=== GAME STARTED ===');
    } catch (error) {
        console.error('=== GAME LOAD ERROR ===');
        console.error('Error:', error);
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        showScreen('main-menu');
        if (window.notifications) {
            window.notifications.error('Error loading game: ' + error.message, 'Error');
        } else {
            // Fallback if notifications not loaded
            console.error('Notification system not available, using alert');
            alert('Error loading game: ' + error.message);
        }
    }
}

function updateLoadingText(text) {
    const loadingText = document.getElementById('loading-text');
    if (loadingText) {
        loadingText.textContent = text;
    }
}

/**
 * Показывает экран загрузки
 */
function showLoadScreen() {
    const screen = document.getElementById('save-load-screen');
    const title = document.getElementById('save-load-title');
    const slots = document.getElementById('save-slots');

    if (!screen || !title || !slots) return;

    title.textContent = 'Load Game';
    slots.innerHTML = '';

    // Get all saves
    const saves = saveSystem.getAllSaves();

    // Create slots
    for (let i = 0; i < saveSystem.saveSlots; i++) {
        const save = saves.find(s => s.slot === i);
        const slotEl = document.createElement('div');
        slotEl.className = `save-slot ${save ? '' : 'empty'}`;

        if (save) {
            slotEl.innerHTML = `
                <div class="save-slot-date">${save.date}</div>
                <div class="save-slot-preview">${save.preview}</div>
            `;
            slotEl.addEventListener('click', () => loadGame(i));
        } else {
            slotEl.innerHTML = '<div class="save-slot-preview">Empty Slot</div>';
        }

        slots.appendChild(slotEl);
    }

    showScreen('save-load-screen');
}

/**
 * Показывает экран сохранения
 */
function showSaveScreen() {
    const screen = document.getElementById('save-load-screen');
    const title = document.getElementById('save-load-title');
    const slots = document.getElementById('save-slots');

    if (!screen || !title || !slots) return;

    title.textContent = 'Save Game';
    slots.innerHTML = '';

    // Get all saves
    const saves = saveSystem.getAllSaves();

    // Create slots
    for (let i = 0; i < saveSystem.saveSlots; i++) {
        const save = saves.find(s => s.slot === i);
        const slotEl = document.createElement('div');
        slotEl.className = `save-slot ${save ? '' : 'empty'}`;

        if (save) {
            slotEl.innerHTML = `
                <div class="save-slot-date">${save.date}</div>
                <div class="save-slot-preview">${save.preview}</div>
            `;
        } else {
            slotEl.innerHTML = '<div class="save-slot-preview">Empty Slot</div>';
        }

        slotEl.addEventListener('click', () => saveGame(i));
        slots.appendChild(slotEl);
    }

    showScreen('save-load-screen');
}

/**
 * Сохраняет игру
 */
function saveGame(slotIndex) {
    const gameState = novelEngine.getGameState();
    if (saveSystem.saveGame(slotIndex, gameState)) {
        if (window.notifications) {
            window.notifications.success('Game saved successfully!', 'Save');
        }
        toggleGameMenu();
        showScreen('game-screen');
    } else {
        if (window.notifications) {
            window.notifications.error('Failed to save game', 'Error');
        }
    }
}

/**
 * Загружает игру
 */
async function loadGame(slotIndex) {
    const gameState = saveSystem.loadGame(slotIndex);
    if (gameState) {
        showScreen('loading-screen');
        updateLoadingText('Loading save...');
        
        try {
            await novelEngine.loadGameState(gameState, storyData);
            updateLoadingText('Ready!');
            await new Promise(resolve => setTimeout(resolve, 500));
            showScreen('game-screen');
        } catch (error) {
            console.error('Error loading game:', error);
            showScreen('main-menu');
            if (window.notifications) {
                window.notifications.error('Error loading game', 'Error');
            }
        }
    } else {
        if (window.notifications) {
            window.notifications.warning('Save not found', 'Warning');
        }
    }
}

/**
 * Переключает меню в игре
 */
function toggleGameMenu() {
    const menu = document.getElementById('game-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

/**
 * Показывает экран достижений
 */
function showAchievementsScreen() {
    const screen = document.getElementById('achievements-screen');
    const list = document.getElementById('achievements-list');
    
    if (!screen || !list || !achievements) return;
    
    list.innerHTML = '';
    
    Object.keys(achievements.achievements).forEach(id => {
        const achievement = achievements.achievements[id];
        const progress = achievements.getProgress(id);
        
        const item = document.createElement('div');
        item.className = `achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`;
        
        item.innerHTML = `
            <span class="achievement-icon">${achievement.unlocked ? '🏆' : '🔒'}</span>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-description">${achievement.description}</div>
            ${!achievement.unlocked ? `
                <div class="achievement-progress">
                    <div class="achievement-progress-bar" style="width: ${progress * 100}%"></div>
                </div>
                <div class="achievement-progress-text">${Math.round(progress * 100)}%</div>
            ` : ''}
        `;
        
        list.appendChild(item);
    });
    
    showScreen('achievements-screen');
}

/**
 * Возвращается в главное меню
 */
async function returnToMainMenu() {
    const confirmed = await window.confirmDialog.show(
        'Are you sure you want to quit? Progress will be saved automatically.',
        'Quit Game'
    );
    
    if (confirmed) {
        // Auto-save
        saveSystem.quickSave(novelEngine.getGameState());
        
        showScreen('main-menu');
        toggleGameMenu();
        
        if (window.notifications) {
            window.notifications.info('Game automatically saved', 'Auto-save');
        }
    }
}

/**
 * Выход из мини-игры
 */
async function exitMinigame() {
    const confirmed = await window.confirmDialog.show(
        'Are you sure you want to exit the minigame? Progress may be lost.',
        'Exit Minigame'
    );
    
    if (confirmed) {
        showScreen('game-screen');
    }
}

/**
 * Показывает настройки
 */
function showSettings() {
    if (window.notifications) {
        window.notifications.info('Settings will be added in the next version', 'Settings');
    }
}

/**
 * Инициализация при загрузке страницы
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM загружен, инициализация игры');
        initGame();
    });
} else {
    // DOM уже загружен
    console.log('DOM уже загружен, инициализация игры');
    initGame();
}

// Для тестирования: даем тестовые ресурсы
if (window.location.search.includes('test=true')) {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            if (monetization) {
                monetization.giveTestResources();
            }
        }, 1000);
    });
}

// Экспортируем функцию для тестирования через консоль
window.testStartNewGame = function() {
    console.log('Тестовый запуск через консоль');
    if (typeof startNewGame === 'function') {
        startNewGame();
    } else {
        console.error('startNewGame не найдена!');
    }
};

// Автоматический запуск для тестирования (раскомментируйте для отладки)
if (window.location.search.includes('autostart=true')) {
    setTimeout(() => {
        console.log('Автоматический запуск игры для тестирования...');
        if (typeof startNewGame === 'function') {
            startNewGame();
        } else {
            console.error('startNewGame не найдена при автозапуске!');
        }
    }, 2000);
}

