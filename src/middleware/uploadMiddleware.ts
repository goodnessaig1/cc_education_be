import multer from "multer";
import { AppError } from "../utils/AppError";

// Use memory storage to avoid creating local files
const storage = multer.memoryStorage();

// File filter to allow images and documents
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Invalid file type. Only images (JPEG, PNG, WEBP) and documents (PDF, DOC, DOCX, TXT) are allowed!",
        400
      ),
      false
    );
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Increased to 10MB to accommodate documents
  },
});
