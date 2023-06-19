import { after, before } from "mocha";

import { dropCollections, dropDatabase, setup } from "./utils/db";
before(async () => {
  await setup();
});

afterEach(async () => {
  // delete collections after each model test
  await dropCollections();
});

after(async () => {
  await dropDatabase();
});
