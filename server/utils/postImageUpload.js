import cloudinary from "../config/cloudinary.js";

// Upload post image to Cloudinary
export const uploadPostImage = async (file) => {
  if (!file) {
    return "";
  }

  const uploadResult = await new Promise(
    (resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder: "codequest/posts",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            resolve(result);
          }
        );

      uploadStream.end(file.buffer);
    }
  );

  return uploadResult.secure_url;
};