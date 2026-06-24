import * as userProfileRepository from "../../repositories/user/user.profile.repository";
import { UpdateProfileDto, UpdateProfilePictureDto } from "../../dto/user/user.dto";

export const getUserProfile = async (userId: number) => {
  const user = await userProfileRepository.getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const updateUserProfile = async (
  userId: number,
  data: UpdateProfileDto
) => {
  const updatedUser = await userProfileRepository.updateUserProfile(userId, data);
  return updatedUser;
};

export const addProfilePicture = async (
  userId: number,
  profilePic: string
) => {
  const data: UpdateProfilePictureDto = { profilePic };
  const updatedUser = await userProfileRepository.updateProfilePicture(userId, data);
  return updatedUser;
};

export const deleteProfilePicture = async (userId: number) => {
  const updatedUser = await userProfileRepository.deleteProfilePicture(userId);
  return updatedUser;
};

export const searchUsers = async (searchQuery: string) => {
  if (!searchQuery || searchQuery.trim().length === 0) {
    throw new Error("Search query cannot be empty");
  }

  if (searchQuery.length < 2) {
    throw new Error("Search query must be at least 2 characters");
  }

  return userProfileRepository.getUsersBySearch(searchQuery);
};
