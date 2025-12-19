/**
 * Система интерфейсных уведомлений
 */

class NotificationSystem {
    constructor() {
        this.container = document.getElementById('notification-container');
        if (!this.container) {
            console.warn('Контейнер уведомлений не найден');
        }
    }

    /**
     * Показывает уведомление
     */
    show(message, type = 'info', title = null, duration = 3000) {
        if (!this.container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        const icon = this.getIcon(type);
        const displayTitle = title || this.getDefaultTitle(type);

        notification.innerHTML = `
            <div class="notification-icon">${icon}</div>
            <div class="notification-content">
                <div class="notification-title">${displayTitle}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">×</button>
        `;

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.hide(notification);
        });

        this.container.appendChild(notification);

        // Автоматическое скрытие
        if (duration > 0) {
            setTimeout(() => {
                this.hide(notification);
            }, duration);
        }

        return notification;
    }

    /**
     * Скрывает уведомление
     */
    hide(notification) {
        if (!notification) return;
        
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    /**
     * Получает иконку для типа уведомления
     */
    getIcon(type) {
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    /**
     * Получает заголовок по умолчанию
     */
    getDefaultTitle(type) {
        const titles = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Information'
        };
        return titles[type] || titles.info;
    }

    /**
     * Быстрые методы
     */
    success(message, title = null) {
        return this.show(message, 'success', title);
    }

    error(message, title = null) {
        return this.show(message, 'error', title);
    }

    warning(message, title = null) {
        return this.show(message, 'warning', title);
    }

    info(message, title = null) {
        return this.show(message, 'info', title);
    }
}

/**
 * Система модальных окон подтверждения
 */
class ConfirmSystem {
    constructor() {
        this.modal = document.getElementById('confirm-modal');
        this.titleEl = document.getElementById('confirm-title');
        this.messageEl = document.getElementById('confirm-message');
        this.yesBtn = document.getElementById('confirm-yes');
        this.noBtn = document.getElementById('confirm-no');
        
        if (!this.modal) {
            console.warn('Модальное окно подтверждения не найдено');
            return;
        }

        // Закрытие по клику вне модального окна
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        });
    }

    /**
     * Показывает модальное окно подтверждения
     */
    show(message, title = 'Confirmation') {
        return new Promise((resolve) => {
            if (!this.modal) {
                // Fallback на стандартный confirm если модалка не найдена
                resolve(confirm(message));
                return;
            }

            this.messageEl.textContent = message;
            this.titleEl.textContent = title;
            this.modal.classList.remove('hidden');

            const handleYes = () => {
                this.cleanup();
                this.hide();
                resolve(true);
            };

            const handleNo = () => {
                this.cleanup();
                this.hide();
                resolve(false);
            };

            this.yesBtn.onclick = handleYes;
            this.noBtn.onclick = handleNo;
        });
    }

    /**
     * Скрывает модальное окно
     */
    hide() {
        if (this.modal) {
            this.modal.classList.add('hidden');
        }
    }

    /**
     * Очищает обработчики
     */
    cleanup() {
        this.yesBtn.onclick = null;
        this.noBtn.onclick = null;
    }
}

// Создаем глобальные экземпляры
window.notifications = new NotificationSystem();
window.confirmDialog = new ConfirmSystem();

// Экспорт
window.NotificationSystem = NotificationSystem;
window.ConfirmSystem = ConfirmSystem;


