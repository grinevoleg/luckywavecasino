# Интеграция с Hugging Face MCP сервером

Этот документ описывает, как настроить интеграцию с Hugging Face MCP сервером для генерации изображений в игре.

## Обзор

Игра использует Hugging Face MCP сервер для генерации изображений персонажей, фонов и артов через модель Flux 1 Schnell. По умолчанию игра работает в режиме placeholder (создает изображения на canvas), но можно настроить реальную генерацию.

## Варианты интеграции

### Вариант 1: Placeholder режим (по умолчанию)

Игра автоматически создает placeholder изображения на canvas с текстом промпта. Это позволяет тестировать игру без настройки сервера.

**Преимущества:**
- Работает сразу без настройки
- Не требует сервера
- Быстрое тестирование

**Недостатки:**
- Изображения не реалистичные
- Только текст на фоне

### Вариант 2: Прямой вызов через Cursor IDE MCP

Если игра запускается в Cursor IDE с настроенным MCP сервером, можно использовать прямой вызов.

**Настройка:**

1. Убедитесь, что MCP сервер настроен в Cursor IDE
2. Добавьте в `hf-image-generator.js` прямой вызов:

```javascript
// В методе generateImage класса HFImageGenerator
if (typeof mcp_hf_mcp_server_gr1_flux1_schnell_infer === 'function') {
    try {
        const result = await mcp_hf_mcp_server_gr1_flux1_schnell_infer({
            prompt: prompt,
            width: width,
            height: height,
            seed: seed,
            randomize_seed: seed === null
        });
        
        // Обработка результата
        imageUrl = result.imageUrl || result.content?.[0]?.image;
    } catch (error) {
        console.error('Ошибка MCP вызова:', error);
    }
}
```

**Примечание:** Этот метод работает только если MCP функции доступны глобально в браузере, что обычно не так. Нужен серверный прокси.

### Вариант 3: Серверный прокси (рекомендуется)

Создайте Node.js сервер, который будет проксировать запросы к MCP серверу.

**Шаги:**

1. Установите зависимости:
```bash
npm install express cors @modelcontextprotocol/sdk
```

2. Настройте `server-example.js` для реальной интеграции:

```javascript
const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');

// Создайте клиент MCP
const transport = new StdioClientTransport({
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-huggingface']
});

const client = new Client({
    name: 'lucky-wave-chronicles',
    version: '1.0.0'
}, {
    capabilities: {}
});

await client.connect(transport);

// В обработчике /generate-image
const result = await client.callTool('gr1_flux1_schnell_infer', {
    prompt,
    width,
    height,
    seed,
    randomize_seed
});

res.json({
    imageUrl: result.content[0].image || result.imageUrl
});
```

3. Запустите сервер:
```bash
node server-example.js
```

4. В `index.html` добавьте перед закрывающим `</body>`:
```html
<script>
    window.MCP_SERVER_URL = 'http://localhost:3000';
</script>
```

### Вариант 4: Использование Hugging Face API напрямую

Можно использовать Hugging Face Inference API напрямую без MCP:

```javascript
// В hf-image-generator.js
async generateImage(prompt, width = 1024, height = 1024, seed = null) {
    const response = await fetch('https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${YOUR_HF_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            inputs: prompt,
            parameters: {
                width,
                height,
                seed
            }
        })
    });
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
}
```

**Примечание:** Требуется API токен Hugging Face и может быть платным.

## Кэширование

Все сгенерированные изображения автоматически кэшируются в LocalStorage для оптимизации. Кэш можно очистить через консоль браузера:

```javascript
localStorage.removeItem('hf_image_cache');
```

## Отладка

Включите отладку в консоли браузера:

```javascript
// Проверка состояния MCP Bridge
console.log(window.mcpBridge);

// Проверка кэша
const cache = localStorage.getItem('hf_image_cache');
console.log(JSON.parse(cache));

// Принудительная генерация без кэша
localStorage.removeItem('hf_image_cache');
```

## Рекомендации

1. **Для разработки:** Используйте placeholder режим для быстрого тестирования
2. **Для демо:** Настройте серверный прокси с MCP
3. **Для продакшена:** Используйте Hugging Face API или собственный сервер с кэшированием

## Примеры промптов

Игра автоматически генерирует промпты для изображений:

- **Персонажи:** `A {emotion} {characterName} character in casino noir style, elegant, detailed, cinematic lighting, green and gold color scheme, {position} position`
- **Фоны:** `A luxurious casino {sceneName} scene, noir style, cinematic, detailed, green and gold color scheme, atmospheric lighting`
- **Арты:** `Cinematic scene: {description}, casino noir style, dramatic lighting, green and gold color scheme, detailed, elegant`

## Ограничения

- MCP сервер работает только на стороне сервера/IDE, не в браузере напрямую
- Генерация изображений может занимать время (несколько секунд)
- Требуется интернет-соединение для реальной генерации
- Могут быть ограничения по количеству запросов в зависимости от используемого сервиса

