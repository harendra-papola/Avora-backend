import prisma from "../../config/prisma";

export const createPost = async (userId: number, imageUrl: string, caption?: string) => {
  return prisma.post.create({
    data: {
      userId,
      imageUrl,
      caption,
    },
  });
};

export const getPosts = async (
  userId: number
) => {
  const posts = await prisma.post.findMany({
    include: {
      user: {
        select: {
          userName: true,
          profilePic: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      likes: {
        where: {
          userId,
        },
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return posts.map((post) => ({
    id: post.id,
    caption: post.caption,
    imageUrl: post.imageUrl,
    likesCount: post._count.likes,
    commentsCount: post._count.comments,
    isLikedByMe: post.likes.length > 0,
    createdAt: post.createdAt,
    user: post.user,
  }));
};

export const getPostsById = async (
  profileUserId: number,
  loggedInUserId: number
) => {
  const posts = await prisma.post.findMany({
    where: {
      userId: profileUserId,
    },
    include: {
      user: {
        select: {
          userName: true,
          profilePic: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      likes: {
        where: {
          userId: loggedInUserId,
        },
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return posts.map(({ likes, _count, ...post }) => ({
    ...post,
    likesCount: _count.likes,
    commentsCount: _count.comments,
    isLikedByMe: likes.length > 0,
  }));
};

export const getPostById = async(postId: number) =>{
    return prisma.post.findUnique({
        where:{
            id:postId
        }
    })
}

export const deletePost = async (postId: number) => {
  return prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

export const getPostLike = async (postId: number, userId: number) => {
  return prisma.postLike.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });
};

export const likePost = async (postId: number, userId: number) => {
  return prisma.postLike.create({
    data: {
      postId,
      userId,
    },
  });
};

export const unlikePost = async (postId: number, userId: number) => {
  return prisma.postLike.delete({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });
};

export const addComment = async (postId: number, userId: number, comment: string) => {
  return prisma.postComment.create({
    data: {
      postId,
      userId,
      comment,
    },
    include: {
      user: {
        select: {
          id: true,
          userName: true,
          profilePic: true,
        },
      },
    },
  });
};

export const getComments = async (postId: number) => {
  return prisma.postComment.findMany({
    where: {
      postId,
    },
    include: {
      user: {
        select: {
          id: true,
          userName: true,
          profilePic: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getCommentById = async (commentId: number) => {
  return prisma.postComment.findUnique({
    where: {
      id: commentId,
    },
  });
};

export const deleteComment = async (commentId: number) => {
  return prisma.postComment.delete({
    where: {
      id: commentId,
    },
  });
};
