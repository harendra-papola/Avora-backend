import { Request, Response, NextFunction } from "express";
import * as postService from "../../services/post/post.service"


export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { imageUrl, caption } = req.body;

    const post = await postService.createPost(
      userId,
      imageUrl,
      caption
    );

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
      const userId = req.user!.userId;
    const posts = await postService.getPosts(userId);

    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostsById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUserId = req.user!.userId;
    const profileUserId = Number( req.query.userId );

    const posts = await postService.getPostsById( profileUserId, loggedInUserId );

    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const postId = Number(req.params.postId);

    await postService.deletePost(
      postId,
      userId
    );

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const postId = Number(req.params.postId);

    const like = await postService.likePost(
      postId,
      userId
    );

    return res.status(200).json({
      success: true,
      message: "Post liked successfully",
      data: like,
    });
  } catch (error) {
    next(error);
  }
};

export const unlikePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const postId = Number(req.params.postId);

    await postService.unlikePost(
      postId,
      userId
    );

    return res.status(200).json({
      success: true,
      message: "Post unliked successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const postId = Number(req.params.postId);

    const { comment } = req.body;

    const response =
      await postService.addComment(
        postId,
        userId,
        comment
      );

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = Number(req.params.postId);

    const comments =
      await postService.getComments(postId);

    return res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const commentId = Number(
      req.params.commentId
    );

    await postService.deleteComment(
      commentId,
      userId
    );

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};