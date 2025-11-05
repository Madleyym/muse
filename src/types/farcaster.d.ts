declare global {
  interface Window {
    farcasterSdk?: {
      actions: {
        ready: () => void;
        openUrl: (url: string) => void;
        close: () => void;
      };
      context?: {
        user: {
          fid: number;
          username: string;
        };
      };
    };
  }
}

export {};
