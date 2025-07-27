import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
import Busboy from 'busboy';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadMediaToCloudinary = (req, res, next) => {
  const busboy = Busboy({ headers: req.headers });
  const uploads = {};
  const cloudinaryPromises = [];
  req.body = {};

  busboy.on('field', (fieldname, value) => {
    req.body[fieldname] = value;
  });

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    let folder = 'youtube-clone/others';
    let resource_type = 'auto';

    if (fieldname === 'thumbnail') {
      folder = 'youtube-clone/thumbnails';
      resource_type = 'image';
    } else if (fieldname === 'banner') {
      folder = 'youtube-clone/banners';
      resource_type = 'image';
    } else if (fieldname === 'profile_picture') {
      folder = 'youtube-clone/profiles';
      resource_type = 'image';
    } else if (fieldname === 'video') {
      folder = 'youtube-clone/videos';
      resource_type = 'video';
    }

    const uploadPromise = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type,
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

  busboy.on('finish', async () => {
    try {
      await Promise.all(cloudinaryPromises);
      req.body.cloudinaryUploads = uploads;
      next();
    } catch (err) {
      next(err);
    }
  });

  req.pipe(busboy);
};

export { cloudinary, uploadMediaToCloudinary };