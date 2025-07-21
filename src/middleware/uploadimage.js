import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
import Busboy from 'busboy';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = (req, res, next) => {
  const busboy = Busboy({ headers: req.headers });
  const uploads = {};
  const cloudinaryPromises = [];
  req.body = {};

  let fileReceived = false;

  // Collect form fields (e.g., text inputs)
  busboy.on('field', (fieldname, value) => {
    req.body[fieldname] = value;
  });

  // Handle file uploads (if any)
  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    fileReceived = true;

    const uploadPromise = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `youtube-clone/${fieldname === "banner" ? "banners" : "profiles"}`,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          if (!uploads[fieldname]) uploads[fieldname] = [];
          uploads[fieldname].push(result);
          resolve();
        }
      );
      file.pipe(stream);
    });

    cloudinaryPromises.push(uploadPromise);
  });

  // After parsing all parts of the form
  busboy.on('finish', async () => {
    try {
      if (fileReceived) {
        await Promise.all(cloudinaryPromises);
        req.body.cloudinaryUploads = uploads;
      } else {
        req.body.cloudinaryUploads = {}; // No files received
      }
      next();
    } catch (err) {
      next(err);
    }
  });

  req.pipe(busboy);
};

export { cloudinary, uploadOnCloudinary };

