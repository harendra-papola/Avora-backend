# Avora Backend

This README explains the overall architecture and request flow of the Avora backend application.

## Overview

The backend is built with TypeScript, Express, Prisma, and Socket.IO. It supports:
- authentication and user session management
- user profile management
- conversations and messaging
- live streaming / room management
- call history and call lifecycle operations
- posts, likes, and comments
- real-time events via WebSocket

## Entry Points

### `src/server.ts`

This is the startup file:
- validates environment variables via `src/config/env.ts`
- connects to the database via `src/config/database.ts`
- starts scheduled cleanup tasks such as OTP cleanup
- creates an HTTPS server using local certificate files from `certs/`
- initializes Socket.IO via `src/Socket.ts`
- listens on the configured `PORT`

### `src/app.ts`

This file configures Express:
- enables CORS for the frontend origin `process.env.CLIENT_URL`
- enables JSON body parsing
- mounts API routes under `/api`
- registers global error handling via `src/middlewares/error/error.middleware.ts`

## Environment Configuration

The application relies on required environment variables:
- `DATABASE_URL`
- `JWT_SECRET`

Optional values are defaulted if missing, including `PORT`, `CLIENT_URL`, `JWT_EXPIRE_IN`, and OTP expiry.

## HTTP Routing Flow

### `src/routes/user.routes.ts`

All HTTP routes are mounted under `/api` and split into:
- public routes: registration, OTP, login, forgot-password, reset-password
- protected routes: all routes after `router.use(authenticate)` require a valid JWT

Protected route categories include:
- logout
- profile management
- conversations and messages
- live streaming / room creation and join
- call creation, end, missed, history, deletion
- post creation, retrieval, like/unlike, comments

### Authentication Middleware

`src/middlewares/auth/auth.middleware.ts` performs:
- JWT extraction from the `Authorization: Bearer <token>` header
- verification using `src/utils/jwt.ts`
- user lookup via `src/repositories/auth/auth.repository.ts`
- session validation by comparing `user.sessionId` with the token payload
- attaching `req.user` on success

## Socket Server Flow

### `src/Socket.ts`

Socket.IO is initialized on the same HTTPS server:
- uses CORS allowing the configured client origin
- authenticates each socket connection using `src/middlewares/auth/socket.middleware.ts`
- registers connection handling through `src/Socket/handlers.ts`

### `src/middlewares/auth/socket.middleware.ts`

Socket authentication flow:
- reads `socket.handshake.auth.token`
- verifies JWT
- loads user from the database
- validates the session ID against the stored user session
- stores user metadata on `socket.data`

### `src/Socket/handlers.ts`

The socket handler manages real-time actions such as:
- tracking online users and conversation rooms
- joining conversation channels
- sending, editing, deleting messages
- updating message delivery status
- broadcasting events to conversation participants

## Controller and Service Layers

The pattern in the project is:
- controllers handle Express request/response and pass data to services
- services contain business logic and interact with repositories
- repositories access Prisma models and the database

Example flows:
- `src/controllers/auth/auth.contoller.ts` calls `src/services/auth/auth.service.ts`
- `src/routes/user.routes.ts` maps HTTP endpoints to controllers
- socket handlers call services like `src/services/conversation/message.service.ts`

## Database and Prisma

The app uses Prisma for database access.
- `src/config/prisma.ts` provides the client instance
- database schema and migrations live under `prisma/`
- models are generated in `src/generated/prisma/`

## Error Handling

The app uses a centralized error handler registered in `src/app.ts`.
- JSON parsing errors are logged and forwarded
- controllers use `next(error)` to propagate exceptions
- errors are normalized by the middleware before being returned to clients

## Request Flow Summary

1. Client starts by calling an HTTP public route for authentication.
2. If login succeeds, the backend returns a JWT with session details.
3. For protected HTTP routes, the token is validated and the user is attached to `req`.
4. Real-time socket clients connect with the same JWT and are authenticated before joining rooms.
5. Socket events update message state and broadcast to other participants in conversation rooms.
6. Prisma persists user, conversation, message, post, room, and call state to the database.

## Key Files

- `src/server.ts` — application startup and HTTPS server initialization
- `src/app.ts` — Express middleware and route setup
- `src/routes/user.routes.ts` — API route definitions
- `src/middlewares/auth/auth.middleware.ts` — JWT auth for HTTP routes
- `src/middlewares/auth/socket.middleware.ts` — JWT auth for sockets
- `src/Socket.ts` — Socket.IO initialization
- `src/Socket/handlers.ts` — real-time event handling
- `src/utils/jwt.ts` — token generation and verification
- `src/services/` — business logic
- `src/repositories/` — database access

## Running the Application

Use the configured npm scripts:
- `npm run dev` — start in development mode
- `npm run build` — compile TypeScript
- `npm start` — run production build

---

This README describes the backend application flow from startup through authenticated API requests and real-time socket communication.