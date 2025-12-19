/**
 * Интеграция с Hugging Face MCP сервером для генерации изображений
 * Использует gr1_flux1_schnell_infer для генерации изображений
 */

class HFImageGenerator {
    constructor() {
        this.cache = new Map();
        this.manifest = null;
        this.loadCache();
        this.loadManifest();
    }

    /**
     * Загружает кэш из LocalStorage
     */
    loadCache() {
        try {
            const cached = localStorage.getItem('hf_image_cache');
            if (cached) {
                const cacheData = JSON.parse(cached);
                this.cache = new Map(cacheData);
            }
        } catch (e) {
            console.warn('Не удалось загрузить кэш изображений:', e);
        }
    }

    /**
     * Сохраняет кэш в LocalStorage
     */
    saveCache() {
        try {
            const cacheArray = Array.from(this.cache.entries());
            localStorage.setItem('hf_image_cache', JSON.stringify(cacheArray));
        } catch (e) {
            console.warn('Не удалось сохранить кэш изображений:', e);
        }
    }

    /**
     * Загружает манифест изображений
     */
    async loadManifest() {
        try {
            const response = await fetch('assets/images/manifest.json');
            if (response.ok) {
                this.manifest = await response.json();
                console.log('Манифест изображений загружен');
            }
        } catch (e) {
            console.warn('Не удалось загрузить манифест изображений:', e);
        }
    }

    /**
     * Получает путь к локальному изображению из манифеста
     * Для персонажей всегда возвращает базовую версию (первую доступную)
     */
    getLocalImagePath(type, name, emotion = null) {
        if (!this.manifest) return null;
        
        if (type === 'background') {
            return this.manifest.backgrounds?.[name] || null;
        } else if (type === 'character') {
            const character = this.manifest.characters?.[name];
            if (character) {
                // Сначала пробуем базовую версию
                if (character['base']) {
                    return character['base'];
                }
                // Если базовой нет, берем первую доступную версию (для единообразия)
                const emotions = Object.keys(character);
                if (emotions.length > 0) {
                    // Используем первую доступную версию персонажа
                    return character[emotions[0]];
                }
            }
            return null;
        }
        
        return null;
    }

    /**
     * Генерирует ключ для кэширования на основе промпта
     */
    getCacheKey(prompt, width, height) {
        return `${prompt}_${width}_${height}`;
    }

    /**
     * Генерирует изображение через HF MCP сервер
     * @param {string} prompt - Описание изображения
     * @param {number} width - Ширина (по умолчанию 1024)
     * @param {number} height - Высота (по умолчанию 1024)
     * @param {number} seed - Опциональный seed для воспроизводимости
     * @returns {Promise<string>} - URL или base64 изображения
     */
    async generateImage(prompt, width = 1024, height = 1024, seed = null) {
        const cacheKey = this.getCacheKey(prompt, width, height);
        
        // Проверяем кэш
        if (this.cache.has(cacheKey)) {
            console.log('Изображение найдено в кэше:', cacheKey);
            return this.cache.get(cacheKey);
        }

        try {
            console.log('Генерация изображения через HF MCP:', prompt);
            
            // Пытаемся использовать реальный MCP сервер если доступен
            let imageUrl = null;
            
            // Используем MCP Bridge для вызова сервера
            if (window.mcpBridge) {
                try {
                    imageUrl = await window.mcpBridge.generateImage({
                        prompt: prompt,
                        width: width,
                        height: height,
                        seed: seed,
                        randomize_seed: seed === null
                    });
                } catch (mcpError) {
                    console.warn('Ошибка вызова MCP сервера, используем placeholder:', mcpError);
                }
            }
            
            // Если MCP сервер недоступен, используем placeholder
            if (!imageUrl) {
                imageUrl = this.createPlaceholderImage(prompt, width, height);
            }
            
            // Сохраняем в кэш
            this.cache.set(cacheKey, imageUrl);
            this.saveCache();
            
            return imageUrl;
        } catch (error) {
            console.error('Ошибка генерации изображения:', error);
            // Возвращаем placeholder в случае ошибки
            return this.createPlaceholderImage(prompt, width, height);
        }
    }

