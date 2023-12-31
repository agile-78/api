import multer from "multer";
import { IMAGE_SIZE_LIMIT, MIME_TYPES } from "../config/constant";
import { BadRequestError } from "../errors";

export const storage = multer.diskStorage({
  destination: "./imgs",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() * Math.round(Math.random() * 1e3);
    const fileType = file.mimetype.split("/")[1];
    cb(null, uniqueSuffix + "." + fileType);
  },
});

export const fileUpload = multer({
  limits: {
    fileSize: IMAGE_SIZE_LIMIT,
  },
  storage,
  fileFilter: (req, file, cb) => {
    if (!MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestError(`${file.mimetype} file type is not supported`);
    }
    cb(null, true);
  },
});
