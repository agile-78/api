import { PORT } from "./config/constant";
// import { connectDB } from "./database/connect";
import { app } from "./server";

async function start() {
  app.listen(PORT, () => console.log(`Server is starting on port ${PORT}`));
}

start();
