import { Router } from "express";
import { UploadController } from "../controllers/uploadController";
import { upload } from "../middleware/uploadMiddleware";

const router = Router();
const uploadController = new UploadController();

router.post("/", upload.single("file"), uploadController.uploadFile);

export default router;
