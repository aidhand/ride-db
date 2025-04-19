declare module "#auth-utils" {
  // General session information
  interface UserSession {
    id: number;
    provider?: string;
  }

  // User information
  interface User {
    slug: string;
    name: string;
    email: string;
  }

  // Secure session data
  // This data is only available on the server
  interface SecureSessionData {
    token: string;
    providerData?: Record<string, unknown>;
  }
}

export {};
