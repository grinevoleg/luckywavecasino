# Генерация изображений через MCP в Cursor IDE

Этот документ описывает, как использовать MCP функции напрямую в Cursor IDE для генерации всех изображений.

## Быстрый способ

Используйте этот промпт в Cursor IDE для генерации каждого изображения:

### Фоны (1920x1080)

1. **casino_lobby.png**
```
Используй MCP функцию gr1_flux1_schnell_infer для генерации изображения:
- prompt: "A luxurious casino lobby entrance scene, noir style, cinematic, detailed, green and gold color scheme, atmospheric lighting, night time, neon lights reflecting on wet asphalt"
- width: 1920
- height: 1080
- Сохрани результат в assets/images/backgrounds/casino_lobby.png
```

2. **casino_interior.png**
```
Используй MCP функцию gr1_flux1_schnell_infer для генерации изображения:
- prompt: "A luxurious casino interior scene, noir style, cinematic, detailed, green and gold color scheme, atmospheric lighting, golden chandeliers, gaming tables, elegant atmosphere"
- width: 1920
- height: 1080
- Сохрани результат в assets/images/backgrounds/casino_interior.png
```

3. **casino_bar.png**
```
Используй MCP функцию gr1_flux1_schnell_infer для генерации изображения:
- prompt: "A luxurious casino bar scene, noir style, cinematic, detailed, green and gold color scheme, atmospheric lighting, elegant bar counter, dim lighting"
- width: 1920
- height: 1080
- Сохрани результат в assets/images/backgrounds/casino_bar.png
```

4. **casino_tables.png**
```
Используй MCP функцию gr1_flux1_schnell_infer для генерации изображения:
- prompt: "A luxurious casino gaming tables scene, noir style, cinematic, detailed, green and gold color scheme, atmospheric lighting, slot machines, card tables, vibrant atmosphere"
- width: 1920
- height: 1080
- Сохрани результат в assets/images/backgrounds/casino_tables.png
```

5. **casino_vip.png**
```
Используй MCP функцию gr1_flux1_schnell_infer для генерации изображения:
- prompt: "A luxurious casino VIP area scene, noir style, cinematic, detailed, green and gold color scheme, atmospheric lighting, exclusive area, elegant furniture, private tables"
- width: 1920
- height: 1080
- Сохрани результат в assets/images/backgrounds/casino_vip.png
```

### Персонажи Hero (1024x1024)

1. **hero_confident.png**
```
Используй MCP функцию gr1_flux1_schnell_infer для генерации изображения:
- prompt: "A confident hero character in casino noir style, elegant, detailed, cinematic lighting, green and gold color scheme, center position, mysterious agent or talented con artist, well-dressed, sophisticated"
- width: 1024
- height: 1024
- Сохрани результат в assets/images/characters/hero_confident.png
```

2. **hero_observant.png**
```
Используй MCP функцию gr1_flux1_schnell_infer для генерации изображения:
- prompt: "An observant hero character in casino noir style, elegant, detailed, cinematic lighting, green and gold color scheme, left position, mysterious agent, scanning the room, alert"
- width: 1024
- height: 1024
- Сохрани результат в assets/images/characters/hero_observant.png
```

3. **hero_focused.png**
```
Используй MCP функцию gr1_flux1_schnell_infer для генерации изображения:
- prompt: "A focused hero character in casino noir style, elegant, detailed, cinematic lighting, green and gold color scheme, center position, determined expression, concentrating on task"
- width: 1024
- height: 1024
- Сохрани результат в assets/images/characters/hero_focused.png
```

4. **hero_satisfied.png**
```
Используй MCP функцию gr1_flux1_schnell_infer для генерации изображения:
- prompt: "A satisfied hero character in casino noir style, elegant, detailed, cinematic lighting, green and gold color scheme, left position, pleased expression, mission accomplished"
- width: 1024
- height: 1024
- Сохрани результат в assets/images/characters/hero_satisfied.png
```

5. **hero_cautious.png**
```
Используй MCP функцию gr1_flux1_schnell_infer для генерации изображения:
- prompt: "A cautious hero character in casino noir style, elegant, detailed, cinematic lighting, green and gold color scheme, center position, careful, watchful, alert"
- width: 1024
- height: 1024
- Сохрани результат в assets/images/characters/hero_cautious.png
```

6. **hero_triumphant.png**
```
Используй MCP функцию gr1_flux1_schnell_infer для генерации изображения:
- prompt: "A triumphant hero character in casino noir style, elegant, detailed, cinematic lighting, green and gold color scheme, left position, victorious expression, mission complete"
- width: 1024
- height: 1024
- Сохрани результат в assets/images/characters/hero_triumphant.png
```

### Персонажи Bartender (1024x1024)

1. **bartender_neutral.png**
```
Используй MCP функцию gr1_flux1_schnell_infer для генерации изображения:
- prompt: "A neutral bartender character in casino noir style, elegant, detailed, cinematic lighting, green and gold color scheme, right position, middle-aged man with penetrating gaze, professional"
- width: 1024
- height: 1024
- Сохрани результат в assets/images/characters/bartender_neutral.png
```

2. **bartender_confident.png**
```
Используй MCP функцию gr1_flux1_schnell_infer для генерации изображения:
- prompt: "A confident bartender character in casino noir style, elegant, detailed, cinematic lighting, green and gold color scheme, right position, self-assured, knowing expression"
- width: 1024
- height: 1024
- Сохрани результат в assets/images/characters/bartender_confident.png
```

3. **bartender_impressed.png**
```
Используй MCP функцию gr1_flux1_schnell_infer для генерации изображения:
- prompt: "An impressed bartender character in casino noir style, elegant, detailed, cinematic lighting, green and gold color scheme, right position, respectful expression, acknowledging skill"
- width: 1024
- height: 1024
- Сохрани результат в assets/images/characters/bartender_impressed.png
```

## После генерации

После генерации всех изображений обновите манифест:

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

Игра автоматически будет использовать локальные изображения вместо генерации на лету!

