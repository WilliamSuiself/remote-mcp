declare global {
  type Env = {
    [key: string]: unknown;
    OAUTH_PROVIDER: OAuthHelpers;
    ASSETS: {
      fetch: (url: string) => Promise<Response>;
    };
  };
}

// 为缺失的模块添加类型声明
declare module '@cloudflare/workers-oauth-provider' {
  export interface AuthRequest {
    scope: string[];
    [key: string]: any;
  }

  export interface OAuthHelpers {
    parseAuthRequest(request: Request): Promise<AuthRequest>;
    completeAuthorization(options: {
      request: AuthRequest;
      userId: string;
      metadata: Record<string, string>;
      scope: string[];
      props: Record<string, string>;
    }): Promise<{ redirectTo: string }>;
  }
}

// 修复 cloudflare:workers 导入问题
declare module 'cloudflare:workers' {
  export const env: {
    ASSETS: {
      fetch: (url: string) => Promise<Response>;
    };
  };
}

export {};