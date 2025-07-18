import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
import Busboy from 'busboy';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadVideoToCloudinary = (req, res, next) => {
  const busboy = Busboy({ headers: req.headers });
  const uploads = {};

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'youtube-clone/videos',
        resource_type: 'video',
      },
      (error, result) => {
        if (error) return next(error);
        uploads[fieldname] = result;
      }
    );
    file.pipe(uploadStream);
  });

  busboy.on('finish', () => {
    req.body.cloudinaryUploads = uploads;
    next();
  });

  req.pipe(busboy);
};

export { uploadVideoToCloudinary };
