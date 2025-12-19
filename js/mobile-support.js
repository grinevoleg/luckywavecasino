/**
 * Mobile device support (iPhone)
 */

class MobileSupport {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isIOS = this.detectIOS();
        this.init();
    }

    /**
     * Detect mobile device
     */
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768);
    }

    /**
     * Detect iOS device
     */
    detectIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    /**
     * Initialize mobile support
     */
    init() {
        if (this.isMobile) {
            console.log('Mobile device detected');
            this.setupMobileFeatures();
        }

        if (this.isIOS) {
            console.log('iOS device detected');
            this.setupIOSFeatures();
        }

        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    /**
     * Setup mobile features
     */
    setupMobileFeatures() {
        // Prevent double tap zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Improved touch event handling for buttons
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
     * Setup iOS features
     */
    setupIOSFeatures() {
        // Fix viewport height on iOS
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
        window.addEventListener('orientationchange', setViewportHeight);

        // Prevent bounce effect
        document.body.addEventListener('touchmove', (e) => {
            if (e.target.closest('.dialogue-box') || 
                e.target.closest('.choices-container') ||
                e.target.closest('.minigame-container')) {
                // Allow scroll in containers
                return;
            }
            // Prevent page scroll
            e.preventDefault();
        }, { passive: false });
    }

    /**
     * Handle orientation change
     */
    handleOrientationChange() {
        console.log('Orientation changed');
        // Update element sizes
        const gameScreen = document.getElementById('game-screen');
        if (gameScreen && gameScreen.classList.contains('active')) {
            // Recalculate element positions
            this.updateLayout();
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        if (this.isMobile) {
            this.updateLayout();
        }
    }

    /**
     * Update layout for mobile devices
     */
    updateLayout() {
        // Update viewport height
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        // Update dialogue element positions
        const dialogueBox = document.getElementById('dialogue-box');
        if (dialogueBox) {
            const safeAreaBottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)')) || 0;
            dialogueBox.style.paddingBottom = `${Math.max(20, safeAreaBottom)}px`;
        }
    }

    /**
     * Get device information
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

// Initialize on load
let mobileSupport;
document.addEventListener('DOMContentLoaded', () => {
    mobileSupport = new MobileSupport();
    window.mobileSupport = mobileSupport;
});

// Export
window.MobileSupport = MobileSupport;



