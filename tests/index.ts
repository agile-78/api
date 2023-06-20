import { after, before } from "mocha";

import {
  closeConnection,
  dropCollections,
  dropDatabase,
  setup,
} from "./utils/db";
before(async () => {
  await setup();
  await dropCollections();
});

afterEach(async () => {
  // delete collections after each model test
  await dropCollections();
});

after(async () => {
  await dropDatabase();
  await closeConnection();
});
