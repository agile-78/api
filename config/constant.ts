import "dotenv/config";

export const PORT = process.env.PORT || 3000;
export const MONGO_PORT = process.env.MONGO_PORT || 27017;
export const MONGO_IP = process.env.MONGO_IP || "mongo";
export const MONGO_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD;
export const MONGO_USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME;
export const MONGO_URI =
  process.env.MONGO_URI ||
  `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;
export const JWT_SECRET = process.env.JWT_SECRET || "test";
export const JWT_LIFETIME = process.env.JWT_LIFETIME || "2 days";
export const MIME_TYPES = ["image/jpg", "image/png", "image/jpeg"];
// default 5mb
export const IMAGE_SIZE_LIMIT =
  parseInt(process.env.IMAGE_SIZE_LIMIT || "0") || 5 * 1024 * 1024;
