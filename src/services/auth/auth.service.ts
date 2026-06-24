import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import crypto from "crypto";
import cron from "node-cron";
import * as authRepository from "../../repositories/auth/auth.repository";
import { LoginDto, OtpDto, otpEmailDto, RegisterUserDto,ResetPasswordDto,verifyOtpDto} from "../../dto/auth/auth.dto";
import { BadRequestError, ConflictError, UnauthorizedError } from "../../utils/error";
import { generateToken } from "../../utils/jwt";
import { formatResponse } from "../../utils/Response";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

export const sendOtpEmail = async (
  data: otpEmailDto
): Promise<void> => {
  const { email, otp, type } = data;

  const isPasswordReset = type === "password_reset";

  await transporter.sendMail({
    from: `"Auth Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: isPasswordReset
      ? "Password Reset OTP"
      : "Email Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>
          ${
            isPasswordReset
              ? "Password Reset Request"
              : "Email Verification"
          }
        </h2>

        <p>
          ${
            isPasswordReset
              ? "Use the OTP below to reset your password:"
              : "Use the OTP below to verify your email:"
          }
        </p>

        <h1 style="letter-spacing: 4px;">
          ${otp}
        </h1>

        <p>This OTP will expire in 10 minutes.</p>

        <p>
          ${
            isPasswordReset
              ? "If you did not request a password reset, please ignore this email."
              : "If you did not create an account, please ignore this email."
          }
        </p>
      </div>
    `,
  });
};

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const registerUser = async (data: RegisterUserDto) => {
  const { userName, email, password, confirmPassword, otp } = data;
  const existingUser = await authRepository.findUserByEmail(email);

  if (existingUser) {
    throw new ConflictError("User with this email already exists");
  }

  if (password !== confirmPassword) {
    throw new BadRequestError("Passwords do not match");
  }

  const profileId = await authRepository.generateProfileId();
  const passwordHash = await bcrypt.hash(password, 10);

  const isValidOtp = await verifyOtp({ email, otp });

  if (!isValidOtp) {
    throw new BadRequestError("Invalid OTP");
  }

  const user = await authRepository.createUser({
    userName,
    profileId,
    email,
    passwordHash,
    isEmailVerified: true,
  });

  return  formatResponse({message:"User registered successfully", data:{user}} );
};

export const generateAndSendOtp = async (data: OtpDto) => {
  const { email, type } = data;
  const existingUser = await authRepository.findUserByEmail(email);

  if (existingUser && type === "registration") {
    throw new ConflictError("User with this email already exists");
  }

   if (!existingUser && type === "password_reset") {
    throw new ConflictError("User with this email does not exist");
  }
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const otpCount = await authRepository.countOtpRequests(email, twoHoursAgo);

  if (otpCount >= 3) {
    throw new BadRequestError("OTP request limit exceeded. Please try again later.");
  }

  const otp = generateOtp();

  const otpHash = await bcrypt.hash(otp, 10);


  try {
    if(type === "password_reset"){
      await sendOtpEmail({ email, otp ,type:"password_reset" });
    }else if(type === "registration"){
      await sendOtpEmail({ email, otp ,type:"registration" });
    }
   await authRepository.createOtpRecord(email, otpHash, new Date(Date.now() + 10 * 60 * 1000)); 
  } catch (error) {
    throw new BadRequestError("Failed to send OTP email");
  }

  return formatResponse({ message: "OTP sent successfully", data:{otp}});
};

export const verifyOtp = async (data: verifyOtpDto) => {
  const { email, otp } = data;
  const otpRecord = await authRepository.findValidOtpRecord(email);

  if (!otpRecord) {
    throw new BadRequestError("OTP expired or not found");
  }

  const isValid = await bcrypt.compare(otp, otpRecord.otpHash);

  if (!isValid) {
    throw new BadRequestError("Invalid OTP");
  }else{  
      await authRepository.deleteOtpRecord(email, otpRecord.otpHash);
    }

  return formatResponse({ message: "OTP verified successfully"});
};

export const login = async (data: LoginDto) => {
  const { identifier, password } = data;

  if (!identifier?.trim()) {
    throw new BadRequestError("Email or username is required");
  }

  if (!password?.trim()) {
    throw new BadRequestError("Password is required");
  }

  const user = await authRepository.findUserByIdentifier(identifier);

  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const sessionId = crypto.randomUUID();
  await authRepository.updateUserSession(user.id, sessionId);

  const accessToken = generateToken({
    userId: user.id,
    profileId: user.profileId.toString(),
    sessionId,
  });

  return formatResponse({ message: "Login Successful", 
        data: {
            user: {
                id: user.id,
                profileId: user.profileId,
                userName: user.userName,
                email: user.email,
            },
            accessToken
        }
    });
};

export const logout = async (userId: number) => {
  await authRepository.updateUserSession(userId, null);
  return formatResponse({ message: "Logged out successfully" });
};

export const forgotPassword = async (data: OtpDto) => {
  const { email } = data;
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw new BadRequestError("User with this email does not exist");
  }
  await generateAndSendOtp({ email ,type:"password_reset"});
}

export const resetPassword= async(data:ResetPasswordDto)=>{
  const {identifier,otp, newPassword, confirmNewPassword } = data;
  await verifyOtp({ email: identifier, otp });

  if (newPassword !== confirmNewPassword) {
    throw new BadRequestError("Passwords do not match");
  }
   
  const user =
    await authRepository.findUserByEmail(
      identifier
    );

  if (!user) {
    throw new BadRequestError(
      "User not found"
    );
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  await authRepository.updateUserPassword(identifier, newPasswordHash);

    // Invalidate all existing sessions
  await authRepository.updateUserSession(
    user.id,
    null
  );
  
return formatResponse({ message: "Password reset successfully" });

}

export const otpCleanup = () => {
  // Run every hour
  cron.schedule("0 * * * *", async () => {
    try {
      const result = await authRepository.deleteOldOtps();

      console.log(
        `Deleted ${result.count} OTP records older than 2 hours`
      );
    } catch (error) {
      console.error("OTP cleanup failed:", error);
    }
  });
};

