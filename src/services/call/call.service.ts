// services/call/call.service.ts

import * as callRepository from "../../repositories/call/call.repository";

export const createCall = async (
  callerId: number,
  receiverId: number,
  callType: string
) => {
  return callRepository.createCall({
    callerId,
    receiverId,
    callType,
    callStatus: "COMPLETED",
    startedAt: new Date(),
  });
};

export const endCall = async (
  callId: number,
  duration: number
) => {
  return callRepository.endCall(
    callId,
    duration
  );
};

export const markMissedCall =
  async (callId: number) => {
    return callRepository.markMissedCall(
      callId
    );
  };

export const getCallHistory =
  async (userId: number) => {
    return callRepository.getCallHistory(
      userId
    );
  };

export const deleteCallHistory =
  async (callId: number) => {
    return callRepository.deleteCallHistory(
      callId
    );
  };