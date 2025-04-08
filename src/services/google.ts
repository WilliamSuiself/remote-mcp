import { google } from 'googleapis';
import { GOOGLE_OAUTH_CONFIG } from '../config.js';

export class GoogleService {
    private oauth2Client;

    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            GOOGLE_OAUTH_CONFIG.clientId,
            GOOGLE_OAUTH_CONFIG.clientSecret,
            GOOGLE_OAUTH_CONFIG.redirectUri
        );
    }

    /**
     * 获取 OAuth2 认证 URL
     */
    getAuthUrl(): string {
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: GOOGLE_OAUTH_CONFIG.scopes
        });
    }

    /**
     * 使用授权码获取访问令牌
     */
    async getToken(code: string) {
        const { tokens } = await this.oauth2Client.getToken(code);
        this.oauth2Client.setCredentials(tokens);
        return tokens;
    }

    /**
     * 设置访问令牌
     */
    setCredentials(tokens: any) {
        this.oauth2Client.setCredentials(tokens);
    }

    /**
     * 发送 Gmail 邮件
     */
    async sendEmail(to: string, subject: string, message: string) {
        const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
        
        // 构建邮件内容
        const email = [
            'Content-Type: text/plain; charset="UTF-8"\n',
            'MIME-Version: 1.0\n',
            'Content-Transfer-Encoding: 7bit\n',
            `To: ${to}\n`,
            `Subject: ${subject}\n\n`,
            message
        ].join('');

        const encodedEmail = Buffer.from(email).toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        try {
            const res = await gmail.users.messages.send({
                userId: 'me',
                requestBody: {
                    raw: encodedEmail
                }
            });
            return res.data;
        } catch (error) {
            console.error('发送邮件失败:', error);
            throw error;
        }
    }

    /**
     * 读取最新的 Gmail 邮件
     */
    async readLatestEmails(count: number = 5) {
        const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
        
        try {
            const res = await gmail.users.messages.list({
                userId: 'me',
                maxResults: count
            });

            const messages = res.data.messages || [];
            const emails = await Promise.all(
                messages.map(async (message) => {
                    const email = await gmail.users.messages.get({
                        userId: 'me',
                        id: message.id!
                    });
                    return email.data;
                })
            );

            return emails;
        } catch (error) {
            console.error('读取邮件失败:', error);
            throw error;
        }
    }

    /**
     * 创建 Google Calendar 事件
     */
    async createCalendarEvent(summary: string, description: string | undefined, start: string, end: string) {
        const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
        
        try {
            const event = {
                summary,
                description,
                start: {
                    dateTime: new Date(start).toISOString(),
                    timeZone: 'UTC'
                },
                end: {
                    dateTime: new Date(end).toISOString(),
                    timeZone: 'UTC'
                }
            };

            const res = await calendar.events.insert({
                calendarId: 'primary',
                requestBody: event
            });

            return res.data;
        } catch (error) {
            console.error('创建日历事件失败:', error);
            throw error;
        }
    }

    /**
     * 列出未来的 Google Calendar 事件
     */
    async listCalendarEvents(days: number = 7) {
        const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
        
        try {
            const timeMin = new Date();
            const timeMax = new Date();
            timeMax.setDate(timeMax.getDate() + days);

            const res = await calendar.events.list({
                calendarId: 'primary',
                timeMin: timeMin.toISOString(),
                timeMax: timeMax.toISOString(),
                singleEvents: true,
                orderBy: 'startTime'
            });

            return res.data.items || [];
        } catch (error) {
            console.error('获取日历事件失败:', error);
            throw error;
        }
    }
}