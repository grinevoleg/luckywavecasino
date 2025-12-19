# Быстрый старт: Генерация изображений

## Шаг 1: Генерация изображений через MCP

Используйте MCP функцию `gr1_flux1_schnell_infer` для генерации каждого изображения. 

**Пример для фона casino_lobby:**

```
Используй MCP функцию gr1_flux1_schnell_infer:
- prompt: "A luxurious casino lobby entrance scene, noir style, cinematic, detailed, green and gold color scheme, atmospheric lighting, night time, neon lights reflecting on wet asphalt"
- width: 1920
- height: 1080
- Сохрани результат в assets/images/backgrounds/casino_lobby.png
```

**Полный список промптов:** См. файл `generate-with-mcp.md`

## Шаг 2: Обновление манифеста

После генерации всех изображений обновите `assets/images/manifest.json`:

```json
{
  "backgrounds": {
    "casino_lobby": "assets/images/backgrounds/casino_lobby.png",
    "casino_interior": "assets/images/backgrounds/casino_interior.png",
    "casino_bar": "assets/images/backgrounds/casino_bar.png",
    "casino_tables": "assets/images/backgrounds/casino_tables.png",
    "casino_vip": "assets/images/backgrounds/casino_vip.png"
  },
  "characters": {
    "hero": {
      "confident": "assets/images/characters/hero_confident.png",
      "observant": "assets/images/characters/hero_observant.png",
      "focused": "assets/images/characters/hero_focused.png",
      "satisfied": "assets/images/characters/hero_satisfied.png",
      "cautious": "assets/images/characters/hero_cautious.png",
      "triumphant": "assets/images/characters/hero_triumphant.png"
    },
    "bartender": {
      "neutral": "assets/images/characters/bartender_neutral.png",
      "confident": "assets/images/characters/bartender_confident.png",
      "impressed": "assets/images/characters/bartender_impressed.png"
    }
  },
  "generatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Шаг 3: Проверка

1. Убедитесь, что все файлы на месте:
   - 5 фонов в `assets/images/backgrounds/`
   - 9 изображений персонажей в `assets/images/characters/`
   - Манифест обновлен

2. Запустите игру - она автоматически будет использовать локальные изображения!

## Автоматизация

Если хотите автоматизировать процесс, используйте скрипты:
- `generate-images-mcp.js` - для генерации через HTTP прокси
- `generate-images-cursor.js` - для использования в Cursor IDE

Подробнее см. `GENERATE_IMAGES.md`

