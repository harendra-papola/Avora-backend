/**
 * Response Handler Utility
 * Standardized response formatting for all API endpoints
 */

import { Response } from "express";
import { HTTP_STATUS, HTTP_MESSAGES } from "../constants/http-status";
import { ApiResponse, PaginatedResponse } from "../interfaces";

/**
 * Send success response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = HTTP_MESSAGES.OK,
  statusCode: number = HTTP_STATUS.OK
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  } as ApiResponse<T>);
};

/**
 * Send error response
 */
export const sendError = (
  res: Response,
  message: string = HTTP_MESSAGES.INTERNAL_SERVER_ERROR,
  error?: unknown,
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
): Response => {
  const errorDetail =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Unknown error";

  return res.status(statusCode).json({
    success: false,
    message,
    error: errorDetail,
  });
};

/* Send paginated response  */

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
  },
  message: string = HTTP_MESSAGES.OK,
  statusCode: number = HTTP_STATUS.OK
): Response => {
  const pages = Math.ceil(pagination.total / pagination.limit);

  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      pages,
    },
  } as PaginatedResponse<T>);
};

/**
 * Send created response
 */
export const sendCreated = <T>(
  res: Response,
  data: T,
  message: string = HTTP_MESSAGES.CREATED
): Response => {
  return sendSuccess(res, data, message, HTTP_STATUS.CREATED);
};

/**
 * Send no content response
 */
export const sendNoContent = (res: Response): Response => {
  return res.status(HTTP_STATUS.NO_CONTENT).send();
};

export default {
  sendSuccess,
  sendError,
  sendPaginated,
  sendCreated,
  sendNoContent,
};
