/**
 * Мини-игры казино: блэкджек, слоты, покер
 */

class CasinoGames {
    constructor() {
        this.currentGame = null;
        this.gameResult = null;
    }

    /**
     * Инициализирует мини-игру
     */
    initGame(gameType, containerId, onComplete) {
        this.currentGame = gameType;
        this.gameResult = null;
        this.onComplete = onComplete;
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Контейнер для мини-игры не найден:', containerId);
            return;
        }

        container.innerHTML = '';

        switch (gameType) {
            case 'blackjack':
                this.initBlackjack(container);
                break;
            case 'slots':
                this.initSlots(container);
                break;
            case 'poker':
                this.initPoker(container);
                break;
            default:
                console.error('Неизвестный тип игры:', gameType);
        }
    }

    /**
     * Блэкджек
     */
    initBlackjack(container) {
        container.innerHTML = `
            <h2 class="minigame-title">Блэкджек</h2>
            <p class="minigame-instructions">Наберите 21 очко или максимально близко к этому числу, не превышая его</p>
            <div class="blackjack-table">
                <div class="blackjack-hand">
                    <div class="hand-label">Дилер</div>
                    <div class="hand-cards" id="dealer-hand"></div>
                    <div class="hand-value" id="dealer-value"></div>
                </div>
                <div class="blackjack-hand">
                    <div class="hand-label">Вы</div>
                    <div class="hand-cards" id="player-hand"></div>
                    <div class="hand-value" id="player-value"></div>
                </div>
                <div class="blackjack-controls">
                    <button class="casino-btn" id="btn-hit">Взять карту</button>
                    <button class="casino-btn" id="btn-stand">Остановиться</button>
                </div>
                <div class="blackjack-result" id="blackjack-result"></div>
            </div>
        `;

        this.blackjack = {
            deck: this.createDeck(),
            dealerHand: [],
            playerHand: [],
            dealerHidden: true,
            gameOver: false
        };

        // Раздаем начальные карты
        this.dealCard('player');
        this.dealCard('dealer');
        this.dealCard('player');
        this.dealCard('dealer', true); // Скрытая карта дилера

        this.updateBlackjackDisplay();
        this.setupBlackjackHandlers();
    }

    createDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const deck = [];
        
        for (const suit of suits) {
            for (const value of values) {
                deck.push({ suit, value, isRed: suit === '♥' || suit === '♦' });
            }
        }
        
        return this.shuffleDeck(deck);
    }

    shuffleDeck(deck) {
        const shuffled = [...deck];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    dealCard(target, hidden = false) {
        if (this.blackjack.deck.length === 0) {
            this.blackjack.deck = this.createDeck();
        }
        
        const card = this.blackjack.deck.pop();
        card.hidden = hidden;
        
        if (target === 'player') {
            this.blackjack.playerHand.push(card);
        } else {
            this.blackjack.dealerHand.push(card);
        }
    }

    calculateHandValue(hand) {
        let value = 0;
        let aces = 0;

        for (const card of hand) {
            if (card.hidden) continue;
            
            if (card.value === 'A') {
                aces++;
                value += 11;
            } else if (['J', 'Q', 'K'].includes(card.value)) {
                value += 10;
            } else {
                value += parseInt(card.value);
            }
        }

        // Обрабатываем тузы
        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }

        return value;
    }

    updateBlackjackDisplay() {
        const dealerHandEl = document.getElementById('dealer-hand');
        const playerHandEl = document.getElementById('player-hand');
        const dealerValueEl = document.getElementById('dealer-value');
        const playerValueEl = document.getElementById('player-value');

        // Дилер
        dealerHandEl.innerHTML = '';
        this.blackjack.dealerHand.forEach(card => {
            const cardEl = this.createCardElement(card);
            dealerHandEl.appendChild(cardEl);
        });
        dealerValueEl.textContent = this.blackjack.dealerHidden ? '?' : `Очки: ${this.calculateHandValue(this.blackjack.dealerHand)}`;

        // Игрок
        playerHandEl.innerHTML = '';
        this.blackjack.playerHand.forEach(card => {
            const cardEl = this.createCardElement(card);
            playerHandEl.appendChild(cardEl);
        });
        playerValueEl.textContent = `Очки: ${this.calculateHandValue(this.blackjack.playerHand)}`;
    }

    createCardElement(card) {
        const cardEl = document.createElement('div');
        cardEl.className = `card ${card.isRed ? 'red' : 'black'}`;
        
        if (card.hidden) {
            cardEl.className += ' card-back';
            cardEl.innerHTML = '🂠';
        } else {
            cardEl.innerHTML = `
                <div class="card-value">${card.value}</div>
                <div class="card-suit">${card.suit}</div>
            `;
        }
        
        return cardEl;
    }

    setupBlackjackHandlers() {
        document.getElementById('btn-hit').addEventListener('click', () => {
            if (this.blackjack.gameOver) return;
            
            this.dealCard('player');
            this.updateBlackjackDisplay();
            
            const playerValue = this.calculateHandValue(this.blackjack.playerHand);
            if (playerValue > 21) {
                this.endBlackjack('lose');
            }
        });

        document.getElementById('btn-stand').addEventListener('click', () => {
            if (this.blackjack.gameOver) return;
            this.endBlackjack();
        });
    }

    endBlackjack(result = null) {
        this.blackjack.gameOver = true;
        this.blackjack.dealerHidden = false;
        
        // Дилер берет карты до 17
        while (this.calculateHandValue(this.blackjack.dealerHand) < 17) {
            this.dealCard('dealer');
        }
        
        this.updateBlackjackDisplay();
        
        const dealerValue = this.calculateHandValue(this.blackjack.dealerHand);
        const playerValue = this.calculateHandValue(this.blackjack.playerHand);
        
        let finalResult;
        if (result === 'lose' || playerValue > 21) {
            finalResult = 'lose';
        } else if (dealerValue > 21 || playerValue > dealerValue) {
            finalResult = 'win';
        } else if (playerValue === dealerValue) {
            finalResult = 'draw';
        } else {
            finalResult = 'lose';
        }

        const resultEl = document.getElementById('blackjack-result');
        if (finalResult === 'win') {
            resultEl.textContent = '🎉 Вы выиграли!';
            resultEl.style.color = '#4CAF50';
        } else if (finalResult === 'draw') {
            resultEl.textContent = '🤝 Ничья!';
            resultEl.style.color = '#FFC107';
        } else {
            resultEl.textContent = '😔 Вы проиграли';
            resultEl.style.color = '#f44336';
        }

        this.gameResult = finalResult;
        
        // Отключаем кнопки
        document.getElementById('btn-hit').disabled = true;
        document.getElementById('btn-stand').disabled = true;

        // Вызываем callback через 2 секунды
        setTimeout(() => {
            if (this.onComplete) {
                this.onComplete(finalResult);
            }
        }, 2000);
    }

    /**
     * Слоты
     */
    initSlots(container) {
        container.innerHTML = `
            <h2 class="minigame-title">Слот-машина</h2>
            <p class="minigame-instructions">Соберите выигрышную комбинацию для взлома системы</p>
            <div class="slots-machine">
                <div class="slots-reels" id="slots-reels">
                    <div class="reel" id="reel-1">
                        <div class="reel-container">
                            <div class="reel-symbols" id="reel-symbols-1"></div>
                        </div>
                    </div>
                    <div class="reel" id="reel-2">
                        <div class="reel-container">
                            <div class="reel-symbols" id="reel-symbols-2"></div>
                        </div>
                    </div>
                    <div class="reel" id="reel-3">
                        <div class="reel-container">
                            <div class="reel-symbols" id="reel-symbols-3"></div>
                        </div>
                    </div>
                </div>
                <div class="slots-controls">
                    <button class="spin-btn" id="btn-spin">КРУТИТЬ</button>
                </div>
                <div class="slots-result" id="slots-result"></div>
            </div>
        `;

        this.slots = {
            symbols: ['🍒', '🍋', '🍊', '🔔', '⭐', '💎', '7️⃣'],
            reels: [null, null, null],
            spinning: false
        };

        // Инициализируем символы в барабанах
        this.initReelSymbols();
        this.setupSlotsHandlers();
    }

    initReelSymbols() {
        for (let i = 1; i <= 3; i++) {
            const symbolsContainer = document.getElementById(`reel-symbols-${i}`);
            if (!symbolsContainer) continue;

            const symbols = this.slots.symbols;
            symbolsContainer.innerHTML = '';
            
            // Добавляем символы (по 10 копий для плавной прокрутки)
            for (let j = 0; j < 10; j++) {
                symbols.forEach((symbol) => {
                    const symbolEl = document.createElement('div');
                    symbolEl.className = 'reel-symbol';
                    symbolEl.textContent = symbol;
                    symbolsContainer.appendChild(symbolEl);
                });
            }
            
            // Устанавливаем начальную позицию
            const randomStart = Math.floor(Math.random() * symbols.length) * 160;
            symbolsContainer.style.transform = `translateY(-${randomStart}px)`;
            symbolsContainer.style.transition = 'none';
        }
    }

    setupSlotsHandlers() {
        document.getElementById('btn-spin').addEventListener('click', () => {
            if (this.slots.spinning) return;
            this.spinSlots();
        });
    }

    spinSlots() {
        this.slots.spinning = true;
        const btn = document.getElementById('btn-spin');
        const resultEl = document.getElementById('slots-result');
        btn.disabled = true;
        resultEl.textContent = '';
        resultEl.style.borderColor = 'transparent';
        resultEl.style.boxShadow = 'none';
        
        const reels = [
            document.getElementById('reel-1'),
            document.getElementById('reel-2'),
            document.getElementById('reel-3')
        ];

        const symbolsContainers = [
            document.getElementById('reel-symbols-1'),
            document.getElementById('reel-symbols-2'),
            document.getElementById('reel-symbols-3')
        ];

        reels.forEach(reel => {
            reel.classList.remove('win');
        });

        const symbolHeight = 160;
        const symbolsCount = this.slots.symbols.length;
        
        // Начинаем вращение всех барабанов
        reels.forEach((reel, index) => {
            reel.classList.add('spinning');
            const container = symbolsContainers[index];
            
            if (container) {
                // Выбираем финальный символ
                const finalSymbol = this.slots.symbols[Math.floor(Math.random() * symbolsCount)];
                this.slots.reels[index] = finalSymbol;
                const symbolIndex = this.slots.symbols.indexOf(finalSymbol);
                
                // Текущая позиция
                let currentY = this.getCurrentYPosition(container);
                if (isNaN(currentY) || currentY < 0) currentY = 0;
                
                // Быстрая прокрутка с видимыми символами
                container.style.transition = 'none';
                
                let spinOffset = 0;
                const spinInterval = setInterval(() => {
                    if (reel.classList.contains('spinning')) {
                        spinOffset += symbolHeight;
                        container.style.transform = `translateY(-${currentY + spinOffset}px)`;
                    } else {
                        clearInterval(spinInterval);
                    }
                }, 30);
                
                reel.dataset.spinInterval = spinInterval;
                
                // Останавливаем на нужном символе
                setTimeout(() => {
                    clearInterval(spinInterval);
                    const targetY = currentY + spinOffset + (symbolIndex * symbolHeight);
                    container.style.transition = 'transform 0.4s ease-out';
                    container.style.transform = `translateY(-${targetY}px)`;
                }, [1200, 1600, 2000][index] - 400);
            }
        });

        // Останавливаем каждый барабан с задержкой
        const stopTimes = [1200, 1600, 2000];

        stopTimes.forEach((time, index) => {
            setTimeout(() => {
                const reel = reels[index];
                const container = symbolsContainers[index];
                
                if (reel.dataset.spinInterval) {
                    clearInterval(parseInt(reel.dataset.spinInterval));
                    delete reel.dataset.spinInterval;
                }
                
                reel.classList.remove('spinning');
                
                if (container) {
                    const finalSymbol = this.slots.reels[index];
                    const symbolIndex = this.slots.symbols.indexOf(finalSymbol);
                    let currentY = this.getCurrentYPosition(container);
                    if (isNaN(currentY) || currentY < 0) currentY = 0;
                    
                    const alignedY = Math.round(currentY / symbolHeight) * symbolHeight;
                    const targetY = alignedY + (symbolIndex * symbolHeight);
                    
                    container.style.transition = 'transform 0.3s ease-out';
                    container.style.transform = `translateY(-${targetY}px)`;
                }
                
                reel.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    reel.style.transform = '';
                }, 200);
                
                if (index === 2) {
                    setTimeout(() => {
                        this.checkSlotsResult();
                        this.slots.spinning = false;
                        btn.disabled = false;
                    }, 500);
                }
            }, time);
        });
    }

    getCurrentYPosition(element) {
        const transform = element.style.transform || window.getComputedStyle(element).transform;
        if (!transform || transform === 'none') return 0;
        const match = transform.match(/translateY\((-?\d+)px\)/);
        return match ? parseInt(match[1]) : 0;
    }

    checkSlotsResult() {
        const [a, b, c] = this.slots.reels;
        const resultEl = document.getElementById('slots-result');
        const reels = [
            document.getElementById('reel-1'),
            document.getElementById('reel-2'),
            document.getElementById('reel-3')
        ];
        
        // Проверяем выигрышные комбинации
        if (a === b && b === c) {
            // Эффект выигрыша на барабанах
            reels.forEach(reel => {
                reel.classList.add('win');
            });
            
            if (a === '💎') {
                resultEl.innerHTML = '🎉 <span>ДЖЕКПОТ!</span> Система взломана!';
                resultEl.style.color = '#FFD700';
                resultEl.style.borderColor = '#FFD700';
                resultEl.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6)';
                this.gameResult = 'jackpot';
            } else {
                resultEl.innerHTML = '🎊 <span>Выигрыш!</span> Комбинация собрана!';
                resultEl.style.color = '#4CAF50';
                resultEl.style.borderColor = '#4CAF50';
                resultEl.style.boxShadow = '0 0 30px rgba(76, 175, 80, 0.6)';
                this.gameResult = 'win';
            }
        } else if (a === b || b === c || a === c) {
            resultEl.innerHTML = '✨ <span>Почти!</span> Попробуйте еще раз';
            resultEl.style.color = '#FFC107';
            resultEl.style.borderColor = '#FFC107';
            resultEl.style.boxShadow = '0 0 20px rgba(255, 193, 7, 0.4)';
            this.gameResult = 'partial';
        } else {
            resultEl.innerHTML = '😔 <span>Не повезло.</span> Попробуйте еще раз';
            resultEl.style.color = '#f44336';
            resultEl.style.borderColor = '#f44336';
            resultEl.style.boxShadow = '0 0 20px rgba(244, 67, 54, 0.4)';
            this.gameResult = 'lose';
        }

        // Если джекпот или выигрыш, завершаем игру
        if (this.gameResult === 'jackpot' || this.gameResult === 'win') {
            setTimeout(() => {
                if (this.onComplete) {
                    this.onComplete(this.gameResult);
                }
            }, 2500);
        }
    }

    /**
     * Покер (упрощенный)
     */
    initPoker(container) {
        container.innerHTML = `
            <h2 class="minigame-title">Покер</h2>
            <p class="minigame-instructions">Соберите лучшую комбинацию карт</p>
            <div class="poker-table">
                <div class="poker-community-cards" id="community-cards"></div>
                <div class="poker-player-hand">
                    <div class="hand-label">Ваши карты</div>
                    <div class="hand-cards" id="poker-hand"></div>
                </div>
                <div class="poker-controls">
                    <input type="number" class="poker-bet-input" id="poker-bet" value="100" min="10" step="10">
                    <button class="casino-btn" id="btn-call">Колл</button>
                    <button class="casino-btn" id="btn-fold">Фолд</button>
                </div>
                <div class="poker-result" id="poker-result"></div>
            </div>
        `;

        this.poker = {
            deck: this.createDeck(),
            playerHand: [],
            communityCards: [],
            gameOver: false
        };

        // Раздаем карты
        for (let i = 0; i < 2; i++) {
            this.poker.playerHand.push(this.poker.deck.pop());
        }
        for (let i = 0; i < 5; i++) {
            this.poker.communityCards.push(this.poker.deck.pop());
        }

        this.updatePokerDisplay();
        this.setupPokerHandlers();
    }

    updatePokerDisplay() {
        const handEl = document.getElementById('poker-hand');
        const communityEl = document.getElementById('community-cards');

        handEl.innerHTML = '';
        this.poker.playerHand.forEach(card => {
            const cardEl = this.createCardElement(card);
            handEl.appendChild(cardEl);
        });

        communityEl.innerHTML = '';
        this.poker.communityCards.forEach(card => {
            const cardEl = this.createCardElement(card);
            communityEl.appendChild(cardEl);
        });
    }

    setupPokerHandlers() {
        document.getElementById('btn-call').addEventListener('click', () => {
            if (this.poker.gameOver) return;
            this.endPoker('call');
        });

        document.getElementById('btn-fold').addEventListener('click', () => {
            if (this.poker.gameOver) return;
            this.endPoker('fold');
        });
    }

    endPoker(action) {
        this.poker.gameOver = true;
        
        const resultEl = document.getElementById('poker-result');
        
        if (action === 'fold') {
            resultEl.textContent = 'Вы сбросили карты';
            resultEl.style.color = '#f44336';
            this.gameResult = 'lose';
        } else {
            // Упрощенная логика: случайный результат
            const win = Math.random() > 0.4;
            if (win) {
                resultEl.textContent = '🎉 Вы выиграли раунд!';
                resultEl.style.color = '#4CAF50';
                this.gameResult = 'win';
            } else {
                resultEl.textContent = '😔 Вы проиграли раунд';
                resultEl.style.color = '#f44336';
                this.gameResult = 'lose';
            }
        }

        document.getElementById('btn-call').disabled = true;
        document.getElementById('btn-fold').disabled = true;

        setTimeout(() => {
            if (this.onComplete) {
                this.onComplete(this.gameResult);
            }
        }, 2000);
    }

    /**
     * Получает результат последней игры
     */
    getResult() {
        return this.gameResult;
    }
}

// Экспорт
window.CasinoGames = CasinoGames;

