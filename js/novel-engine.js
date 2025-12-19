/**
 * Движок визуальной новеллы
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
        this.typingSpeed = 30; // мс на символ
    }

    /**
     * Инициализирует движок
     */
    init(imageGenerator, casinoGames, monetization, inventory, achievements) {
        this.imageGenerator = imageGenerator;
        this.casinoGames = casinoGames;
        this.monetization = monetization;
        this.inventory = inventory;
        this.achievements = achievements;
    }

    /**
     * Загружает главу
     */
    async loadChapter(chapterId, storyData) {
        const chapter = storyData.getChapter(chapterId);
        if (!chapter) {
            console.error('Глава не найдена:', chapterId);
            return false;
        }

        this.currentChapter = chapter;
        this.gameState.currentChapter = chapterId;

        // Предзагрузка изображений
        if (this.imageGenerator) {
            await this.imageGenerator.preloadChapterImages(chapter);
        }

        // Загружаем первую сцену
        if (chapter.scenes.length > 0) {
            await this.loadScene(chapter.scenes[0].sceneId, storyData);
        }

        return true;
    }

    /**
     * Загружает сцену
     */
    async loadScene(sceneId, storyData) {
        const scene = storyData.getScene(this.currentChapter.chapterId, sceneId);
        if (!scene) {
            console.error('Сцена не найдена:', sceneId);
            return false;
        }

        this.currentScene = scene;
        this.currentDialogueIndex = 0;
        this.gameState.currentScene = sceneId;
        
        if (!this.gameState.visitedScenes.includes(sceneId)) {
            this.gameState.visitedScenes.push(sceneId);
        }

        console.log('Загрузка сцены:', sceneId);
        console.log('Фон:', scene.background);
        console.log('Персонажи:', scene.characters);
        console.log('Диалоги:', scene.dialogues?.length || 0);

        // Загружаем фон
        await this.loadBackground(scene.background);

        // Загружаем персонажей
        await this.loadCharacters(scene.characters);

        // Небольшая задержка для загрузки изображений
        await new Promise(resolve => setTimeout(resolve, 100));

        // Показываем диалоги
        console.log('Показ диалогов...');
        this.showDialogue();

        return true;
    }

    /**
     * Загружает фоновое изображение
     */
    async loadBackground(backgroundName) {
        if (!backgroundName) {
            console.warn('Название фона не указано');
            return;
        }

        const backgroundEl = document.getElementById('scene-background');
        if (!backgroundEl) {
            console.error('Элемент фона не найден!');
            return;
        }

        try {
            // Генерируем или загружаем изображение фона
            let bgUrl;
            if (this.imageGenerator) {
                bgUrl = await this.imageGenerator.generateBackgroundImage(backgroundName);
            } else {
                // Placeholder если генератор не доступен
                bgUrl = `assets/images/backgrounds/${backgroundName}.jpg`;
            }

            if (bgUrl) {
                backgroundEl.style.backgroundImage = `url(${bgUrl})`;
                backgroundEl.classList.add('fade-in');
                console.log('Фон загружен:', backgroundName, bgUrl);
            } else {
                console.error('Не удалось получить URL фона');
            }
        } catch (e) {
            console.error('Ошибка загрузки фона:', e);
        }
    }

    /**
     * Загружает персонажей
     * Персонажи остаются одними и теми же между сценами (не меняются)
     */
    async loadCharacters(characters) {
        const container = document.getElementById('characters-container');
        if (!container) {
            console.error('Контейнер персонажей не найден!');
            return;
        }

        if (!characters || characters.length === 0) {
            console.log('Нет персонажей для отображения');
            // Очищаем только если нужно скрыть всех персонажей
            container.innerHTML = '';
            return;
        }

        console.log('Загрузка персонажей:', characters.length);

        // Проверяем какие персонажи уже отображаются
        const existingCharacters = new Set();
        container.querySelectorAll('.character').forEach(el => {
            const charId = el.id.replace('character-', '');
            existingCharacters.add(charId);
        });

        // Удаляем персонажей, которых больше нет в сцене
        const currentCharacterNames = new Set(characters.map(c => c.name));
        existingCharacters.forEach(charId => {
            if (!currentCharacterNames.has(charId)) {
                const el = document.getElementById(`character-${charId}`);
                if (el) {
                    el.remove();
                }
            }
        });

        // Добавляем или обновляем персонажей
        for (const char of characters) {
            let charEl = document.getElementById(`character-${char.name}`);
            
            // Если персонаж уже есть, только обновляем позицию
            if (charEl) {
                // Обновляем позицию если изменилась
                const newPosition = char.position || 'center';
                charEl.className = `character ${newPosition}`;
                console.log('Персонаж уже отображается, обновлена позиция:', char.name, newPosition);
                continue;
            }

            // Создаем новый элемент персонажа
            charEl = document.createElement('div');
            charEl.className = `character ${char.position || 'center'}`;
            charEl.id = `character-${char.name}`;

            try {
                // Используем только имя персонажа без эмоции для единообразия
                let charUrl;
                if (this.imageGenerator) {
                    // Всегда используем базовую версию персонажа (без эмоции)
                    charUrl = await this.imageGenerator.generateCharacterImage(
                        char.name,
                        'base', // Базовая версия без эмоций
                        char.position || 'center'
                    );
                } else {
                    // Используем базовую версию или первую доступную
                    charUrl = `assets/images/characters/${char.name}_base.png`;
                }

                // Если URL не получен, пробуем альтернативные пути
                if (!charUrl) {
                    console.warn('URL персонажа не получен, пробуем альтернативные пути:', char.name);
                    const altPaths = [
                        `assets/images/characters/${char.name}.png`,
                        `assets/images/characters/${char.name}_base.png`,
                        `assets/images/characters/${char.name}_neutral.png`,
                        `assets/images/characters/${char.name}_confident.png`
                    ];
                    charUrl = altPaths[0]; // Используем первый как fallback
                }

                const img = document.createElement('img');
                img.src = charUrl;
                img.alt = char.name;
                img.style.objectFit = 'cover'; // Для круглой рамки используем cover
                img.style.objectPosition = 'center';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.display = 'block';
                
                // Обработка ошибок загрузки
                let errorCount = 0;
                const altPaths = [
                    `assets/images/characters/${char.name}.png`,
                    `assets/images/characters/${char.name}_base.png`,
                    `assets/images/characters/${char.name}_neutral.png`,
                    `assets/images/characters/${char.name}_confident.png`
                ];
                
                img.onerror = () => {
                    errorCount++;
                    console.error(`Ошибка загрузки изображения персонажа (попытка ${errorCount}):`, charUrl);
                    
                    if (errorCount < altPaths.length) {
                        // Пробуем следующий альтернативный путь
                        const nextPath = altPaths[errorCount];
                        if (nextPath !== charUrl) {
                            console.log('Пробуем альтернативный путь:', nextPath);
                            img.src = nextPath;
                        }
                    } else {
                        console.error('Все пути не сработали для персонажа:', char.name);
                        // Можно добавить placeholder изображение
                    }
                };
                
                img.onload = () => {
                    console.log('Персонаж успешно загружен:', char.name, img.src);
                };
                
                charEl.appendChild(img);
                container.appendChild(charEl);

                // Анимация появления
                setTimeout(() => {
                    charEl.classList.add('active');
                }, 100);
            } catch (e) {
                console.error('Ошибка загрузки персонажа:', e);
            }
        }
    }

    /**
     * Показывает диалог
     */
    showDialogue() {
        if (!this.currentScene) {
            console.error('Текущая сцена не установлена');
            return;
        }

        if (!this.currentScene.dialogues || this.currentScene.dialogues.length === 0) {
            console.warn('Нет диалогов в сцене, показываем выборы');
            this.showChoicesOrMinigame();
            return;
        }

        const dialogues = this.currentScene.dialogues;
        
        if (this.currentDialogueIndex >= dialogues.length) {
            // Диалоги закончились, показываем выборы или мини-игру
            this.showChoicesOrMinigame();
            return;
        }

        const dialogue = dialogues[this.currentDialogueIndex];
        this.displayDialogue(dialogue);
    }

    /**
     * Отображает один диалог
     */
    displayDialogue(dialogue) {
        console.log('Отображение диалога:', dialogue);
        
        const speakerEl = document.getElementById('speaker-name');
        const textEl = document.getElementById('dialogue-text');
        const nextBtn = document.getElementById('btn-next');
        const choicesContainer = document.getElementById('choices-container');
        const dialogueBox = document.getElementById('dialogue-box');

        console.log('Элементы диалога:', {
            speakerEl: !!speakerEl,
            textEl: !!textEl,
            nextBtn: !!nextBtn,
            choicesContainer: !!choicesContainer,
            dialogueBox: !!dialogueBox
        });

        if (!speakerEl || !textEl) {
            console.error('Элементы диалога не найдены!');
            console.error('speakerEl:', speakerEl);
            console.error('textEl:', textEl);
            return;
        }

        // Убеждаемся, что диалоговое окно видно
        if (dialogueBox) {
            dialogueBox.style.display = 'flex';
        }

        // Скрываем выборы при показе диалога
        if (choicesContainer) {
            choicesContainer.innerHTML = '';
        }

        // Устанавливаем имя говорящего
        if (dialogue.speaker === 'narrator') {
            speakerEl.textContent = '';
            speakerEl.className = 'speaker-name narrator';
        } else {
            speakerEl.textContent = this.getCharacterDisplayName(dialogue.speaker);
            speakerEl.className = 'speaker-name';
        }

        console.log('Имя говорящего установлено:', speakerEl.textContent || '(narrator)');

        // Анимация печатания текста
        this.typeText(textEl, dialogue.text, () => {
            console.log('Текст напечатан, показываем кнопку "Далее"');
            if (nextBtn) {
                nextBtn.classList.remove('hidden');
            }
        });

        // Обработчик кнопки "Далее"
        const handleNext = () => {
            console.log('Клик по кнопке "Далее", переход к следующему диалогу');
            if (nextBtn) {
                nextBtn.onclick = null; // Очищаем предыдущий обработчик
                nextBtn.classList.add('hidden');
            }
            this.currentDialogueIndex++;
            this.showDialogue();
        };

        if (nextBtn) {
            nextBtn.onclick = handleNext;
            console.log('Обработчик кнопки "Далее" установлен');
        } else {
            console.error('Кнопка "Далее" не найдена!');
        }
    }

    /**
     * Анимация печатания текста
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
     * Получает отображаемое имя персонажа
     */
    getCharacterDisplayName(name) {
        const names = {
            'hero': 'Вы',
            'bartender': 'Бармен',
            'dealer': 'Дилер'
        };
        return names[name] || name;
    }

    /**
     * Показывает выборы или мини-игру
     */
    showChoicesOrMinigame() {
        // Проверяем, есть ли мини-игра
        if (this.currentScene.minigame) {
            this.startMinigame(this.currentScene.minigame);
            return;
        }

        // Показываем выборы
        if (this.currentScene.choices && this.currentScene.choices.length > 0) {
            this.showChoices(this.currentScene.choices);
        } else {
            // Нет выборов и нет мини-игры - показываем кнопку продолжения
            const nextBtn = document.getElementById('btn-next');
            if (nextBtn) {
                nextBtn.classList.remove('hidden');
                nextBtn.onclick = () => {
                    // Переход к следующей сцене по умолчанию или завершение главы
                    console.log('Сцена завершена');
                };
            }
        }
    }

    /**
     * Показывает выборы
     */
    showChoices(choices) {
        const container = document.getElementById('choices-container');
        if (!container) return;

        container.innerHTML = '';

        choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice.text;

            // Проверяем требования
            if (choice.required === 'key' && this.inventory && !this.inventory.hasItem('key')) {
                btn.classList.add('locked');
                btn.onclick = () => {
                    if (window.notifications) {
                        window.notifications.warning('Для этого выбора нужен ключ!', 'Недостаточно ресурсов');
                    }
                };
            } else if (choice.required === 'ticket' && this.inventory && !this.inventory.hasItem('ticket')) {
                btn.classList.add('locked');
                btn.onclick = () => {
                    if (window.notifications) {
                        window.notifications.warning('Для этого выбора нужен билет!', 'Недостаточно ресурсов');
                    }
                };
            } else {
                // Премиум выбор
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
     * Обрабатывает выбор игрока
     */
    async handleChoice(choice, index) {
        // Сохраняем выбор
        this.gameState.choices.push({
            scene: this.currentScene.sceneId,
            choice: index,
            text: choice.text
        });

        // Используем ресурсы если нужно
        if (choice.required === 'key' && this.inventory) {
            this.inventory.useItem('key');
        } else if (choice.required === 'ticket' && this.inventory) {
            this.inventory.useItem('ticket');
        }
        
        // Обновляем статистику
        if (this.achievements) {
            this.achievements.updateStat('choices_made');
        }

        // Переходим к следующей сцене
        if (choice.nextScene) {
            if (choice.nextScene === 'main_menu') {
                this.returnToMainMenu();
            } else {
                // Получаем storyData из глобального объекта
                const storyData = window.storyData;
                if (storyData) {
                    await this.loadScene(choice.nextScene, storyData);
                }
            }
        }
    }

    /**
     * Запускает мини-игру
     */
    startMinigame(gameType) {
        // Переключаемся на экран мини-игры
        document.getElementById('game-screen').classList.remove('active');
        document.getElementById('minigame-screen').classList.add('active');

        // Инициализируем игру
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
     * Обрабатывает завершение мини-игры
     */
    async onMinigameComplete(result) {
        // Обновляем статистику и достижения
        if (this.achievements) {
            if (result === 'win' || result === 'jackpot') {
                this.achievements.updateStat('games_won');
                // Определяем тип игры и обновляем соответствующую статистику
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

        // Возвращаемся к экрану игры
        document.getElementById('minigame-screen').classList.remove('active');
        document.getElementById('game-screen').classList.add('active');

        // Проверяем, есть ли обработчик результата
        if (this.currentScene.onMinigameComplete) {
            const handler = this.currentScene.onMinigameComplete[result];
            if (handler) {
                // Показываем диалоги после мини-игры
                if (handler.dialogues) {
                    this.currentScene.dialogues = handler.dialogues;
                    this.currentDialogueIndex = 0;
                    this.showDialogue();
                }

                // Переходим к следующей сцене если указана
                if (handler.sceneId) {
                    const storyData = window.storyData;
                    if (storyData) {
                        await this.loadScene(handler.sceneId, storyData);
                    }
                }
            }
        }
    }

    /**
     * Возвращается в главное меню
     */
    returnToMainMenu() {
        document.getElementById('game-screen').classList.remove('active');
        document.getElementById('main-menu').classList.add('active');
    }

    /**
     * Получает текущее состояние игры
     */
    getGameState() {
        return {
            ...this.gameState,
            currentDialogueIndex: this.currentDialogueIndex
        };
    }

    /**
     * Загружает состояние игры
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

// Экспорт
window.NovelEngine = NovelEngine;

