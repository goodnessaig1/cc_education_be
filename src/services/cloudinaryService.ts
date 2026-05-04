import { v2 as cloudinary } from "cloudinary";
import { AppError } from "../utils/AppError";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryService {
  /**
   * Upload a buffer to Cloudinary.
   */
  async uploadBuffer(buffer: Buffer, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            return reject(new AppError(`Cloudinary Upload Error: ${error.message}`, 500));
          }
          if (!result) {
            return reject(new AppError("Cloudinary Upload Error: No result returned", 500));
          }
          resolve(result.secure_url);
        }
      );

      uploadStream.end(buffer);
    });
  }
}
