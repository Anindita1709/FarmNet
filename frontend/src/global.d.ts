interface Window {
  ethereum?: {
    request: (...args: any[]) => Promise<any>;
    isMetaMask?: boolean;
    on?: (...args: any[]) => void;
    removeListener?: (...args: any[]) => void;
  };
}
