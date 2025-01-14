import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  if (!videoId) {
    throw new ApiError(400, "video id not found");
  }
  const skip = (page - 1) * limit;
  const comment = await Comment.find({ video: videoId }).skip(skip);
  // ById({ video: videoId });

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "All comments success."));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { comment } = req.body;
  const userId = req.user?.id; // Optional: Get the authenticated user ID if available

  try {
    if (!videoId || !comment) {
      throw new ApiError(400, "no videoId and comment");
    }
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(400, "Video not found");
    }

    const newComment = await Comment.create({
      content: comment,
      owner: userId,
      video: videoId,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, newComment, "comment success"));
  } catch (error) {
    throw new ApiError(400, "comment failed", error.message);
  }
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { newComment } = req.body;

  try {
    if (!commentId || !newComment) {
      throw new ApiError(400, "no comment found");
    }
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $set: { content: newComment },
      },
      {
        new: true,
      }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, comment, "Comment updated Successfully"));
  } catch (error) {
    throw new ApiError(400, "error while updating comment", error.message);
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  try {
    if (!commentId) {
      throw new ApiError(400, "no comment found");
    }
    const comment = await Comment.findByIdAndDelete(commentId);
    return res
      .status(200)
      .json(new ApiResponse(200, comment, "comment deleted successfully"));
  } catch (error) {
    throw new ApiError(400, "error while deleting comment", error.message);
  }
});

export { getVideoComments, addComment, updateComment, deleteComment };
