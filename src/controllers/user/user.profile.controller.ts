import { Request, Response, NextFunction } from "express";
import * as userProfileService from "../../services/user/user.profile.service";
import { UpdateProfileDto, UpdateProfilePictureDto } from "../../dto/user/user.dto";

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const profile = await userProfileService.getUserProfile(userId);
    
    res.json({
      success: true,
      message: "Profile retrieved successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const data: UpdateProfileDto = req.body;

    // Validate input
    if (!data.bio && !data.backgroundImage) {
      return res.status(400).json({
        success: false,
        message: "At least one field (bio or backgroundImage) is required",
      });
    }

    const updatedProfile = await userProfileService.updateUserProfile(userId, data);

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const addProfilePicture = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { profilePic } = req.body as UpdateProfilePictureDto;

    if (!profilePic) {
      return res.status(400).json({
        success: false,
        message: "Profile picture is required",
      });
    }

    const updatedProfile = await userProfileService.addProfilePicture(userId, profilePic);

    res.json({
      success: true,
      message: "Profile picture added successfully",
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProfilePicture = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;

    const updatedProfile = await userProfileService.deleteProfilePicture(userId);

    res.json({
      success: true,
      message: "Profile picture deleted successfully",
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const searchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { query } = req.query as { query: string };

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const results = await userProfileService.searchUsers(query);

    res.json({
      success: true,
      message: "Users found",
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

