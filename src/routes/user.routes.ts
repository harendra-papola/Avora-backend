import { Router } from "express";
import { getUsers } from "../controllers/user/user.controller";
import {
  getProfile,
  updateProfile,
  addProfilePicture,
  deleteProfilePicture,
  searchUsers,
} from "../controllers/user/user.profile.controller";
import {
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  updateMessageStatus,
} from "../controllers/conversation/message.controller";
import {
  createConversation,
  getUserConversations,
  getConversation,
} from "../controllers/conversation/conversation.controller";
import {
  register,
  sendOtp,
  loginUser,
  logoutUser,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/auth/auth.controller";
import { authenticate } from "../middlewares/auth/auth.middleware";
import {
  createToken,
  joinRoom,
  getLiveRooms,
  deleteRoom,
} from "../controllers/room/room.controller";
import {
  createCall,
  deleteCallHistory,
  endCall,
  markMissedCall,
} from "../controllers/call/call.controller";
import { getCallHistory } from "../services/call/call.service";
import { addComment, createPost, deleteComment,  getComments,deletePost, getPostsById, getPosts, likePost, unlikePost } from "../controllers/post/post.controller";

const router = Router();

// PUBLIC ROUTES
router.post("/register", register);
router.post("/send-otp", sendOtp);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPasswordController);
router.post("/resetPassword", resetPasswordController);

// ==================== PROTECTED ROUTES ====================
router.use(authenticate);

// Logout
router.post("/logout", logoutUser);

// ==================== PROFILE ROUTES ====================
router.get("/get-users", getUsers);
router.get("/profile", getProfile);
router.put("/update-profile", updateProfile);
router.post("/profile/add-profile-picture", addProfilePicture);
router.delete("/profile/delete-profile-picture", deleteProfilePicture);
router.get("/search", searchUsers);

// ==================== CONVERSATION ROUTES ====================
router.get("/conversations", getUserConversations);
router.post("/conversations", createConversation);
router.get("/conversations/:conversationId", getConversation);

// ==================== MESSAGE ROUTES ====================
router.get("/conversations/:conversationId/messages", getMessages);
router.post("/conversations/:conversationId/messages", sendMessage);
router.put("/messages/:messageId", editMessage);
router.delete("/messages/:messageId", deleteMessage);
router.patch("/messages/:messageId/status", updateMessageStatus);

//  Streaming Routes
router.post("/create-room", createToken);
router.post("/join-room", joinRoom);
router.get("/get-live-rooms", getLiveRooms);
router.post("/delete-room", deleteRoom);
// call routes
// routes/call.routes.ts

router.post("/create-call", createCall);
router.patch("/:callId/end", endCall);
router.patch("/:callId/missed", markMissedCall);
router.get("/history", getCallHistory);
router.delete("/:callId", deleteCallHistory);

//post routes
router.post("/posts", createPost);
router.get("/get-posts", getPosts);
router.get("/get-posts-by-Id", getPostsById);
router.delete("/posts/:postId", deletePost);
router.post("/posts/:postId/like", likePost);
router.delete("/posts/:postId/like", unlikePost);
router.post("/posts/:postId/comment", addComment);
router.get("/posts/:postId/comments", getComments);
router.delete("/comments/:commentId", deleteComment);

export default router;
