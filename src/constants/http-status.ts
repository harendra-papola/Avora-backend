/**
 * HTTP Status Codes
 * Standard HTTP response codes for API endpoints
 */

export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const HTTP_MESSAGES = {
  // Success
  OK: "Success",
  CREATED: "Resource created successfully",
  ACCEPTED: "Request accepted",
  NO_CONTENT: "No content",

  // Client Errors
  BAD_REQUEST: "Bad request",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Resource not found",
  CONFLICT: "Resource conflict",
  UNPROCESSABLE_ENTITY: "Unprocessable entity",
  TOO_MANY_REQUESTS: "Too many requests",

  // Server Errors
  INTERNAL_SERVER_ERROR: "Internal server error",
  NOT_IMPLEMENTED: "Not implemented",
  SERVICE_UNAVAILABLE: "Service unavailable",
} as const;

export default HTTP_STATUS;
