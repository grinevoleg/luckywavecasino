/**
 * Скрипт для генерации изображений через MCP сервер в Cursor IDE
 * 
 * Этот скрипт использует MCP функции напрямую через Cursor IDE
 * 
 * Использование: Запустите этот скрипт в Cursor IDE с настроенным MCP сервером
 */

const fs = require('fs');
const path = require('path');

// Импортируем конфигурацию
const { IMAGES_TO_GENERATE } = require('./generate-images.js');

/**
 * Генерирует изображение через MCP функцию
 * В Cursor IDE MCP функции доступны через глобальный объект или можно вызвать напрямую
 */
async function generateImageViaMCP(prompt, width, height) {
    // В Cursor IDE можно использовать MCP функции напрямую
    // Но для Node.js скрипта нужен другой подход
    
    // Вариант 1: Использовать MCP через HTTP прокси (если настроен)
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('http://localhost:3000/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt,
                width,
                height,
                randomize_seed: true
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.imageUrl || data.image;
        }
    } catch (error) {
        console.warn('HTTP прокси недоступен, пробуем другой способ...');
    }
    
    // Вариант 2: Использовать MCP SDK напрямую
    try {
        const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
        const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');
        
        const transport = new StdioClientTransport({
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-huggingface']
        });
        
        const client = new Client({
            name: 'lucky-wave-image-generator',
            version: '1.0.0'
        }, {
            capabilities: {}
        });
        
        await client.connect(transport);
        
        const result = await client.callTool('gr1_flux1_schnell_infer', {
            prompt,
            width,
            height,
            randomize_seed: true
        });
        
        await client.close();
        
        // Извлекаем изображение из результата
        if (result.content && result.content[0]) {
            return result.content[0].image || result.content[0].text;
        }
        
        return result.imageUrl || result.image;
    } catch (error) {
        console.error('Ошибка вызова MCP SDK:', error);
        return null;
    }
}

/**
 * Сохраняет base64 изображение в файл
 */
function saveBase64Image(base64Data, filePath) {
    try {
        // Убираем префикс data:image/...;base64,
        const base64String = base64Data.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64String, 'base64');
        
        // Создаем директорию если нужно
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(filePath, buffer);
        return true;
    } catch (error) {
        console.error(`Ошибка сохранения: ${filePath}`, error);
        return false;
    }
}

/**
 * Скачивает изображение по URL
 */
async function downloadImage(url, filePath) {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(url);
        const buffer = await response.buffer();
        
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(filePath, buffer);
        return true;
    } catch (error) {
        console.error(`Ошибка скачивания: ${url}`, error);
        return false;
    }
}

/**
 * Сохраняет изображение (поддерживает base64 и URL)
 */
async function saveImage(imageData, filePath) {
    if (!imageData) return false;
    
    // Base64
    if (typeof imageData === 'string' && (imageData.startsWith('data:') || imageData.length > 1000)) {
        return saveBase64Image(imageData, filePath);
    }
    
    // URL
    if (typeof imageData === 'string' && imageData.startsWith('http')) {
        return await downloadImage(imageData, filePath);
    }
    
    // Buffer
    if (Buffer.isBuffer(imageData)) {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, imageData);
        return true;
    }
    
    return false;
}

/**
 * Основная функция генерации
 */
async function main() {
    console.log('🚀 Начинаем генерацию изображений через MCP сервер...\n');
    
    const backgroundsDir = path.join(__dirname, 'assets', 'images', 'backgrounds');
    const charactersDir = path.join(__dirname, 'assets', 'images', 'characters');
    
    const manifest = {
        backgrounds: {},
        characters: {},
        generatedAt: new Date().toISOString()
    };
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    // Генерируем фоны
    console.log('📸 Генерация фонов...\n');
    for (const bg of IMAGES_TO_GENERATE.backgrounds) {
        const filePath = path.join(backgroundsDir, `${bg.name}.png`);
        
        if (fs.existsSync(filePath)) {
            console.log(`⏭  Фон ${bg.name} уже существует`);
            manifest.backgrounds[bg.name] = `assets/images/backgrounds/${bg.name}.png`;
            skipCount++;
            continue;
        }
        
        console.log(`🔄 Генерация фона: ${bg.name}...`);
        try {
            const imageData = await generateImageViaMCP(bg.prompt, bg.width, bg.height);
            
            if (imageData && await saveImage(imageData, filePath)) {
                console.log(`✅ Фон ${bg.name} сохранен\n`);
                manifest.backgrounds[bg.name] = `assets/images/backgrounds/${bg.name}.png`;
                successCount++;
            } else {
                console.log(`❌ Не удалось сгенерировать фон ${bg.name}\n`);
                errorCount++;
            }
        } catch (error) {
            console.error(`❌ Ошибка при генерации фона ${bg.name}:`, error.message);
            errorCount++;
        }
        
        // Задержка между запросами
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Генерируем персонажей
    console.log('\n👤 Генерация персонажей...\n');
    for (const char of IMAGES_TO_GENERATE.characters) {
        if (!manifest.characters[char.name]) {
            manifest.characters[char.name] = {};
        }
        
        for (const emotion of char.emotions) {
            const fileName = `${char.name}_${emotion.emotion}.png`;
            const filePath = path.join(charactersDir, fileName);
            
            if (fs.existsSync(filePath)) {
                console.log(`⏭  Персонаж ${fileName} уже существует`);
                manifest.characters[char.name][emotion.emotion] = `assets/images/characters/${fileName}`;
                skipCount++;
                continue;
            }
            
            console.log(`🔄 Генерация персонажа: ${fileName}...`);
            try {
                const imageData = await generateImageViaMCP(emotion.prompt, emotion.width, emotion.height);
                
                if (imageData && await saveImage(imageData, filePath)) {
                    console.log(`✅ Персонаж ${fileName} сохранен\n`);
                    manifest.characters[char.name][emotion.emotion] = `assets/images/characters/${fileName}`;
                    successCount++;
                } else {
                    console.log(`❌ Не удалось сгенерировать персонажа ${fileName}\n`);
                    errorCount++;
                }
            } catch (error) {
                console.error(`❌ Ошибка при генерации персонажа ${fileName}:`, error.message);
                errorCount++;
            }
            
            // Задержка между запросами
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    // Сохраняем манифест
    const manifestPath = path.join(__dirname, 'assets', 'images', 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    
    console.log('\n📊 Статистика:');
    console.log(`   ✅ Успешно: ${successCount}`);
    console.log(`   ⏭  Пропущено: ${skipCount}`);
    console.log(`   ❌ Ошибок: ${errorCount}`);
    console.log(`\n📄 Манифест сохранен: ${manifestPath}`);
    console.log('\n✨ Генерация завершена!');
}

// Запуск
if (require.main === module) {
    main().catch(error => {
        console.error('💥 Критическая ошибка:', error);
        process.exit(1);
    });
}

module.exports = { main };