    /**
     * Создает placeholder изображение для MVP
     */
    createPlaceholderImage(prompt, width, height) {
        // Создаем canvas с текстом для демонстрации
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Фон в стиле казино
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#0d4d2d');
        gradient.addColorStop(1, '#1a1a1a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Текст промпта
        ctx.fillStyle = '#d4af37';
        ctx.font = 'bold 24px Roboto';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const words = prompt.split(' ');
        const lines = [];
        let currentLine = '';
        
        words.forEach(word => {
            const testLine = currentLine + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > width - 100 && currentLine !== '') {
                lines.push(currentLine);
                currentLine = word + ' ';
            } else {
                currentLine = testLine;
            }
        });
        if (currentLine !== '') lines.push(currentLine);
        
        lines.forEach((line, index) => {
            ctx.fillText(line, width / 2, height / 2 - (lines.length - 1) * 30 + index * 60);
        });
        
        return canvas.toDataURL('image/png');
    }

    /**
     * Генерирует изображение персонажа
     * Персонажи всегда без фона (прозрачный PNG)
     * Всегда использует одну базовую версию персонажа (не меняется между сценами)
     */
    async generateCharacterImage(characterName, emotion, position = 'center') {
        // Для единообразия используем базовую версию персонажа
        // emotion игнорируется, чтобы персонаж не менялся между сценами
        // getLocalImagePath уже возвращает базовую/первую доступную версию
        
        // Сначала проверяем локальный файл (getLocalImagePath возвращает базовую версию)
        const localPath = this.getLocalImagePath('character', characterName);
        
        if (localPath) {
            console.log(`Используется локальное изображение персонажа: ${localPath}`);
            return localPath;
        }
        
        // Если локального файла нет, пробуем путь без эмоции
        const fallbackPath = `assets/images/characters/${characterName}.png`;
        
        // Если локального файла нет, генерируем с прозрачным фоном
        // Важно: персонажи должны быть без фона (PNG с альфа-каналом)
        const prompt = `A ${characterName} character portrait in casino noir style, elegant, detailed, cinematic lighting, green and gold color scheme, ${position} position, transparent background, no background, PNG with alpha channel, isolated character, full body or portrait, professional character art`;
        return await this.generateImage(prompt, 1024, 1024);
    }
    
    /**
     * Проверяет существование изображения
     */
    checkImageExists(path) {
        // Простая проверка - в реальности можно использовать fetch HEAD запрос
        // Пока возвращаем true, предполагая что файл существует
        return true;
    }

    /**
     * Генерирует фоновое изображение
     */
    async generateBackgroundImage(sceneName, description = '') {
        // Сначала проверяем локальный файл
        const localPath = this.getLocalImagePath('background', sceneName);
        if (localPath) {
            console.log(`Используется локальное изображение: ${localPath}`);
            return localPath;
        }
        
        // Если локального файла нет, генерируем
        const prompt = `A luxurious casino ${sceneName} scene, noir style, cinematic, detailed, green and gold color scheme, atmospheric lighting${description ? ', ' + description : ''}`;
        return await this.generateImage(prompt, 1920, 1080);
    }

    /**
     * Генерирует специальный арт для ключевой сцены
     */
    async generateSceneArt(description) {
        const prompt = `Cinematic scene: ${description}, casino noir style, dramatic lighting, green and gold color scheme, detailed, elegant`;
        return await this.generateImage(prompt, 1920, 1080);
    }

    /**
     * Предзагружает изображения для главы
     */
    async preloadChapterImages(chapterData) {
        const images = [];
        
        for (const scene of chapterData.scenes) {
            // Фон
            if (scene.background) {
                images.push(this.generateBackgroundImage(scene.background));
            }
            
            // Персонажи
            if (scene.characters) {
                for (const char of scene.characters) {
                    if (char.name && char.emotion) {
                        images.push(this.generateCharacterImage(char.name, char.emotion, char.position));
                    }
                }
            }
        }
        
        return Promise.all(images);
    }
}

// Экспорт для использования в других модулях
window.HFImageGenerator = HFImageGenerator;

