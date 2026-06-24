import prisma from "../../config/prisma";

export const getUsers = async (userId: number) => {
    return prisma.user.findMany({
        where:{ id:{ not:userId  } },
        select: {
            id: true,
            userName: true,
            profilePic:true,
            email: true,
            createdAt: true,
        },
    });
};