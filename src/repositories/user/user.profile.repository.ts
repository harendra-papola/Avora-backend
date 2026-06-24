import prisma from "../../config/prisma";
import { UpdateProfileDto, UpdateProfilePictureDto } from "../../dto/user/user.dto";

export const getUserById = async (userId: number) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      userName: true,
      email: true,
      phoneNumber: true,
      bio: true,
      profilePic: true,
      backgroundImage: true,
      dob: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      createdAt: true,
    },
  });
};

export const updateUserProfile = async (
  userId: number,
  data: UpdateProfileDto
) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      bio: data.bio,
      backgroundImage: data.backgroundImage,
      updatedAt: new Date(),
    },
    select: {
      id: true,
      userName: true,
      email: true,
      phoneNumber: true,
      bio: true,
      profilePic: true,
      backgroundImage: true,
      dob: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      createdAt: true,
    },
  });
};

export const updateProfilePicture = async (
  userId: number,
  data: UpdateProfilePictureDto
) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      profilePic: data.profilePic,
      updatedAt: new Date(),
    },
    select: {
      id: true,
      userName: true,
      email: true,
      phoneNumber: true,
      bio: true,
      profilePic: true,
      backgroundImage: true,
      dob: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      createdAt: true,
    },
  });
};

export const deleteProfilePicture = async (userId: number) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      profilePic: null,
      updatedAt: new Date(),
    },
    select: {
      id: true,
      userName: true,
      email: true,
      phoneNumber: true,
      bio: true,
      profilePic: true,
      backgroundImage: true,
      dob: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      createdAt: true,
    },
  });
};

export const getUsersBySearch = async (searchQuery: string) => {
  return prisma.user.findMany({
    where: {
      OR: [
        { userName: { contains: searchQuery, mode: "insensitive" } },
        { email: { contains: searchQuery, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      userName: true,
      email: true,
      profilePic: true,
      bio: true,
    },
    take: 10,
  });
};
