import dotenv from 'dotenv'
dotenv.config();
import cloudinary from 'cloudinary';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import multer from 'multer';
const upload = multer();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hairbnb', // defines where the file will be stored on cloud
    format: async (req, file) => ['png', 'jpeg', 'jpg'] // set the file types it should support.
  },
});

export default storage;