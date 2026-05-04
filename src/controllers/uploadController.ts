import { Request, Response, NextFunction } from "express";
import { CloudinaryService } from "../services/cloudinaryService";
import { AppError } from "../utils/AppError";

const cloudinaryService = new CloudinaryService();

export class UploadController {
  /**
   * Upload a file to Cloudinary and return the URL.
   */
  async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError("No file uploaded", 400);
      }

      const folder = (req.body.folder as string) || "pharmee/general";
      const imageUrl = await cloudinaryService.uploadBuffer(req.file.buffer, folder);

      res.status(200).json({
        status: "success",
        data: {
          url: imageUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
