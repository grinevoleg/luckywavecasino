/**
 * Система сохранений через LocalStorage
 */

class SaveSystem {
    constructor() {
        this.saveSlots = 10; // Количество слотов для сохранений
        this.currentSaveSlot = null;
    }

    /**
     * Сохраняет игру
     */
    saveGame(slotIndex, gameState) {
        try {
            const saveData = {
                slot: slotIndex,
                timestamp: new Date().toISOString(),
                date: new Date().toLocaleString('en-US'),
                gameState: gameState,
                preview: this.generatePreview(gameState)
            };

            const key = `lucky_wave_save_${slotIndex}`;
            localStorage.setItem(key, JSON.stringify(saveData));
            
            // Сохраняем список всех сохранений
            this.updateSaveList();
            
            return true;
        } catch (e) {
            console.error('Ошибка сохранения игры:', e);
            return false;
        }
    }

    /**
     * Загружает игру
     */
    loadGame(slotIndex) {
        try {
            const key = `lucky_wave_save_${slotIndex}`;
            const saveData = localStorage.getItem(key);
            
            if (!saveData) {
                return null;
            }

            const parsed = JSON.parse(saveData);
            this.currentSaveSlot = slotIndex;
            return parsed.gameState;
        } catch (e) {
            console.error('Ошибка загрузки игры:', e);
            return null;
        }
    }

    /**
     * Удаляет сохранение
     */
    deleteSave(slotIndex) {
        try {
            const key = `lucky_wave_save_${slotIndex}`;
            localStorage.removeItem(key);
            this.updateSaveList();
            return true;
        } catch (e) {
            console.error('Ошибка удаления сохранения:', e);
            return false;
        }
    }

    /**
     * Получает список всех сохранений
     */
    getAllSaves() {
        const saves = [];
        
        for (let i = 0; i < this.saveSlots; i++) {
            const key = `lucky_wave_save_${i}`;
            const saveData = localStorage.getItem(key);
            
            if (saveData) {
                try {
                    const parsed = JSON.parse(saveData);
                    saves.push({
                        slot: i,
                        ...parsed
                    });
                } catch (e) {
                    console.warn('Ошибка парсинга сохранения:', i, e);
                }
            }
        }
        
        return saves;
    }

    /**
     * Генерирует превью для сохранения
     */
    generatePreview(gameState) {
        if (!gameState) return 'Empty Save';
        
        const chapter = gameState.currentChapter || 'Chapter 1';
        const scene = gameState.currentScene || 'Start';
        
        return `${chapter} - ${scene}`;
    }

    /**
     * Обновляет список сохранений в LocalStorage
     */
    updateSaveList() {
        const saves = this.getAllSaves();
        localStorage.setItem('lucky_wave_save_list', JSON.stringify(saves));
    }

    /**
     * Быстрое сохранение (автосохранение)
     */
    quickSave(gameState) {
        // Используем слот 0 для быстрого сохранения
        return this.saveGame(0, gameState);
    }

    /**
     * Быстрая загрузка
     */
    quickLoad() {
        return this.loadGame(0);
    }

    /**
     * Проверяет наличие сохранений
     */
    hasSaves() {
        for (let i = 0; i < this.saveSlots; i++) {
            const key = `lucky_wave_save_${i}`;
            if (localStorage.getItem(key)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Очищает все сохранения (осторожно!)
     */
    clearAllSaves() {
        for (let i = 0; i < this.saveSlots; i++) {
            const key = `lucky_wave_save_${i}`;
            localStorage.removeItem(key);
        }
        localStorage.removeItem('lucky_wave_save_list');
    }
}

// Экспорт
window.SaveSystem = SaveSystem;

