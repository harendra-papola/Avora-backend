import * as postRepository from "../../repositories/post/post.repository";
import { AppError } from "../../utils/AppError";

export const createPost = async (
  userId: number,
  imageUrl: string,
  caption?: string
) => {
  return postRepository.createPost(
    userId,
    imageUrl,
    caption
  );
};

export const getPosts = async (userId: number) => {
  return postRepository.getPosts(userId);
};

export const getPostsById = async ( profileUserId: number, loggedInUserId: number) => {

  const post = postRepository.getPostsById(
    profileUserId,
    loggedInUserId
  );
  

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  return post;
};

export const deletePost = async (
  postId: number,
  userId: number
) => {
  const post = await postRepository.getPostById(
    postId
  );

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  if (post.userId !== userId) {
    throw new AppError(
      "You can only delete your own post",
      403
    );
  }

  return postRepository.deletePost(postId);
};

export const likePost = async (
  postId: number,
  userId: number
) => {
  const alreadyLiked =
    await postRepository.getPostLike(
      postId,
      userId
    );

  if (alreadyLiked) {
    throw new AppError(
      "Post already liked",
      400
    );
  }

  return postRepository.likePost(
    postId,
    userId
  );
};

export const unlikePost = async (
  postId: number,
  userId: number
) => {
  const like = await postRepository.getPostLike(
    postId,
    userId
  );

  if (!like) {
    throw new AppError(
      "Like not found",
      404
    );
  }

  return postRepository.unlikePost(
    postId,
    userId
  );
};

export const addComment = async (
  postId: number,
  userId: number,
  comment: string
) => {
  return postRepository.addComment(
    postId,
    userId,
    comment
  );
};

export const getComments = async (
  postId: number
) => {
  return postRepository.getComments(postId);
};

export const deleteComment = async (
  commentId: number,
  userId: number
) => {
  const comment =
    await postRepository.getCommentById(
      commentId
    );

  if (!comment) {
    throw new AppError(
      "Comment not found",
      404
    );
  }

  const post =
    await postRepository.getPostById(
      comment.postId
    );

  if (!post) {
    throw new AppError(
      "Post not found",
      404
    );
  }

  const isCommentOwner =
    comment.userId === userId;

  const isPostOwner =
    post.userId === userId;

  if (!isCommentOwner && !isPostOwner) {
    throw new AppError(
      "You are not allowed to delete this comment",
      403
    );
  }

  return postRepository.deleteComment(
    commentId
  );
};