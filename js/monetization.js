/**
 * Система монетизации: ключи/билеты, премиум-выборы, косметика
 */

class Monetization {
    constructor() {
        this.keys = 0;
        this.tickets = 0;
        this.premiumChoices = [];
        this.cosmetics = {
            outfits: [],
            currentOutfit: 'default'
        };
        
        this.loadFromStorage();
    }

    /**
     * Загружает данные из LocalStorage
     */
    loadFromStorage() {
        try {
            const data = localStorage.getItem('lucky_wave_monetization');
            if (data) {
                const parsed = JSON.parse(data);
                this.keys = parsed.keys || 0;
                this.tickets = parsed.tickets || 0;
                this.premiumChoices = parsed.premiumChoices || [];
                this.cosmetics = parsed.cosmetics || this.cosmetics;
            }
        } catch (e) {
            console.warn('Не удалось загрузить данные монетизации:', e);
        }
    }

    /**
     * Сохраняет данные в LocalStorage
     */
    saveToStorage() {
        try {
            const data = {
                keys: this.keys,
                tickets: this.tickets,
                premiumChoices: this.premiumChoices,
                cosmetics: this.cosmetics
            };
            localStorage.setItem('lucky_wave_monetization', JSON.stringify(data));
        } catch (e) {
            console.warn('Не удалось сохранить данные монетизации:', e);
        }
    }

    /**
     * Добавляет ключи
     */
    addKeys(amount) {
        this.keys += amount;
        this.saveToStorage();
        this.updateUI();
    }

    /**
     * Использует ключ для открытия главы
     */
    useKey() {
        if (this.keys > 0) {
            this.keys--;
            this.saveToStorage();
            this.updateUI();
            return true;
        }
        return false;
    }

    /**
     * Проверяет, есть ли ключи
     */
    hasKeys() {
        return this.keys > 0;
    }

    /**
     * Добавляет билеты
     */
    addTickets(amount) {
        this.tickets += amount;
        this.saveToStorage();
        this.updateUI();
    }

    /**
     * Использует билет для премиум-выбора
     */
    useTicket() {
        if (this.tickets > 0) {
            this.tickets--;
            this.saveToStorage();
            this.updateUI();
            return true;
        }
        return false;
    }

    /**
     * Проверяет, есть ли билеты
     */
    hasTickets() {
        return this.tickets > 0;
    }

    /**
     * Разблокирует премиум-выбор
     */
    unlockPremiumChoice(choiceId) {
        if (!this.premiumChoices.includes(choiceId)) {
            this.premiumChoices.push(choiceId);
            this.saveToStorage();
        }
    }

    /**
     * Проверяет, разблокирован ли премиум-выбор
     */
    isPremiumChoiceUnlocked(choiceId) {
        return this.premiumChoices.includes(choiceId);
    }

    /**
     * Покупает премиум-выбор (использует билет или ключ)
     */
    purchasePremiumChoice(choiceId, useTicket = true) {
        if (this.isPremiumChoiceUnlocked(choiceId)) {
            return true; // Уже разблокирован
        }

        if (useTicket && this.hasTickets()) {
            this.useTicket();
            this.unlockPremiumChoice(choiceId);
            return true;
        } else if (!useTicket && this.hasKeys()) {
            this.useKey();
            this.unlockPremiumChoice(choiceId);
            return true;
        }

        return false;
    }

    /**
     * Добавляет косметический предмет
     */
    addCosmetic(type, itemId) {
        if (!this.cosmetics[type]) {
            this.cosmetics[type] = [];
        }
        
        if (!this.cosmetics[type].includes(itemId)) {
            this.cosmetics[type].push(itemId);
            this.saveToStorage();
        }
    }

    /**
     * Устанавливает текущий наряд
     */
    setOutfit(outfitId) {
        if (this.cosmetics.outfits.includes(outfitId) || outfitId === 'default') {
            this.cosmetics.currentOutfit = outfitId;
            this.saveToStorage();
            return true;
        }
        return false;
    }

    /**
     * Получает текущий наряд
     */
    getCurrentOutfit() {
        return this.cosmetics.currentOutfit;
    }

    /**
     * Обновляет UI (если есть элементы для отображения)
     */
    updateUI() {
        // Обновляем счетчики ключей и билетов, если они есть на странице
        const keysEl = document.getElementById('keys-count');
        const ticketsEl = document.getElementById('tickets-count');
        
        if (keysEl) {
            keysEl.textContent = this.keys;
        }
        
        if (ticketsEl) {
            ticketsEl.textContent = this.tickets;
        }
    }

    /**
     * Покупка ключей (заглушка для интеграции с платежной системой)
     */
    purchaseKeys(amount, price) {
        // В реальной реализации здесь будет интеграция с платежной системой
        console.log(`Покупка ${amount} ключей за ${price}`);
        
        // Для MVP просто добавляем ключи
        this.addKeys(amount);
        return true;
    }

    /**
     * Покупка билетов (заглушка для интеграции с платежной системой)
     */
    purchaseTickets(amount, price) {
        // В реальной реализации здесь будет интеграция с платежной системой
        console.log(`Покупка ${amount} билетов за ${price}`);
        
        // Для MVP просто добавляем билеты
        this.addTickets(amount);
        return true;
    }

    /**
     * Сброс данных (для тестирования)
     */
    reset() {
        this.keys = 0;
        this.tickets = 0;
        this.premiumChoices = [];
        this.cosmetics = {
            outfits: [],
            currentOutfit: 'default'
        };
        this.saveToStorage();
        this.updateUI();
    }

    /**
     * Дает стартовые ресурсы для тестирования
     */
    giveTestResources() {
        this.addKeys(5);
        this.addTickets(10);
        this.saveToStorage();
        this.updateUI();
    }
}

// Экспорт
window.Monetization = Monetization;

