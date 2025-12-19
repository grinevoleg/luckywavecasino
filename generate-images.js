/**
 * Скрипт для генерации всех изображений через HF MCP сервер
 * 
 * Использование:
 * node generate-images.js
 * 
 * Требования:
 * - Настроенный MCP сервер Hugging Face
 * - Папки assets/images/backgrounds и assets/images/characters должны существовать
 */

const fs = require('fs');
const path = require('path');

// Конфигурация изображений на основе сюжета
const IMAGES_TO_GENERATE = {
    backgrounds: [
        {
            name: 'casino_lobby',
            prompt: 'A luxurious casino lobby entrance scene, noir style, cinematic, detailed, green and gold color scheme, atmospheric lighting, night time, neon lights reflecting on wet asphalt',
            width: 1920,
            height: 1080
        },
        {
            name: 'casino_interior',
            prompt: 'A luxurious casino interior scene, noir style, cinematic, detailed, green and gold color scheme, atmospheric lighting, golden chandeliers, gaming tables, elegant atmosphere',
            width: 1920,
            height: 1080
        },
        {
            name: 'casino_bar',
            prompt: 'A luxurious casino bar scene, noir style, cinematic, detailed, green and gold color scheme, atmospheric lighting, elegant bar counter, dim lighting',
            width: 1920,
            height: 1080
        },
        {
            name: 'casino_tables',
            prompt: 'A luxurious casino gaming tables scene, noir style, cinematic, detailed, green and gold color scheme, atmospheric lighting, slot machines, card tables, vibrant atmosphere',
            width: 1920,
            height: 1080
        },
        {
            name: 'casino_vip',
            prompt: 'A luxurious casino VIP area scene, noir style, cinematic, detailed, green and gold color scheme, atmospheric lighting, exclusive area, elegant furniture, private tables',
            width: 1920,
            height: 1080
        }
    ],
    characters: [
        {
            name: 'hero',
            emotions: [
                {
                    emotion: 'confident',
                    prompt: 'A confident hero character in casino noir style, elegant, detailed, cinematic lighting, green and gold color scheme, center position, mysterious agent or talented con artist, well-dressed, sophisticated',
                    width: 1024,
                    height: 1024
                },
                {
                    emotion: 'observant',
                    prompt: 'An observant hero character in casino noir style, elegant, detailed, cinematic lighting, green and gold color scheme, left position, mysterious agent, scanning the room, alert',
                    width: 1024,
                    height: 1024
                },
                {
                    emotion: 'focused',
                    prompt: 'A focused hero character in casino noir style, elegant, detailed, cinematic lighting, green and gold color scheme, center position, determined expression, concentrating on task',
                    width: 1024,
                    height: 1024
                },
                {
                    emotion: 'satisfied',
                    prompt: 'A satisfied hero character in casino noir style, elegant, detailed, cinematic lighting, green and gold color scheme, left position, pleased expression, mission accomplished',
                    width: 1024,
                    height: 1024
                },
                {
                    emotion: 'cautious',
                    prompt: 'A cautious hero character in casino noir style, elegant, detailed, cinematic lighting, green and gold color scheme, center position, careful, watchful, alert',
                    width: 1024,
                    height: 1024
                },
                {
                    emotion: 'triumphant',
                    prompt: 'A triumphant hero character in casino noir style, elegant, detailed, cinematic lighting, green and gold color scheme, left position, victorious expression, mission complete',
                    width: 1024,
                    height: 1024
                }
            ]
        },
        {
            name: 'bartender',
            emotions: [
                {
                    emotion: 'neutral',
                    prompt: 'A neutral bartender character in casino noir style, elegant, detailed, cinematic lighting, green and gold color scheme, right position, middle-aged man with penetrating gaze, professional',
                    width: 1024,
                    height: 1024
                },
                {
                    emotion: 'confident',
                    prompt: 'A confident bartender character in casino noir style, elegant, detailed, cinematic lighting, green and gold color scheme, right position, self-assured, knowing expression',
                    width: 1024,
                    height: 1024
                },
                {
                    emotion: 'impressed',
                    prompt: 'An impressed bartender character in casino noir style, elegant, detailed, cinematic lighting, green and gold color scheme, right position, respectful expression, acknowledging skill',
                    width: 1024,
                    height: 1024
                }
            ]
        }
    ]
};

/**
 * Генерирует изображение через MCP сервер
 */
async function generateImageViaMCP(prompt, width, height, seed = null) {
    // Здесь должен быть вызов MCP сервера
    // В реальной реализации используйте MCP SDK или API
    
    // Пример для использования через MCP функцию напрямую в Cursor IDE:
    // Это будет работать только если скрипт запускается в среде с доступом к MCP
    
    console.log(`Генерация изображения: ${prompt.substring(0, 50)}...`);
    console.log(`Размер: ${width}x${height}`);
    
    // ЗАГЛУШКА: В реальной реализации здесь будет вызов MCP
    // Для демонстрации возвращаем null, что означает использование placeholder
    
    // Если у вас есть доступ к MCP функциям через глобальный объект:
    /*
    if (typeof mcp_hf_mcp_server_gr1_flux1_schnell_infer === 'function') {
        try {
            const result = await mcp_hf_mcp_server_gr1_flux1_schnell_infer({
                prompt: prompt,
                width: width,
                height: height,
                seed: seed,
                randomize_seed: seed === null
            });
            
            // Возвращаем base64 или URL изображения
            return result.imageUrl || result.content?.[0]?.image || result.image;
        } catch (error) {
            console.error('Ошибка генерации через MCP:', error);
            return null;
        }
    }
    */
    
    // Для работы через HTTP прокси:
    /*
    const response = await fetch('http://localhost:3000/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, width, height, seed, randomize_seed: seed === null })
    });
    
    const data = await response.json();
    return data.imageUrl || data.image;
    */
    
    return null; // Placeholder режим
}

