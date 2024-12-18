import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getVidById, uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const videoPath = req.files?.videoFile[0]?.path;
  if (!videoPath) {
    throw new ApiError(400, "Video file is required");
  }
  const thumbnailPath = req.files?.thumbnail[0]?.path;
  if (!thumbnailPath) {
    throw new ApiError(400, "thumbnail file is required");
  }
  const video = await uploadOnCloudinary(videoPath);
  const thumbnail = await uploadOnCloudinary(thumbnailPath);
  const videoFile = await Video.create({
    title,
    description,
    videoFile: video.url,
    thumbnail: thumbnail.url,
    duration: video.duration,
    // publicId: video.public_id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, videoFile, "Video uploaded success."));

  // TODO: get video, upload to cloudinary, create video
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "VIdeo ID invalid");
  }

  const video = await getVidById(videoId);
  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  return res.status(200).json(new ApiResponse(200, video, "success"));
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const thumbnailLocalPath = req.file?.path;
  const { title, description } = req.body;
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "thumbnail missing");
  }
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!thumbnail.url) {
    throw new ApiError(400, "Error while uploading on thumnbail");
  }
  // const updateVideoDetails = async (
  //   videoId,
  //   title,
  //   thumbnailUrl,
  //   description
  // ) => {

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId, // Match by publicId
    {
      $set: {
        title: title,
        description: description,
        thumbnailUrl: thumbnail.url, // Optional if thumbnail is updated
      },
    },
    { new: true } // Return the updated document
  );
  console.log("Updated video in MongoDB:", updatedVideo);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Update success"));
  // };

  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const deletedVideo = await Video.findByIdAndDelete(videoId);
  // console.log(deletedVideo);
  return res
    .status(200)
    .json(new ApiResponse(200, deletedVideo, "DElete success"));
  //TODO: delete video
});



const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  const toggled = await Video.findByIdAndUpdate(
    videoId,
    [
      {
        $set: {
          isPublished: { $not: "$isPublished" },
        },
      },
    ], // Use aggregation pipeline to toggle
    { new: true } // Return updated document
  );

  if (!toggled) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, toggled, "Toggle successful"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
