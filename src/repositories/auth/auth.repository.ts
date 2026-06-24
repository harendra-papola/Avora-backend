import prisma from "../../config/prisma";

export const findUserByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const findUserByIdentifier = (identifier: string) => {
  return prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { userName: identifier },
      ],
    },
  });
};

export const findUserById = (id: number) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export const findUserByProfileId = (profileId: number) => {
  return prisma.user.findUnique({
    where: {
      profileId,
    },
  });
};

export const createUser = (data: {
  userName: string;
  profileId: number;
  email: string;
  passwordHash: string;
  isEmailVerified: boolean;
}) => {
  return prisma.user.create({
    data: {
      userName: data.userName,
      profileId: data.profileId,
      email: data.email,
      passwordHash: data.passwordHash,
      isEmailVerified: data.isEmailVerified,
    },
    select: {
      id: true,
      profileId: true,
      userName: true,
      email: true,
      isEmailVerified: true,
    },
  });
};

export const countOtpRequests = (identifier: string, since: Date) => {
  return prisma.oTP.count({
    where: {
      identifier,
      createdAt: {
        gte: since,
      },
    },
  });
};

export const createOtpRecord = (identifier: string, otpHash: string, expiresAt: Date) => {
  return prisma.oTP.create({
    data: {
      identifier,
      otpHash,
      expiresAt,
    },
  });
};

export const deleteOtpRecord = (identifier: string, otpHash: string) => {
  return prisma.oTP.deleteMany({
    where: {
      identifier,
      otpHash,
    },
  });
};

export const findValidOtpRecord = (identifier: string) => {
  return prisma.oTP.findFirst({
    where: {
      identifier,
      expiresAt: {
        gte: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateUserSession = (userId: number, sessionId: string | null) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      sessionId,
    },
  });
};

export const generateProfileId = async () => {
  while (true) {
    const profileId = 1000000 + Math.floor(Math.random() * 9000000);
      return profileId;
  }
};

export const updateUserPassword = (email: string,newPasswordHash: string) => {
  return prisma.user.updateMany({
    where: {
     email: email,
    },
    data: { passwordHash: newPasswordHash },
  });
}

export const deleteOldOtps = () => {
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

  return prisma.oTP.deleteMany({
    where: {
      createdAt: {
        lt: twoHoursAgo,
      },
    },
  });
};