/**
 * Система достижений
 */

class Achievements {
    constructor() {
        this.achievements = {
            first_win: { unlocked: false, name: "First Win", description: "Win your first minigame" },
            blackjack_master: { unlocked: false, name: "Blackjack Master", description: "Win 3 blackjack games in a row" },
            slots_jackpot: { unlocked: false, name: "Jackpot", description: "Win the slots jackpot" },
            poker_champion: { unlocked: false, name: "Poker Champion", description: "Win a poker tournament" },
            investigator: { unlocked: false, name: "Investigator", description: "Complete the investigation" },
            negotiator: { unlocked: false, name: "Negotiator", description: "Make a deal with the bartender" },
            hacker: { unlocked: false, name: "Hacker", description: "Hack the security system" },
            rich: { unlocked: false, name: "Rich", description: "Accumulate 10000 money" },
            collector: { unlocked: false, name: "Collector", description: "Collect 10 keys" },
            perfect_mission: { unlocked: false, name: "Perfect Mission", description: "Complete a mission without errors" }
        };
        this.stats = {
            games_won: 0,
            games_lost: 0,
            blackjack_wins: 0,
            slots_wins: 0,
            poker_wins: 0,
            choices_made: 0,
            scenes_visited: []
        };
        this.load();
    }

    /**
     * Разблокирует достижение
     */
    unlock(achievementId) {
        if (this.achievements[achievementId] && !this.achievements[achievementId].unlocked) {
            this.achievements[achievementId].unlocked = true;
            this.save();
            this.showNotification(achievementId);
            return true;
        }
        return false;
    }

    /**
     * Проверяет достижения
     */
    checkAchievements() {
        // Первая победа
        if (this.stats.games_won >= 1 && !this.achievements.first_win.unlocked) {
            this.unlock('first_win');
        }

        // Мастер блэкджека
        if (this.stats.blackjack_wins >= 3 && !this.achievements.blackjack_master.unlocked) {
            this.unlock('blackjack_master');
        }

        // Богач
        const inventory = window.game?.inventory;
        if (inventory && inventory.getAmount('money') >= 10000 && !this.achievements.rich.unlocked) {
            this.unlock('rich');
        }

        // Коллекционер
        if (inventory && inventory.getAmount('keys') >= 10 && !this.achievements.collector.unlocked) {
            this.unlock('collector');
        }
    }

    /**
     * Обновляет статистику
     */
    updateStat(statName, value = 1) {
        if (this.stats[statName] !== undefined) {
            if (Array.isArray(this.stats[statName])) {
                if (!this.stats[statName].includes(value)) {
                    this.stats[statName].push(value);
                }
            } else {
                this.stats[statName] += value;
            }
            this.save();
            this.checkAchievements();
        }
    }

    /**
     * Показывает уведомление о достижении
     */
    showNotification(achievementId) {
        const achievement = this.achievements[achievementId];
        if (!achievement) return;

        if (window.notifications) {
            window.notifications.success(`🏆 Achievement unlocked: ${achievement.name}`, 5000);
        }
    }

    /**
     * Получает список разблокированных достижений
     */
    getUnlocked() {
        return Object.keys(this.achievements)
            .filter(id => this.achievements[id].unlocked)
            .map(id => ({
                id,
                ...this.achievements[id]
            }));
    }

    /**
     * Получает прогресс достижения
     */
    getProgress(achievementId) {
        const achievement = this.achievements[achievementId];
        if (!achievement) return 0;

        switch (achievementId) {
            case 'first_win':
                return Math.min(this.stats.games_won, 1);
            case 'blackjack_master':
                return Math.min(this.stats.blackjack_wins, 3) / 3;
            case 'rich':
                const inventory = window.game?.inventory;
                if (!inventory) return 0;
                return Math.min(inventory.getAmount('money'), 10000) / 10000;
            case 'collector':
                const inv = window.game?.inventory;
                if (!inv) return 0;
                return Math.min(inv.getAmount('keys'), 10) / 10;
            default:
                return achievement.unlocked ? 1 : 0;
        }
    }

    /**
     * Сохраняет достижения
     */
    save() {
        try {
            localStorage.setItem('achievements', JSON.stringify({
                achievements: this.achievements,
                stats: this.stats
            }));
        } catch (e) {
            console.error('Ошибка сохранения достижений:', e);
        }
    }

    /**
     * Загружает достижения
     */
    load() {
        try {
            const saved = localStorage.getItem('achievements');
            if (saved) {
                const data = JSON.parse(saved);
                this.achievements = { ...this.achievements, ...data.achievements };
                this.stats = { ...this.stats, ...data.stats };
            }
        } catch (e) {
            console.error('Ошибка загрузки достижений:', e);
        }
    }

    /**
     * Сбрасывает достижения
     */
    reset() {
        Object.keys(this.achievements).forEach(id => {
            this.achievements[id].unlocked = false;
        });
        this.stats = {
            games_won: 0,
            games_lost: 0,
            blackjack_wins: 0,
            slots_wins: 0,
            poker_wins: 0,
            choices_made: 0,
            scenes_visited: []
        };
        this.save();
    }
}

// Экспорт
window.Achievements = Achievements;


