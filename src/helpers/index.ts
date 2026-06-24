/**
 * Helper Functions
 * Utility functions used across the application
 */

/**
 * Parse pagination query parameters
 */
export const parsePagination = (
  page?: string | number,
  limit?: string | number,
  defaultLimit: number = 10
) => {
  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || defaultLimit));
  const skip = (pageNum - 1) * limitNum;

  return {
    page: pageNum,
    limit: limitNum,
    skip,
  };
};

/**
 * Format pagination metadata
 */
export const formatPagination = (
  total: number,
  page: number,
  limit: number
) => {
  return {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};

/**
 * Sleep function for delays
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Retry function with exponential backoff
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        await sleep(delay);
      }
    }
  }

  throw lastError!;
};

export default {
  parsePagination,
  formatPagination,
  sleep,
  retry,
};
