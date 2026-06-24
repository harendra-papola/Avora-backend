import { RoomType } from "../../generated/prisma/enums";

export interface RoomDto {
  hostId: number;
  roomName: string;
  type: RoomType;
}