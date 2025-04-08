declare global {
  type Env = {
    [key: string]: unknown;
    OAUTH_PROVIDER: OAuthHelpers;
    MCP_OBJECT: DurableObjectNamespace<any>;
    ASSETS: {
      fetch: (url: string) => Promise<Response>;
    };
  };

  interface DurableObjectState {
    blockConcurrencyWhile(closure: () => Promise<void>): Promise<void>;
    storage: DurableObjectStorage;
    id: DurableObjectId;
  }

  interface DurableObjectStorage {
    get<T = unknown>(key: string): Promise<T | undefined>;
    get<T = unknown>(keys: string[]): Promise<Map<string, T>>;
    list<T = unknown>(options?: { prefix?: string; reverse?: boolean; limit?: number }): Promise<Map<string, T>>;
    put<T>(key: string, value: T): Promise<void>;
    put<T>(entries: Map<string, T> | Record<string, T>): Promise<void>;
    delete(key: string): Promise<boolean>;
    delete(keys: string[]): Promise<number>;
    deleteAll(): Promise<void>;
    transaction<T>(callback: (txn: DurableObjectTransaction) => Promise<T>): Promise<T>;
  }

  interface DurableObjectTransaction {
    get<T = unknown>(key: string): Promise<T | undefined>;
    get<T = unknown>(keys: string[]): Promise<Map<string, T>>;
    list<T = unknown>(options?: { prefix?: string; reverse?: boolean; limit?: number }): Promise<Map<string, T>>;
    put<T>(key: string, value: T): Promise<void>;
    put<T>(entries: Map<string, T> | Record<string, T>): Promise<void>;
    delete(key: string): Promise<boolean>;
    delete(keys: string[]): Promise<number>;
    rollback(): void;
  }

  interface DurableObjectId {
    toString(): string;
    equals(other: DurableObjectId): boolean;
  }

  interface DurableObjectNamespace<T> {
    newUniqueId(options?: { jurisdiction?: string }): DurableObjectId;
    idFromName(name: string): DurableObjectId;
    idFromString(id: string): DurableObjectId;
    get(id: DurableObjectId): T;
  }
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