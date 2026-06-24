// User Events
export const USER_EVENTS = {
  REGISTER: "user:register",
  ONLINE: "user:online",
  OFFLINE: "user:offline",
  TYPING: "user:typing",
  STOP_TYPING: "user:stop-typing",
  GET_ONLINE_USERS: "user:get_online_users",
  ONLINE_USERS: "user:online_users",
};

// Message Events
export const MESSAGE_EVENTS = {
  SEND: "message:send",
  RECEIVE: "message:receive",
  EDIT: "message:edit",
  DELETE: "message:delete",
  STATUS_UPDATE: "message:status-update",
  LOAD_MESSAGES: "message:load",
  MESSAGES_LOADED: "message:loaded",
};

// Conversation Events
export const CONVERSATION_EVENTS = {
  CREATE: "conversation:create",
  LIST: "conversation:list",
  UPDATE: "conversation:update",
  DELETE: "conversation:delete",
  PARTICIPANT_ADDED: "conversation:participant-added",
  PARTICIPANT_REMOVED: "conversation:participant-removed",
};

// Error Events
export const ERROR_EVENTS = {
  ERROR: "error",
  AUTH_ERROR: "auth:error",
  MESSAGE_ERROR: "message:error",
};

// Acknowledgment Events
export const ACK_EVENTS = {
  ACK: "ack",
  NACK: "nack",
};

// Live chat Events
export const LIVE_CHAT_EVENTS = {
  JOIN: "live-chat:join",
  LEAVE: "live-chat:leave",
  SEND: "live-chat:send",
  RECEIVE: "live-chat:receive",
};

export const CALL_EVENTS = {
  REQUEST: "call:request",
  ACCEPT: "call:accept",
  REJECT: "call:reject",
  END: "call:end",
};
