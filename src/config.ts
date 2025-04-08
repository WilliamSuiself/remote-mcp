/**
 * Google OAuth 配置
 */
export const GOOGLE_OAUTH_CONFIG = {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:8787/oauth/gmail/callback',
    scopes: [
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events'
    ]
};

/**
 * 应用程序配置
 */
export const APP_CONFIG = {
    port: parseInt(process.env.PORT || '8787', 10),
    environment: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
    serverName: process.env.SERVER_NAME || 'Remote MCP Server',
    serverVersion: process.env.SERVER_VERSION || '1.0.0'
};

/**
 * API路径配置
 */
export const API_PATHS = {
    mcpEndpoint: '/api/mcp',
    toolsEndpoint: '/api/tools',
    oauthGmail: '/oauth/gmail',
    oauthGmailCallback: '/oauth/gmail/callback',
    oauthCalendar: '/oauth/calendar',
    oauthCalendarCallback: '/oauth/calendar/callback'
};