/**
 * Сохраняет изображение в файл
 */
async function saveImage(imageData, filePath) {
    try {
        // Если imageData это base64 строка
        if (typeof imageData === 'string' && imageData.startsWith('data:')) {
            const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            fs.writeFileSync(filePath, buffer);
            return true;
        }
        // Если это URL, нужно скачать
        else if (typeof imageData === 'string' && imageData.startsWith('http')) {
            const response = await fetch(imageData);
            const buffer = Buffer.from(await response.arrayBuffer());
            fs.writeFileSync(filePath, buffer);
            return true;
        }
        // Если это Buffer
        else if (Buffer.isBuffer(imageData)) {
            fs.writeFileSync(filePath, imageData);
            return true;
        }
        
        return false;
    } catch (error) {
        console.error(`Ошибка сохранения изображения ${filePath}:`, error);
        return false;
    }
}

/**
 * Генерирует все изображения
 */
async function generateAllImages() {
    const backgroundsDir = path.join(__dirname, 'assets', 'images', 'backgrounds');
    const charactersDir = path.join(__dirname, 'assets', 'images', 'characters');
    
    // Создаем папки если их нет
    [backgroundsDir, charactersDir].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Создана папка: ${dir}`);
        }
    });
    
    const manifest = {
        backgrounds: {},
        characters: {},
        generatedAt: new Date().toISOString()
    };
    
    console.log('Начинаем генерацию фонов...\n');
    
    // Генерируем фоны
    for (const bg of IMAGES_TO_GENERATE.backgrounds) {
        const filePath = path.join(backgroundsDir, `${bg.name}.png`);
        
        // Пропускаем если файл уже существует
        if (fs.existsSync(filePath)) {
            console.log(`✓ Фон ${bg.name} уже существует, пропускаем`);
            manifest.backgrounds[bg.name] = `assets/images/backgrounds/${bg.name}.png`;
            continue;
        }
        
        console.log(`Генерация фона: ${bg.name}...`);
        const imageData = await generateImageViaMCP(bg.prompt, bg.width, bg.height);
        
        if (imageData) {
            if (await saveImage(imageData, filePath)) {
                console.log(`✓ Фон ${bg.name} сохранен\n`);
                manifest.backgrounds[bg.name] = `assets/images/backgrounds/${bg.name}.png`;
            } else {
                console.log(`✗ Ошибка сохранения фона ${bg.name}\n`);
            }
        } else {
            console.log(`⚠ Фон ${bg.name} не сгенерирован (используется placeholder)\n`);
        }
        
        // Задержка между запросами
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\nНачинаем генерацию персонажей...\n');
    
    // Генерируем персонажей
    for (const char of IMAGES_TO_GENERATE.characters) {
        if (!manifest.characters[char.name]) {
            manifest.characters[char.name] = {};
        }
        
        for (const emotion of char.emotions) {
            const fileName = `${char.name}_${emotion.emotion}.png`;
            const filePath = path.join(charactersDir, fileName);
            
            // Пропускаем если файл уже существует
            if (fs.existsSync(filePath)) {
                console.log(`✓ Персонаж ${fileName} уже существует, пропускаем`);
                manifest.characters[char.name][emotion.emotion] = `assets/images/characters/${fileName}`;
                continue;
            }
            
            console.log(`Генерация персонажа: ${fileName}...`);
            const imageData = await generateImageViaMCP(emotion.prompt, emotion.width, emotion.height);
            
            if (imageData) {
                if (await saveImage(imageData, filePath)) {
                    console.log(`✓ Персонаж ${fileName} сохранен\n`);
                    manifest.characters[char.name][emotion.emotion] = `assets/images/characters/${fileName}`;
                } else {
                    console.log(`✗ Ошибка сохранения персонажа ${fileName}\n`);
                }
            } else {
                console.log(`⚠ Персонаж ${fileName} не сгенерирован (используется placeholder)\n`);
            }
            
            // Задержка между запросами
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    // Сохраняем манифест
    const manifestPath = path.join(__dirname, 'assets', 'images', 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`\n✓ Манифест сохранен: ${manifestPath}`);
    
    console.log('\n✓ Генерация завершена!');
    return manifest;
}

// Запуск
if (require.main === module) {
    generateAllImages().catch(error => {
        console.error('Критическая ошибка:', error);
        process.exit(1);
    });
}

module.exports = { generateAllImages, IMAGES_TO_GENERATE };

