declare module "#auth-utils" {
  // General session information
  interface UserSession {
    id: number;
    provider?: string;
  }

  // User information
  interface User {
    name: string;
    email: string;
  }

  // Secure session data
  // This data is only available on the server
  interface SecureSessionData {
    providerTokens?: any;
    providerData?: any;
  }
}

export {};
