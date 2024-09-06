declare global {
    namespace NodeJS {
      interface ProcessEnv {
        [key: string]: string | undefined;
        GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;
        NEXTAUTH_URL:string;
        NEXTAUTH_SECRET:string

      }
    }
  }
  export type {};