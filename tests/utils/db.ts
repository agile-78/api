import mongoose from "mongoose";
import { connectDB } from "../../database/connect";
import { MONGO_URI } from "../../config/constant";

let mongo: any;

export async function setup() {
  if (mongo) return;
  mongo = await connectDB(MONGO_URI);
}

export async function dropDatabase() {
  if (mongo) {
    await mongoose.connection.dropDatabase();
  }
}

export async function closeConnection() {
  if (mongo) {
    await mongoose.connection.close();
  }
}

export async function dropCollections() {
  if (mongo) {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
  }
}
