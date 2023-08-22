import multer from "multer";
import { MIME_TYPES } from "../config/constant";
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
    // 5 mb
    fileSize: 5 * 1024 * 1024,
  },
  storage,
  fileFilter: (req, file, cb) => {
    if (!MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestError(`${file.mimetype} file type is not supported`);
    }
    cb(null, true);
  },
});
