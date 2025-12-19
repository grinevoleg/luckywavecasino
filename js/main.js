/**
 * Main file - game entry point
 */

// Global objects
let novelEngine;
let storyData;
let saveSystem;
let monetization;
let casinoGames;
let imageGenerator;
let inventory;
let achievements;

/**
 * Initialize game
 */
async function initGame() {
    console.log('Initializing game...');
    
    try {
        // Create class instances
        imageGenerator = new HFImageGenerator();
        casinoGames = new CasinoGames();
        saveSystem = new SaveSystem();
        monetization = new Monetization();
        inventory = new Inventory();
        achievements = new Achievements();
        storyData = new StoryData();
        novelEngine = new NovelEngine();

        // Initialize novel engine
        novelEngine.init(imageGenerator, casinoGames, monetization, inventory, achievements);

        // Save to global scope for access from other modules
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

        // Update inventory UI
        inventory.updateUI();

        // Setup event handlers
        setupEventHandlers();

        // Show main menu
        showScreen('main-menu');
        
        console.log('Game initialized successfully');
    } catch (error) {
        console.error('Game initialization error:', error);
        alert('Game initialization error. Check console.');
    }
}

/**
 * Setup event handlers
 */
function setupEventHandlers() {
    // Main menu
    const btnNewGame = document.getElementById('btn-new-game');
    const btnLoadGame = document.getElementById('btn-load-game');
    const btnSettings = document.getElementById('btn-settings');
    
    if (btnNewGame) {
        btnNewGame.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('=== NEW GAME BUTTON CLICKED ===');
            console.log('novelEngine available:', typeof novelEngine !== 'undefined');
            console.log('storyData available:', typeof storyData !== 'undefined');
            console.log('startNewGame available:', typeof startNewGame !== 'undefined');
            
            if (typeof startNewGame === 'function') {
                startNewGame().catch(err => {
                    console.error('=== ERROR IN startNewGame ===');
                    console.error('Error:', err);
                    console.error('Message:', err.message);
                    console.error('Stack:', err.stack);
                    if (window.notifications) {
                        window.notifications.error('Error starting game: ' + err.message, 'Error');
                    } else {
                        console.error('Notifications unavailable, using alert');
                        alert('Error: ' + err.message);
                    }
                });
            } else {
                console.error('startNewGame is not a function!');
                if (window.notifications) {
                    window.notifications.error('Game start function not found', 'Error');
                }
            }
            return false;
        });
        console.log('New game handler attached, element:', btnNewGame);
    } else {
        console.error('New game button not found!');
    }
    
    if (btnLoadGame) {
        btnLoadGame.addEventListener('click', showLoadScreen);
    }
    
    if (btnSettings) {
        btnSettings.addEventListener('click', showSettings);
    }

    // In-game menu
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
    
    console.log('All event handlers attached');
}

/**
 * Show screen
 */
function showScreen(screenId) {
    console.log('Switching to screen:', screenId);
    
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show target screen
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
        console.log('Screen activated:', screenId);
    } else {
        console.error('Screen not found:', screenId);
    }
}

/**
 * Start new game
 */
async function startNewGame() {
    console.log('=== STARTING NEW GAME ===');
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
 * Show load screen
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
 * Show save screen
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
 * Save game
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
 * Load game
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
 * Toggle in-game menu
 */
function toggleGameMenu() {
    const menu = document.getElementById('game-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

/**
 * Show achievements screen
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
 * Return to main menu
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
 * Exit minigame
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
 * Show settings
 */
function showSettings() {
    if (window.notifications) {
        window.notifications.info('Settings will be added in the next version', 'Settings');
    }
}

/**
 * Initialize on page load
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, initializing game');
        initGame();
    });
} else {
    // DOM already loaded
    console.log('DOM already loaded, initializing game');
    initGame();
}

// For testing: give test resources
if (window.location.search.includes('test=true')) {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            if (monetization) {
                monetization.giveTestResources();
            }
        }, 1000);
    });
}

// Export function for console testing
window.testStartNewGame = function() {
    console.log('Test run via console');
    if (typeof startNewGame === 'function') {
        startNewGame();
    } else {
        console.error('startNewGame not found!');
    }
};

// Auto-start for testing (uncomment for debugging)
if (window.location.search.includes('autostart=true')) {
    setTimeout(() => {
        console.log('Auto-starting game for testing...');
        if (typeof startNewGame === 'function') {
            startNewGame();
        } else {
            console.error('startNewGame not found on auto-start!');
        }
    }, 2000);
}

