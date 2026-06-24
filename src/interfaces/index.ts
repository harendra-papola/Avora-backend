// Global Interfaces

export interface PaginationQuery {
  page?: number;
  limit?: number;
  skip?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | Record<string, unknown>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface JwtPayload {
  userId: number;
  profileId: string;
  sessionId: string;
  iat?: number;
  exp?: number;
}

export interface UserContext {
  userId: number;
  profileId: string;
  sessionId: string;
}
