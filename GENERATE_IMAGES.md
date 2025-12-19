# Инструкция по генерации изображений

Этот документ описывает, как сгенерировать все изображения заранее и использовать их локально в игре.

## Подготовка

1. Убедитесь, что у вас настроен MCP сервер Hugging Face
2. Установите зависимости (если используете HTTP прокси):
```bash
npm install node-fetch
```

## Способ 1: Через HTTP прокси (рекомендуется)

1. Запустите серверный прокси (см. `server-example.js`):
```bash
node server-example.js
```

2. В другом терминале запустите генерацию:
```bash
node generate-images-mcp.js
```

Скрипт автоматически:
- Сгенерирует все необходимые изображения
- Сохранит их в `assets/images/backgrounds/` и `assets/images/characters/`
- Создаст манифест `assets/images/manifest.json`

## Способ 2: Через MCP SDK напрямую

Если у вас настроен MCP SDK, используйте `generate-images-mcp.js`:

```bash
node generate-images-mcp.js
```

## Способ 3: Ручная генерация через Cursor IDE

Если вы хотите использовать MCP функции напрямую в Cursor IDE:

1. Откройте файл `generate-images.js`
2. Раскомментируйте код для прямого вызова MCP функций
3. Запустите скрипт

## Структура генерируемых изображений

### Фоны (1920x1080):
- `casino_lobby.png` - Вход в казино
- `casino_interior.png` - Интерьер казино
- `casino_bar.png` - Барная стойка
- `casino_tables.png` - Игровые столы
- `casino_vip.png` - VIP-зона

### Персонажи (1024x1024):

**Hero (главный герой):**
- `hero_confident.png`
- `hero_observant.png`
- `hero_focused.png`
- `hero_satisfied.png`
- `hero_cautious.png`
- `hero_triumphant.png`

**Bartender (бармен):**
- `bartender_neutral.png`
- `bartender_confident.png`
- `bartender_impressed.png`

## Манифест

После генерации создается файл `assets/images/manifest.json` со структурой:

```json
{
  "backgrounds": {
    "casino_lobby": "assets/images/backgrounds/casino_lobby.png",
    ...
  },
  "characters": {
    "hero": {
      "confident": "assets/images/characters/hero_confident.png",
      ...
    },
    ...
  },
  "generatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Использование в игре

После генерации изображений игра автоматически будет использовать локальные файлы вместо генерации на лету. Система работает так:

1. При загрузке игры загружается манифест
2. При запросе изображения сначала проверяется локальный файл
3. Если локального файла нет, используется генерация или placeholder

## Проверка результата

После генерации проверьте:

1. Папка `assets/images/backgrounds/` содержит 5 PNG файлов
2. Папка `assets/images/characters/` содержит 9 PNG файлов
3. Файл `assets/images/manifest.json` создан и содержит пути ко всем изображениям

## Добавление новых изображений

Если вы добавляете новые сцены или персонажей:

1. Добавьте их в `IMAGES_TO_GENERATE` в `generate-images.js`
2. Запустите скрипт генерации снова
3. Скрипт пропустит существующие файлы и сгенерирует только новые

## Troubleshooting

**Проблема:** Скрипт не может подключиться к MCP серверу
**Решение:** Убедитесь, что серверный прокси запущен и доступен на `http://localhost:3000`

**Проблема:** Изображения не сохраняются
**Решение:** Проверьте права доступа к папке `assets/images/`

**Проблема:** Игра не находит локальные изображения
**Решение:** Убедитесь, что манифест создан и пути корректны

