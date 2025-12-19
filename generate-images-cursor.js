/**
 * Скрипт для генерации изображений через MCP в Cursor IDE
 * 
 * Этот скрипт использует MCP функции, доступные в Cursor IDE
 * Запустите этот скрипт через Cursor IDE с доступом к MCP серверу
 * 
 * Использование: Запустите через Cursor IDE или через команду:
 * node generate-images-cursor.js
 */

const fs = require('fs');
const path = require('path');

// Конфигурация изображений
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
 * Сохраняет base64 изображение в файл
 */
function saveBase64Image(base64Data, filePath) {
    try {
        const base64String = base64Data.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64String, 'base64');
        
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
 * Основная функция генерации
 * ВНИМАНИЕ: Эта функция должна быть вызвана из Cursor IDE с доступом к MCP функциям
 */
async function generateAllImages() {
    console.log('🚀 Начинаем генерацию изображений через MCP сервер...\n');
    console.log('⚠️  ВАЖНО: Этот скрипт должен быть запущен через Cursor IDE с доступом к MCP функциям\n');
    
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
        console.log(`   Промпт: ${bg.prompt.substring(0, 80)}...`);
        
        try {
            // В Cursor IDE здесь будет вызов MCP функции
            // Для демонстрации показываем инструкции
            
            console.log(`   ⚠️  Вызовите MCP функцию: gr1_flux1_schnell_infer`);
            console.log(`   Параметры: prompt="${bg.prompt}", width=${bg.width}, height=${bg.height}`);
            console.log(`   Сохраните результат в: ${filePath}\n`);
            
            // ЗАМЕНИТЕ ЭТОТ БЛОК на реальный вызов MCP функции в Cursor IDE:
            /*
            const result = await mcp_hf-mcp-server_gr1_flux1_schnell_infer({
                prompt: bg.prompt,
                width: bg.width,
                height: bg.height,
                randomize_seed: true
            });
            
            // Сохраняем изображение
            if (result && await saveBase64Image(result.imageUrl || result.image, filePath)) {
                console.log(`✅ Фон ${bg.name} сохранен\n`);
                manifest.backgrounds[bg.name] = `assets/images/backgrounds/${bg.name}.png`;
                successCount++;
            } else {
                console.log(`❌ Не удалось сохранить фон ${bg.name}\n`);
                errorCount++;
            }
            */
            
            // Для автоматизации через Cursor IDE используйте этот код:
            // (раскомментируйте и адаптируйте под ваш способ вызова MCP)
            
        } catch (error) {
            console.error(`❌ Ошибка при генерации фона ${bg.name}:`, error.message);
            errorCount++;
        }
        
        // Задержка между запросами
        await new Promise(resolve => setTimeout(resolve, 1000));
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
            console.log(`   Промпт: ${emotion.prompt.substring(0, 80)}...`);
            
            try {
                // Аналогично фонам - здесь должен быть вызов MCP функции
                console.log(`   ⚠️  Вызовите MCP функцию: gr1_flux1_schnell_infer`);
                console.log(`   Параметры: prompt="${emotion.prompt}", width=${emotion.width}, height=${emotion.height}`);
                console.log(`   Сохраните результат в: ${filePath}\n`);
                
                // ЗАМЕНИТЕ на реальный вызов MCP функции
                
            } catch (error) {
                console.error(`❌ Ошибка при генерации персонажа ${fileName}:`, error.message);
                errorCount++;
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
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
    console.log('\n💡 Для автоматической генерации используйте Cursor IDE с доступом к MCP функциям');
}

// Экспорт для использования в других скриптах
module.exports = { generateAllImages, IMAGES_TO_GENERATE };

// Запуск если вызван напрямую
if (require.main === module) {
    generateAllImages().catch(error => {
        console.error('💥 Критическая ошибка:', error);
        process.exit(1);
    });
}

