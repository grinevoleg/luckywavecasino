

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

    
    addKeys(amount) {
        this.keys += amount;
        this.saveToStorage();
        this.updateUI();
    }

    
    useKey() {
        if (this.keys > 0) {
            this.keys--;
            this.saveToStorage();
            this.updateUI();
            return true;
        }
        return false;
    }

    
    hasKeys() {
        return this.keys > 0;
    }

    
    addTickets(amount) {
        this.tickets += amount;
        this.saveToStorage();
        this.updateUI();
    }

    
    useTicket() {
        if (this.tickets > 0) {
            this.tickets--;
            this.saveToStorage();
            this.updateUI();
            return true;
        }
        return false;
    }

    
    hasTickets() {
        return this.tickets > 0;
    }

    
    unlockPremiumChoice(choiceId) {
        if (!this.premiumChoices.includes(choiceId)) {
            this.premiumChoices.push(choiceId);
            this.saveToStorage();
        }
    }

    
    isPremiumChoiceUnlocked(choiceId) {
        return this.premiumChoices.includes(choiceId);
    }

    
    purchasePremiumChoice(choiceId, useTicket = true) {
        if (this.isPremiumChoiceUnlocked(choiceId)) {
            return true;         }

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

    
    addCosmetic(type, itemId) {
        if (!this.cosmetics[type]) {
            this.cosmetics[type] = [];
        }
        
        if (!this.cosmetics[type].includes(itemId)) {
            this.cosmetics[type].push(itemId);
            this.saveToStorage();
        }
    }

    
    setOutfit(outfitId) {
        if (this.cosmetics.outfits.includes(outfitId) || outfitId === 'default') {
            this.cosmetics.currentOutfit = outfitId;
            this.saveToStorage();
            return true;
        }
        return false;
    }

    
    getCurrentOutfit() {
        return this.cosmetics.currentOutfit;
    }

    
    updateUI() {
                const keysEl = document.getElementById('keys-count');
        const ticketsEl = document.getElementById('tickets-count');
        
        if (keysEl) {
            keysEl.textContent = this.keys;
        }
        
        if (ticketsEl) {
            ticketsEl.textContent = this.tickets;
        }
    }

    
    purchaseKeys(amount, price) {
                console.log(`Покупка ${amount} ключей за ${price}`);
        
                this.addKeys(amount);
        return true;
    }

    
    purchaseTickets(amount, price) {
                console.log(`Покупка ${amount} билетов за ${price}`);
        
                this.addTickets(amount);
        return true;
    }

    
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

    
    giveTestResources() {
        this.addKeys(5);
        this.addTickets(10);
        this.saveToStorage();
        this.updateUI();
    }
}

window.Monetization = Monetization;

