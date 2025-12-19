/**
 * Поддержка мобильных устройств (iPhone)
 */

class MobileSupport {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isIOS = this.detectIOS();
        this.init();
    }

    /**
     * Определяет мобильное устройство
     */
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768);
    }

    /**
     * Определяет iOS устройство
     */
    detectIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    /**
     * Инициализация мобильной поддержки
     */
    init() {
        if (this.isMobile) {
            console.log('Мобильное устройство обнаружено');
            this.setupMobileFeatures();
        }

        if (this.isIOS) {
            console.log('iOS устройство обнаружено');
            this.setupIOSFeatures();
        }

        // Обработка изменения ориентации
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });

        // Обработка изменения размера окна
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    /**
     * Настройка функций для мобильных устройств
     */
    setupMobileFeatures() {
        // Предотвращение двойного тапа для zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Улучшенная обработка touch событий для кнопок
        document.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('touchstart', function() {
                this.style.opacity = '0.8';
            });
            btn.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.opacity = '1';
                }, 150);
            });
        });
    }

    /**
     * Настройка функций для iOS
     */
    setupIOSFeatures() {
        // Исправление высоты viewport на iOS
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
        window.addEventListener('orientationchange', setViewportHeight);

        // Предотвращение bounce эффекта
        document.body.addEventListener('touchmove', (e) => {
            if (e.target.closest('.dialogue-box') || 
                e.target.closest('.choices-container') ||
                e.target.closest('.minigame-container')) {
                // Разрешаем скролл в контейнерах
                return;
            }
            // Предотвращаем скролл страницы
            e.preventDefault();
        }, { passive: false });
    }

    /**
     * Обработка изменения ориентации
     */
    handleOrientationChange() {
        console.log('Изменение ориентации');
        // Обновляем размеры элементов
        const gameScreen = document.getElementById('game-screen');
        if (gameScreen && gameScreen.classList.contains('active')) {
            // Пересчитываем позиции элементов
            this.updateLayout();
        }
    }

    /**
     * Обработка изменения размера окна
     */
    handleResize() {
        if (this.isMobile) {
            this.updateLayout();
        }
    }

    /**
     * Обновление layout для мобильных устройств
     */
    updateLayout() {
        // Обновляем высоту viewport
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        // Обновляем позиции элементов диалога
        const dialogueBox = document.getElementById('dialogue-box');
        if (dialogueBox) {
            const safeAreaBottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)')) || 0;
            dialogueBox.style.paddingBottom = `${Math.max(20, safeAreaBottom)}px`;
        }
    }

    /**
     * Получает информацию об устройстве
     */
    getDeviceInfo() {
        return {
            isMobile: this.isMobile,
            isIOS: this.isIOS,
            width: window.innerWidth,
            height: window.innerHeight,
            orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
        };
    }
}

// Инициализация при загрузке
let mobileSupport;
document.addEventListener('DOMContentLoaded', () => {
    mobileSupport = new MobileSupport();
    window.mobileSupport = mobileSupport;
});

// Экспорт
window.MobileSupport = MobileSupport;


