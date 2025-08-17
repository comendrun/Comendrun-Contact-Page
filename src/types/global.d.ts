// Global type extensions for bot detection
declare global {
  interface Window {
    chrome?: unknown;
    safari?: unknown;
    phantom?: unknown;
    __phantom?: unknown;
    callPhantom?: unknown;
  }

  interface Navigator {
    webdriver?: boolean;
    brave?: unknown;
  }
}

// This export makes this file a module
export {};
