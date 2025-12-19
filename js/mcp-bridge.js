/**
 * Мост для интеграции с MCP сервером Hugging Face
 * Этот файл обеспечивает связь между браузером и MCP сервером
 * 
 * ВАЖНО: Для работы с реальным MCP сервером нужен серверный прокси или WebSocket соединение
 * Этот файл предоставляет интерфейс для вызова функций MCP
 */

class MCPBridge {
    constructor() {
        this.serverUrl = null; // URL серверного прокси для MCP
        this.wsConnection = null;
        this.isConnected = false;
    }

    /**
     * Инициализирует соединение с MCP сервером
     * @param {string} serverUrl - URL серверного прокси (опционально)
     */
    async init(serverUrl = null) {
        this.serverUrl = serverUrl;
        
        // Если указан URL, пытаемся подключиться через HTTP
        if (serverUrl) {
            try {
                const response = await fetch(`${serverUrl}/health`);
                if (response.ok) {
                    this.isConnected = true;
                    console.log('MCP Bridge: Подключено через HTTP прокси');
                    return true;
                }
            } catch (e) {
                console.warn('MCP Bridge: Не удалось подключиться через HTTP:', e);
            }
        }

        // Пытаемся использовать WebSocket если доступен
        if (window.WebSocket) {
            try {
                // В реальной реализации здесь будет WebSocket соединение
                // const wsUrl = 'ws://localhost:8080/mcp';
                // this.wsConnection = new WebSocket(wsUrl);
                // this.setupWebSocketHandlers();
                console.log('MCP Bridge: WebSocket не настроен, используем placeholder режим');
            } catch (e) {
                console.warn('MCP Bridge: Не удалось подключиться через WebSocket:', e);
            }
        }

        // Если ничего не работает, используем placeholder режим
        console.log('MCP Bridge: Работает в placeholder режиме');
        return false;
    }

    /**
     * Генерирует изображение через HF MCP сервер
     * @param {object} params - Параметры генерации
     * @returns {Promise<string>} - URL или base64 изображения
     */
    async generateImage(params) {
        if (!this.isConnected && !this.serverUrl) {
            // Возвращаем null, чтобы использовать placeholder
            return null;
        }

        try {
            if (this.serverUrl) {
                // HTTP запрос к прокси серверу
                const response = await fetch(`${this.serverUrl}/generate-image`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(params)
                });

                if (response.ok) {
                    const data = await response.json();
                    return data.imageUrl || data.image;
                }
            }

            // WebSocket запрос
            if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
                return new Promise((resolve, reject) => {
                    const requestId = Math.random().toString(36);
                    
                    const handler = (event) => {
                        const data = JSON.parse(event.data);
                        if (data.requestId === requestId) {
                            this.wsConnection.removeEventListener('message', handler);
                            if (data.error) {
                                reject(new Error(data.error));
                            } else {
                                resolve(data.imageUrl || data.image);
                            }
                        }
                    };

                    this.wsConnection.addEventListener('message', handler);
                    this.wsConnection.send(JSON.stringify({
                        type: 'generate-image',
                        requestId: requestId,
                        params: params
                    }));

                    // Таймаут
                    setTimeout(() => {
                        this.wsConnection.removeEventListener('message', handler);
                        reject(new Error('Timeout'));
                    }, 30000);
                });
            }
        } catch (error) {
            console.error('MCP Bridge: Ошибка генерации изображения:', error);
            return null;
        }

        return null;
    }

    /**
     * Настраивает обработчики WebSocket
     */
    setupWebSocketHandlers() {
        if (!this.wsConnection) return;

        this.wsConnection.onopen = () => {
            console.log('MCP Bridge: WebSocket соединение установлено');
            this.isConnected = true;
        };

        this.wsConnection.onerror = (error) => {
            console.error('MCP Bridge: WebSocket ошибка:', error);
            this.isConnected = false;
        };

        this.wsConnection.onclose = () => {
            console.log('MCP Bridge: WebSocket соединение закрыто');
            this.isConnected = false;
        };
    }
}

// Создаем глобальный экземпляр
window.mcpBridge = new MCPBridge();

// Инициализируем при загрузке (можно настроить URL через переменную окружения или конфиг)
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем наличие конфигурации
    const mcpServerUrl = window.MCP_SERVER_URL || null;
    if (mcpServerUrl) {
        window.mcpBridge.init(mcpServerUrl);
    }
});

// Экспорт для использования в других модулях
window.MCPBridge = MCPBridge;

