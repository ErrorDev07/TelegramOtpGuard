// Render.com startup script with health check endpoint
const http = require('http');
const puppeteer = require('puppeteer');

// Create a simple HTTP server for health checks
const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: 'ok', 
            timestamp: new Date().toISOString(),
            service: 'telegram-otp-bot'
        }));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Start health check server
const port = process.env.PORT || 10000;
server.listen(port, '0.0.0.0', () => {
    console.log(`🌐 Health check server running on port ${port}`);
});

// Configure Puppeteer for Render environment
async function launchBrowserForRender() {
    console.log('🚀 Launching browser for Render...');
    
    return await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu',
            '--disable-gpu-sandbox',
            '--disable-software-rasterizer',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--disable-features=VizDisplayCompositor',
            '--disable-extensions',
            '--disable-default-apps',
            '--disable-sync',
            '--disable-translate',
            '--hide-scrollbars',
            '--mute-audio',
            '--no-default-browser-check',
            '--disable-notifications',
            '--disable-web-security',
            '--disable-features=TranslateUI',
            '--disable-ipc-flooding-protection'
        ],
        ignoreHTTPSErrors: true,
        dumpio: false
    });
}

// Start the Telegram bot
async function startBot() {
    try {
        console.log('🚀 Starting Telegram OTP Bot for Render...');
        
        // Set environment variable for Render browser configuration
        process.env.RENDER_HOSTING = 'true';
        
        // Import and start the main bot
        require('./index.js');
        
    } catch (error) {
        console.error('❌ Failed to start bot:', error);
        process.exit(1);
    }
}

// Start both health server and bot
startBot();

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('📴 Received SIGTERM, shutting down gracefully...');
    server.close(() => {
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('📴 Received SIGINT, shutting down gracefully...');
    server.close(() => {
        process.exit(0);
    });
});