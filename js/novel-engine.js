/**
 * Visual novel engine
 */

class NovelEngine {
    constructor() {
        this.currentChapter = null;
        this.currentScene = null;
        this.currentDialogueIndex = 0;
        this.gameState = {
            currentChapter: null,
            currentScene: null,
            visitedScenes: [],
            choices: []
        };
        
        this.imageGenerator = null;
        this.casinoGames = null;
        this.monetization = null;
        
        this.isTyping = false;
        this.typingSpeed = 30; // ms per character
    }

    /**
     * Initialize engine
     */
    init(imageGenerator, casinoGames, monetization, inventory, achievements) {
        this.imageGenerator = imageGenerator;
        this.casinoGames = casinoGames;
        this.monetization = monetization;
        this.inventory = inventory;
        this.achievements = achievements;
    }

    /**
     * Load chapter
     */
    async loadChapter(chapterId, storyData) {
        const chapter = storyData.getChapter(chapterId);
        if (!chapter) {
            console.error('Chapter not found:', chapterId);
            return false;
        }

        this.currentChapter = chapter;
        this.gameState.currentChapter = chapterId;

        // Preload images
        if (this.imageGenerator) {
            await this.imageGenerator.preloadChapterImages(chapter);
        }

        // Load first scene
        if (chapter.scenes.length > 0) {
            await this.loadScene(chapter.scenes[0].sceneId, storyData);
        }

        return true;
    }

    /**
     * Load scene
     */
    async loadScene(sceneId, storyData) {
        const scene = storyData.getScene(this.currentChapter.chapterId, sceneId);
        if (!scene) {
            console.error('Scene not found:', sceneId);
            return false;
        }

        this.currentScene = scene;
        this.currentDialogueIndex = 0;
        this.gameState.currentScene = sceneId;
        
        if (!this.gameState.visitedScenes.includes(sceneId)) {
            this.gameState.visitedScenes.push(sceneId);
        }

        console.log('Loading scene:', sceneId);
        console.log('Background:', scene.background);
        console.log('Characters:', scene.characters);
        console.log('Dialogues:', scene.dialogues?.length || 0);

        // Load background
        await this.loadBackground(scene.background);

        // Load characters
        await this.loadCharacters(scene.characters);

        // Small delay for image loading
        await new Promise(resolve => setTimeout(resolve, 100));

        // Show dialogues
        console.log('Showing dialogues...');
        this.showDialogue();

        return true;
    }

    /**
     * Load background image
     */
    async loadBackground(backgroundName) {
        if (!backgroundName) {
            console.warn('Background name not specified');
            return;
        }

        const backgroundEl = document.getElementById('scene-background');
        if (!backgroundEl) {
            console.error('Background element not found!');
            return;
        }

        try {
            // Generate or load background image
            let bgUrl;
            if (this.imageGenerator) {
                bgUrl = await this.imageGenerator.generateBackgroundImage(backgroundName);
            } else {
                // Placeholder if generator not available
                bgUrl = `assets/images/backgrounds/${backgroundName}.jpg`;
            }

            if (bgUrl) {
                backgroundEl.style.backgroundImage = `url(${bgUrl})`;
                backgroundEl.classList.add('fade-in');
                console.log('Background loaded:', backgroundName, bgUrl);
            } else {
                console.error('Failed to get background URL');
            }
        } catch (e) {
            console.error('Error loading background:', e);
        }
    }

