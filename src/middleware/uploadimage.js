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
  req.body = {}; // Make sure this exists

  // Collect fields
  busboy.on('field', (fieldname, value) => {
    req.body[fieldname] = value;
  });

  // Handle file upload
  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    const uploadPromise = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'youtube-clone/profiles',
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
    console.log("Received file:", fieldname, filename);
    cloudinaryPromises.push(uploadPromise);
  });

  busboy.on('finish', async () => {
    try {
      await Promise.all(cloudinaryPromises);
      req.body.cloudinaryUploads = uploads;
      console.log("Final uploads object:", uploads);
      next();
    } catch (err) {
      next(err);
    }
  });

  req.pipe(busboy);
};

export { cloudinary, uploadOnCloudinary };
