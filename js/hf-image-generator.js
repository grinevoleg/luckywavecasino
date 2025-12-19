

class HFImageGenerator {
    constructor() {
        this.cache = new Map();
        this.manifest = null;
        this.loadCache();
        this.loadManifest();
    }

    
    loadCache() {
        try {
            const cached = localStorage.getItem('hf_image_cache');
            if (cached) {
                const cacheData = JSON.parse(cached);
                this.cache = new Map(cacheData);
            }
        } catch (e) {
            console.warn('Failed to load image cache:', e);
        }
    }

    
    saveCache() {
        try {
            const cacheArray = Array.from(this.cache.entries());
            localStorage.setItem('hf_image_cache', JSON.stringify(cacheArray));
        } catch (e) {
            console.warn('Failed to save image cache:', e);
        }
    }

    
    async loadManifest() {
        try {
            const response = await fetch('assets/images/manifest.json');
            if (response.ok) {
                this.manifest = await response.json();
                console.log('Image manifest loaded');
            }
        } catch (e) {
            console.warn('Failed to load image manifest:', e);
        }
    }

    
    getLocalImagePath(type, name, emotion = null) {
        if (!this.manifest) return null;
        
        if (type === 'background') {
            return this.manifest.backgrounds?.[name] || null;
        } else if (type === 'character') {
            const character = this.manifest.characters?.[name];
            if (character) {
                                if (character['base']) {
                    return character['base'];
                }
                                const emotions = Object.keys(character);
                if (emotions.length > 0) {
                                        return character[emotions[0]];
                }
            }
            return null;
        }
        
        return null;
    }

    
    getCacheKey(prompt, width, height) {
        return `${prompt}_${width}_${height}`;
    }

    
    async generateImage(prompt, width = 1024, height = 1024, seed = null) {
        const cacheKey = this.getCacheKey(prompt, width, height);
        
                if (this.cache.has(cacheKey)) {
            console.log('Image found in cache:', cacheKey);
            return this.cache.get(cacheKey);
        }

        try {
            console.log('Generating image via HF MCP:', prompt);
            
                        let imageUrl = null;
            
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
                    console.warn('MCP server call error, using placeholder:', mcpError);
                }
            }
            
                        if (!imageUrl) {
                imageUrl = this.createPlaceholderImage(prompt, width, height);
            }
            
                        this.cache.set(cacheKey, imageUrl);
            this.saveCache();
            
            return imageUrl;
        } catch (error) {
            console.error('Image generation error:', error);
                        return this.createPlaceholderImage(prompt, width, height);
        }
    }

    
    createPlaceholderImage(prompt, width, height) {
                const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
                const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#0d4d2d');
        gradient.addColorStop(1, '#1a1a1a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
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

    
    async generateCharacterImage(characterName, emotion, position = 'center') {
                                
                const localPath = this.getLocalImagePath('character', characterName);
        
        if (localPath) {
            console.log(`Using local character image: ${localPath}`);
            return localPath;
        }
        
                const fallbackPath = `assets/images/characters/${characterName}.png`;
        
                        const prompt = `A ${characterName} character portrait in casino noir style, elegant, detailed, cinematic lighting, green and gold color scheme, ${position} position, transparent background, no background, PNG with alpha channel, isolated character, full body or portrait, professional character art`;
        return await this.generateImage(prompt, 1024, 1024);
    }
    
    
    checkImageExists(path) {
                        return true;
    }

    
    async generateBackgroundImage(sceneName, description = '') {
                const localPath = this.getLocalImagePath('background', sceneName);
        if (localPath) {
            console.log(`Using local image: ${localPath}`);
            return localPath;
        }
        
                const prompt = `A luxurious casino ${sceneName} scene, noir style, cinematic, detailed, green and gold color scheme, atmospheric lighting${description ? ', ' + description : ''}`;
        return await this.generateImage(prompt, 1920, 1080);
    }

    
    async generateSceneArt(description) {
        const prompt = `Cinematic scene: ${description}, casino noir style, dramatic lighting, green and gold color scheme, detailed, elegant`;
        return await this.generateImage(prompt, 1920, 1080);
    }

    
    async preloadChapterImages(chapterData) {
        const images = [];
        
        for (const scene of chapterData.scenes) {
                        if (scene.background) {
                images.push(this.generateBackgroundImage(scene.background));
            }
            
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

window.HFImageGenerator = HFImageGenerator;

