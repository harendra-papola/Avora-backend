export interface UpdateProfileDto {
  bio?: string;
  backgroundImage?: string;
}

export interface UpdateProfilePictureDto {
  profilePic: string; // base64 or URL
}

export interface GetProfileDto {
  id: number;
  userName: string;
  email: string;
  phoneNumber: string | null;
  bio: string | null;
  profilePic: string | null;
  backgroundImage: string | null;
  dob: Date | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: Date;
}

export interface DeleteProfilePictureDto {
  profilePic: null;
}

export interface UserProfileUpdateResponse {
  success: boolean;
  message: string;
  data?: GetProfileDto;
}
