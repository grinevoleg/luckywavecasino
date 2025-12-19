/**
 * Save system using LocalStorage
 */

class SaveSystem {
    constructor() {
        this.saveSlots = 10; // Number of save slots
        this.currentSaveSlot = null;
    }

    /**
     * Save game
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
            
            // Save list of all saves
            this.updateSaveList();
            
            return true;
        } catch (e) {
            console.error('Error saving game:', e);
            return false;
        }
    }

    /**
     * Load game
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
            console.error('Error loading game:', e);
            return null;
        }
    }

    /**
     * Delete save
     */
    deleteSave(slotIndex) {
        try {
            const key = `lucky_wave_save_${slotIndex}`;
            localStorage.removeItem(key);
            this.updateSaveList();
            return true;
        } catch (e) {
            console.error('Error deleting save:', e);
            return false;
        }
    }

    /**
     * Get all saves list
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
                    console.warn('Error parsing save:', i, e);
                }
            }
        }
        
        return saves;
    }

    /**
     * Generate save preview
     */
    generatePreview(gameState) {
        if (!gameState) return 'Empty Save';
        
        const chapter = gameState.currentChapter || 'Chapter 1';
        const scene = gameState.currentScene || 'Start';
        
        return `${chapter} - ${scene}`;
    }

    /**
     * Update saves list in LocalStorage
     */
    updateSaveList() {
        const saves = this.getAllSaves();
        localStorage.setItem('lucky_wave_save_list', JSON.stringify(saves));
    }

    /**
     * Quick save (autosave)
     */
    quickSave(gameState) {
        // Use slot 0 for quick save
        return this.saveGame(0, gameState);
    }

    /**
     * Quick load
     */
    quickLoad() {
        return this.loadGame(0);
    }

    /**
     * Check if saves exist
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
     * Clear all saves (careful!)
     */
    clearAllSaves() {
        for (let i = 0; i < this.saveSlots; i++) {
            const key = `lucky_wave_save_${i}`;
            localStorage.removeItem(key);
        }
        localStorage.removeItem('lucky_wave_save_list');
    }
}

// Export
window.SaveSystem = SaveSystem;