    /**
     * Load characters
     * Characters remain the same between scenes (don't change)
     */
    async loadCharacters(characters) {
        const container = document.getElementById('characters-container');
        if (!container) {
            console.error('Characters container not found!');
            return;
        }

        if (!characters || characters.length === 0) {
            console.log('No characters to display');
            // Clear only if we need to hide all characters
            container.innerHTML = '';
            return;
        }

        console.log('Loading characters:', characters.length);

        // Check which characters are already displayed
        const existingCharacters = new Set();
        container.querySelectorAll('.character').forEach(el => {
            const charId = el.id.replace('character-', '');
            existingCharacters.add(charId);
        });

        // Remove characters that are no longer in the scene
        const currentCharacterNames = new Set(characters.map(c => c.name));
        existingCharacters.forEach(charId => {
            if (!currentCharacterNames.has(charId)) {
                const el = document.getElementById(`character-${charId}`);
                if (el) {
                    el.remove();
                }
            }
        });

        // Add or update characters
        for (const char of characters) {
            let charEl = document.getElementById(`character-${char.name}`);
            
            // If character already exists, only update position
            if (charEl) {
                // Update position if changed
                const newPosition = char.position || 'center';
                charEl.className = `character ${newPosition}`;
                console.log('Character already displayed, position updated:', char.name, newPosition);
                continue;
            }

            // Create new character element
            charEl = document.createElement('div');
            charEl.className = `character ${char.position || 'center'}`;
            charEl.id = `character-${char.name}`;

            try {
                // Use only character name without emotion for consistency
                let charUrl;
                if (this.imageGenerator) {
                    // Always use base version of character (without emotion)
                    charUrl = await this.imageGenerator.generateCharacterImage(
                        char.name,
                        'base', // Base version without emotions
                        char.position || 'center'
                    );
                } else {
                    // Use base version or first available
                    charUrl = `assets/images/characters/${char.name}_base.png`;
                }

                // If URL not received, try alternative paths
                if (!charUrl) {
                    console.warn('Character URL not received, trying alternative paths:', char.name);
                    const altPaths = [
                        `assets/images/characters/${char.name}.png`,
                        `assets/images/characters/${char.name}_base.png`,
                        `assets/images/characters/${char.name}_neutral.png`,
                        `assets/images/characters/${char.name}_confident.png`
                    ];
                    charUrl = altPaths[0]; // Use first as fallback
                }

                const img = document.createElement('img');
                img.src = charUrl;
                img.alt = char.name;
                img.style.objectFit = 'cover'; // Use cover for round frame
                img.style.objectPosition = 'center';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.display = 'block';
                
                // Handle loading errors
                let errorCount = 0;
                const altPaths = [
                    `assets/images/characters/${char.name}.png`,
                    `assets/images/characters/${char.name}_base.png`,
                    `assets/images/characters/${char.name}_neutral.png`,
                    `assets/images/characters/${char.name}_confident.png`
                ];
                
                img.onerror = () => {
                    errorCount++;
                    console.error(`Error loading character image (attempt ${errorCount}):`, charUrl);
                    
                    if (errorCount < altPaths.length) {
                        // Try next alternative path
                        const nextPath = altPaths[errorCount];
                        if (nextPath !== charUrl) {
                            console.log('Trying alternative path:', nextPath);
                            img.src = nextPath;
                        }
                    } else {
                        console.error('All paths failed for character:', char.name);
                        // Can add placeholder image
                    }
                };
                
                img.onload = () => {
                    console.log('Character loaded successfully:', char.name, img.src);
                };
                
                charEl.appendChild(img);
                container.appendChild(charEl);

                // Appearance animation
                setTimeout(() => {
                    charEl.classList.add('active');
                }, 100);
            } catch (e) {
                console.error('Error loading character:', e);
            }
        }
    }

    /**
     * Show dialogue
     */
    showDialogue() {
        if (!this.currentScene) {
            console.error('Current scene not set');
            return;
        }

        if (!this.currentScene.dialogues || this.currentScene.dialogues.length === 0) {
            console.warn('No dialogues in scene, showing choices');
            this.showChoicesOrMinigame();
            return;
        }

        const dialogues = this.currentScene.dialogues;
        
        if (this.currentDialogueIndex >= dialogues.length) {
            // Dialogues ended, show choices or minigame
            this.showChoicesOrMinigame();
            return;
        }

        const dialogue = dialogues[this.currentDialogueIndex];
        this.displayDialogue(dialogue);
    }

