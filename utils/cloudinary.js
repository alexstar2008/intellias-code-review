const streamifier = require("streamifier");
const ErrorResponse = require("./errorResponse");

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
};

const streamUpload = file => {
  return new Promise((resolve, reject) => {
    const cloudinary = require("cloudinary").v2;
    cloudinary.config(cloudinaryConfig);

    let stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
        return;
      } else {
        reject(error);
        return;
      }
    });
    streamifier.createReadStream(file.data).pipe(stream);
  });
};

exports.uploadCloudinary = async file => {
  if (!file) {
    return ""
  }

  if (!file.mimetype.startsWith("image")) {
    return new ErrorResponse(`Upload an image file`, 300);
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return new ErrorResponse(`The image file is too large`, 500);
  }

  return await streamUpload(file);
}
