declare global {
  interface Window {
    ym: (id: string, action: string, options?: any) => void;
  }
}

export {};
