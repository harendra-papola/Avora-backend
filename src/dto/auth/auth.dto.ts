export interface RegisterUserDto {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

export interface LoginDto {
  identifier: string; // email or username
  password: string;
}

export interface ResetPasswordDto {
  identifier: string; // email or username
  otp: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface OtpDto {
  email: string;//later can be username or email, but for now we are using email
  type:string; //"password_reset" | "registration"; // can be extended for other types of OTPs in the future
}
export interface verifyOtpDto {
  email: string;
  otp: string;
}

export interface otpEmailDto {
  email: string;
  otp: string;
  type: string; //"password_reset" | "registration";
}

export interface JwtPayloadDto{
    userId: number;
    profileId: string;
    sessionId: string;
}

// 
export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
    };
}