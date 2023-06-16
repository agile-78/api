import { MONGO_URI, PORT } from "./config/constant";
import { connectDB } from "./database/connect";
import { app } from "./server";

async function start() {
  await connectDB(MONGO_URI);
  app.listen(PORT, () => console.log(`Server is starting on port ${PORT}`));
}

start();
