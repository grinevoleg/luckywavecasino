/**
 * Inventory and items system
 */

class Inventory {
    constructor() {
        this.items = {
            keys: 0,
            tickets: 0,
            money: 1000,
            items: []
        };
        this.load();
    }

    /**
     * Add item to inventory
     */
    addItem(type, amount = 1) {
        if (type === 'key' || type === 'keys') {
            this.items.keys += amount;
        } else if (type === 'ticket' || type === 'tickets') {
            this.items.tickets += amount;
        } else if (type === 'money') {
            this.items.money += amount;
        } else {
            const existingItem = this.items.items.find(item => item.id === type);
            if (existingItem) {
                existingItem.amount += amount;
            } else {
                this.items.items.push({ id: type, amount: amount });
            }
        }
        this.save();
        this.updateUI();
    }

    /**
     * Use item from inventory
     */
    useItem(type, amount = 1) {
        if (type === 'key' || type === 'keys') {
            if (this.items.keys >= amount) {
                this.items.keys -= amount;
                this.save();
                this.updateUI();
                return true;
            }
        } else if (type === 'ticket' || type === 'tickets') {
            if (this.items.tickets >= amount) {
                this.items.tickets -= amount;
                this.save();
                this.updateUI();
                return true;
            }
        } else if (type === 'money') {
            if (this.items.money >= amount) {
                this.items.money -= amount;
                this.save();
                this.updateUI();
                return true;
            }
        } else {
            const item = this.items.items.find(item => item.id === type);
            if (item && item.amount >= amount) {
                item.amount -= amount;
                if (item.amount <= 0) {
                    this.items.items = this.items.items.filter(i => i.id !== type);
                }
                this.save();
                this.updateUI();
                return true;
            }
        }
        return false;
    }

    /**
     * Check if item exists
     */
    hasItem(type, amount = 1) {
        if (type === 'key' || type === 'keys') {
            return this.items.keys >= amount;
        } else if (type === 'ticket' || type === 'tickets') {
            return this.items.tickets >= amount;
        } else if (type === 'money') {
            return this.items.money >= amount;
        } else {
            const item = this.items.items.find(item => item.id === type);
            return item && item.amount >= amount;
        }
    }

    /**
     * Get item amount
     */
    getAmount(type) {
        if (type === 'key' || type === 'keys') {
            return this.items.keys;
        } else if (type === 'ticket' || type === 'tickets') {
            return this.items.tickets;
        } else if (type === 'money') {
            return this.items.money;
        } else {
            const item = this.items.items.find(item => item.id === type);
            return item ? item.amount : 0;
        }
    }

    /**
     * Save inventory
     */
    save() {
        try {
            localStorage.setItem('inventory', JSON.stringify(this.items));
        } catch (e) {
            console.error('Error saving inventory:', e);
        }
    }

    /**
     * Load inventory
     */
    load() {
        try {
            const saved = localStorage.getItem('inventory');
            if (saved) {
                this.items = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Error loading inventory:', e);
        }
    }

    /**
     * Reset inventory
     */
    reset() {
        this.items = {
            keys: 0,
            tickets: 0,
            money: 1000,
            items: []
        };
        this.save();
        this.updateUI();
    }

    /**
     * Update inventory UI
     */
    updateUI() {
        const keysEl = document.getElementById('inventory-keys');
        const ticketsEl = document.getElementById('inventory-tickets');
        const moneyEl = document.getElementById('inventory-money');

        if (keysEl) keysEl.textContent = this.items.keys;
        if (ticketsEl) ticketsEl.textContent = this.items.tickets;
        if (moneyEl) moneyEl.textContent = this.items.money.toLocaleString();
    }
}

// Export
window.Inventory = Inventory;



