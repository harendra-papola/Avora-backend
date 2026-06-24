// services/room/room.service.ts

import {
  AccessToken,
  RoomServiceClient,
  TrackSource,
} from "livekit-server-sdk";

import { RoomType } from "../../generated/prisma/enums";
import { RoomDto } from "../../dto/room/room.dto";

import * as roomRepository from "../../repositories/room/room.repository";
import * as userProfileRepository from "../../repositories/user/user.profile.repository";

import { AppError } from "../../utils/AppError";

const roomServiceClient =
  new RoomServiceClient(
    process.env.LIVEKIT_URL!,
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!
  );

export const createToken = async (
  userId: number,
  type: number,
  coHostId?:number
) => {
  const user =
    await userProfileRepository.getUserById(
      userId
    );

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }


let roomType: RoomType;
let roomName: string;

switch (type) {
  case 1:
    roomType = RoomType.LIVE_STREAM;
    roomName =  `Avora_${roomType}_${userId}`;
    break;

  case 2:
    roomType = RoomType.AUDIO_CALL;
    roomName = `Avora_${userId}_${roomType}_Avora_${coHostId}`
    break;

  case 3:
    roomType = RoomType.VIDEO_CALL;
    roomName = `Avora_${userId}_${roomType}_Avora_${coHostId}`;
    break;

  case 4:
    roomType = RoomType.AUDIO_ROOM;
    roomName = `Avora_AudioRoom_${userId}`;
    break;

  default:
    throw new AppError("Invalid room type", 400);
}
  
  const accessToken =
    new AccessToken(
      process.env.LIVEKIT_API_KEY!,
      process.env.LIVEKIT_API_SECRET!,
      {
        identity: user.userName,
      }
    );

  accessToken.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  });

  const token = await accessToken.toJwt();

  const roomData: RoomDto = {
    hostId: userId,
    roomName,
    type: roomType,
  };
  await roomServiceClient.createRoom({ name: roomName});
  const room = await createVideoRoom(roomData);

  return {
    token,
    room,
  };
};

export const joinRoom = async (
  userId: number,
  roomName: string,
  type: "viewer" | "audio" | "video" = "viewer"
) => {
  const user = await userProfileRepository.getUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const room = await roomRepository.getRoomByName(roomName);

  if (!room) {
    throw new AppError("Room not found", 404);
  }

  const accessToken = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
    {
      identity: user.userName,
    }
  );

  const grant: any = {
    roomJoin: true,
    room: room.roomName,
    canSubscribe: true,
    canPublish: false,
    canPublishData: true,
  };


switch (type) {
  case "viewer":
    grant.canPublish = false;
    break;

  case "audio":
    grant.canPublish = true;
    grant.canPublishSources = [TrackSource.MICROPHONE];
    break;

  case "video":
    grant.canPublish = true;
    break;
}

  accessToken.addGrant(grant);

  const token = await accessToken.toJwt();

  return {
    room,
    token,
    type,
  };
};

export const createVideoRoom = async (
  data: RoomDto
) => {
  const existingRoom =
    await roomRepository.getRoomByName(
      data.roomName
    );

  if (existingRoom) {
    return existingRoom;
  }

  return roomRepository.setRoomDetail(
    data
  );
};

export const getLiveRooms =
  async () => {
    return roomRepository.getLiveRooms();
  };

export const deleteRoom = async (
  userId: number,
  roomName: string
) => {
  const user =
    await userProfileRepository.getUserById(
      userId
    );

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  const room =await roomRepository.getRoomByName(roomName);

  if (!room) {
    throw new AppError(
      "Room not found",
      404
    );
  }

  if (room.hostId !== userId) {
    throw new AppError(
      "Only host can delete room",
      403
    );
  }
  try {
    const response = await roomServiceClient.deleteRoom( roomName );
  } catch (error) {
    console.error(error)
  }

  await roomRepository.deleteRoom(roomName);

  return true;
};