    /**
     * Display one dialogue
     */
    displayDialogue(dialogue) {
        console.log('Displaying dialogue:', dialogue);
        
        const speakerEl = document.getElementById('speaker-name');
        const textEl = document.getElementById('dialogue-text');
        const nextBtn = document.getElementById('btn-next');
        const choicesContainer = document.getElementById('choices-container');
        const dialogueBox = document.getElementById('dialogue-box');

        console.log('Dialogue elements:', {
            speakerEl: !!speakerEl,
            textEl: !!textEl,
            nextBtn: !!nextBtn,
            choicesContainer: !!choicesContainer,
            dialogueBox: !!dialogueBox
        });

        if (!speakerEl || !textEl) {
            console.error('Dialogue elements not found!');
            console.error('speakerEl:', speakerEl);
            console.error('textEl:', textEl);
            return;
        }

        // Make sure dialogue box is visible
        if (dialogueBox) {
            dialogueBox.style.display = 'flex';
        }

        // Hide choices when showing dialogue
        if (choicesContainer) {
            choicesContainer.innerHTML = '';
        }

        // Set speaker name
        if (dialogue.speaker === 'narrator') {
            speakerEl.textContent = '';
            speakerEl.className = 'speaker-name narrator';
        } else {
            speakerEl.textContent = this.getCharacterDisplayName(dialogue.speaker);
            speakerEl.className = 'speaker-name';
        }

        console.log('Speaker name set:', speakerEl.textContent || '(narrator)');

        // Typing animation
        this.typeText(textEl, dialogue.text, () => {
            console.log('Text typed, showing Next button');
            if (nextBtn) {
                nextBtn.classList.remove('hidden');
            }
        });

        // Next button handler
        const handleNext = () => {
            console.log('Next button clicked, moving to next dialogue');
            if (nextBtn) {
                nextBtn.onclick = null; // Clear previous handler
                nextBtn.classList.add('hidden');
            }
            this.currentDialogueIndex++;
            this.showDialogue();
        };

        if (nextBtn) {
            nextBtn.onclick = handleNext;
            console.log('Next button handler set');
        } else {
            console.error('Next button not found!');
        }
    }

    /**
     * Typing animation
     */
    typeText(element, text, onComplete) {
        if (this.isTyping) return;

        this.isTyping = true;
        element.textContent = '';
        element.classList.add('typing');

        let index = 0;
        const typeChar = () => {
            if (index < text.length) {
                element.textContent += text[index];
                index++;
                setTimeout(typeChar, this.typingSpeed);
            } else {
                element.classList.remove('typing');
                this.isTyping = false;
                if (onComplete) onComplete();
            }
        };

        typeChar();
    }

    /**
     * Get character display name
     */
    getCharacterDisplayName(name) {
        const names = {
            'hero': 'You',
            'bartender': 'Bartender',
            'dealer': 'Dealer'
        };
        return names[name] || name;
    }

    /**
     * Show choices or minigame
     */
    showChoicesOrMinigame() {
        // Check if there's a minigame
        if (this.currentScene.minigame) {
            this.startMinigame(this.currentScene.minigame);
            return;
        }

        // Show choices
        if (this.currentScene.choices && this.currentScene.choices.length > 0) {
            this.showChoices(this.currentScene.choices);
        } else {
            // No choices and no minigame - show continue button
            const nextBtn = document.getElementById('btn-next');
            if (nextBtn) {
                nextBtn.classList.remove('hidden');
                nextBtn.onclick = () => {
                    // Transition to next scene by default or chapter completion
                    console.log('Scene completed');
                };
            }
        }
    }

