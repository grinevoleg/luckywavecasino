

class MCPBridge {
    constructor() {
        this.serverUrl = null;         this.wsConnection = null;
        this.isConnected = false;
    }

    
    async init(serverUrl = null) {
        this.serverUrl = serverUrl;
        
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

                if (window.WebSocket) {
            try {
                                // const wsUrl = 'ws://localhost:8080/mcp';
                // this.wsConnection = new WebSocket(wsUrl);
                // this.setupWebSocketHandlers();
                console.log('MCP Bridge: WebSocket не настроен, используем placeholder режим');
            } catch (e) {
                console.warn('MCP Bridge: Не удалось подключиться через WebSocket:', e);
            }
        }

                console.log('MCP Bridge: Работает в placeholder режиме');
        return false;
    }

    
    async generateImage(params) {
        if (!this.isConnected && !this.serverUrl) {
                        return null;
        }

        try {
            if (this.serverUrl) {
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

window.mcpBridge = new MCPBridge();

document.addEventListener('DOMContentLoaded', () => {
        const mcpServerUrl = window.MCP_SERVER_URL || null;
    if (mcpServerUrl) {
        window.mcpBridge.init(mcpServerUrl);
    }
});

window.MCPBridge = MCPBridge;

