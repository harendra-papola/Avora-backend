export const logger = {
  info: (message: string) => {
    console.log(`${message}`);
  },

  success: (message: string) => {
    console.log(`${message}`);
  },

  error: (message: string, error?: unknown) => {
    console.error(`${message}`, error);
  },

  warn: (message: string) => {
    console.warn(`${message}`);
  },
};