    /**
     * Show choices
     */
    showChoices(choices) {
        const container = document.getElementById('choices-container');
        if (!container) return;

        container.innerHTML = '';

        choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice.text;

            // Check requirements
            if (choice.required === 'key' && this.inventory && !this.inventory.hasItem('key')) {
                btn.classList.add('locked');
                btn.onclick = () => {
                    if (window.notifications) {
                        window.notifications.warning('This choice requires a key!', 'Insufficient resources');
                    }
                };
            } else if (choice.required === 'ticket' && this.inventory && !this.inventory.hasItem('ticket')) {
                btn.classList.add('locked');
                btn.onclick = () => {
                    if (window.notifications) {
                        window.notifications.warning('This choice requires a ticket!', 'Insufficient resources');
                    }
                };
            } else {
                // Premium choice
                if (choice.premium) {
                    btn.classList.add('premium');
                }

                btn.onclick = () => {
                    this.handleChoice(choice, index);
                };
            }

            container.appendChild(btn);
        });
    }

    /**
     * Handle player choice
     */
    async handleChoice(choice, index) {
        // Save choice
        this.gameState.choices.push({
            scene: this.currentScene.sceneId,
            choice: index,
            text: choice.text
        });

        // Use resources if needed
        if (choice.required === 'key' && this.inventory) {
            this.inventory.useItem('key');
        } else if (choice.required === 'ticket' && this.inventory) {
            this.inventory.useItem('ticket');
        }
        
        // Update statistics
        if (this.achievements) {
            this.achievements.updateStat('choices_made');
        }

        // Transition to next scene
        if (choice.nextScene) {
            if (choice.nextScene === 'main_menu') {
                this.returnToMainMenu();
            } else {
                // Get storyData from global object
                const storyData = window.storyData;
                if (storyData) {
                    await this.loadScene(choice.nextScene, storyData);
                }
            }
        }
    }

    /**
     * Start minigame
     */
    startMinigame(gameType) {
        // Switch to minigame screen
        document.getElementById('game-screen').classList.remove('active');
        document.getElementById('minigame-screen').classList.add('active');

        // Initialize game
        if (this.casinoGames) {
            this.casinoGames.initGame(
                gameType,
                'minigame-container',
                (result) => {
                    this.onMinigameComplete(result);
                }
            );
        }
    }

    /**
     * Handle minigame completion
     */
    async onMinigameComplete(result) {
        // Update statistics and achievements
        if (this.achievements) {
            if (result === 'win' || result === 'jackpot') {
                this.achievements.updateStat('games_won');
                // Determine game type and update corresponding statistics
                if (this.currentScene.minigame === 'blackjack') {
                    this.achievements.updateStat('blackjack_wins');
                } else if (this.currentScene.minigame === 'slots') {
                    this.achievements.updateStat('slots_wins');
                    if (result === 'jackpot') {
                        this.achievements.unlock('slots_jackpot');
                    }
                } else if (this.currentScene.minigame === 'poker') {
                    this.achievements.updateStat('poker_wins');
                    if (result === 'win') {
                        this.achievements.unlock('poker_champion');
                    }
                }
            } else {
                this.achievements.updateStat('games_lost');
            }
        }

        // Return to game screen
        document.getElementById('minigame-screen').classList.remove('active');
        document.getElementById('game-screen').classList.add('active');

        // Check if there's a result handler
        if (this.currentScene.onMinigameComplete) {
            const handler = this.currentScene.onMinigameComplete[result];
            if (handler) {
                // Show dialogues after minigame
                if (handler.dialogues) {
                    this.currentScene.dialogues = handler.dialogues;
                    this.currentDialogueIndex = 0;
                    this.showDialogue();
                }

                // Transition to next scene if specified
                if (handler.sceneId) {
                    const storyData = window.storyData;
                    if (storyData) {
                        await this.loadScene(handler.sceneId, storyData);
                    }
                } else if (handler.dialogues && handler.dialogues.length > 0) {
                    // If there are dialogues but no sceneId, just show them
                    this.showDialogue();
                } else {
                    // Fallback: show choices or continue
                    this.showChoicesOrMinigame();
                }
            } else {
                // No handler for this result - show fallback
                this.showChoicesOrMinigame();
            }
        } else {
            // No onMinigameComplete handler at all - show choices or continue
            this.showChoicesOrMinigame();
        }
    }

    /**
     * Return to main menu
     */
    returnToMainMenu() {
        document.getElementById('game-screen').classList.remove('active');
        document.getElementById('main-menu').classList.add('active');
    }

    /**
     * Get current game state
     */
    getGameState() {
        return {
            ...this.gameState,
            currentDialogueIndex: this.currentDialogueIndex
        };
    }

    /**
     * Load game state
     */
    async loadGameState(gameState, storyData) {
        this.gameState = gameState;
        
        if (gameState.currentChapter) {
            await this.loadChapter(gameState.currentChapter, storyData);
            
            if (gameState.currentScene) {
                await this.loadScene(gameState.currentScene, storyData);
                this.currentDialogueIndex = gameState.currentDialogueIndex || 0;
            }
        }
    }
}

// Export
window.NovelEngine = NovelEngine;

