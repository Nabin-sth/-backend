import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfull
    //console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

const getVidById = async (videoId) => {
  try {
    if (!videoId) {
      return null;
    }
    const video = await cloudinary.api.resource(videoId, {
      resource_type: "video",
    });
    return video;
  } catch (error) {
    console.log("Error while getting video by id: ", error);
    return null;
  }
};
const updateVideo = async (videoId) => {
  try {
    await cloudinary.api.update(videoId,{resource_type:"video",context})
  } catch (error) {
    console.log("VIdeo update errro: ", error);
  }
};
export { uploadOnCloudinary, getVidById };
