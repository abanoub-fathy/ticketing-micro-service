import mongoose from "mongoose";
import path from "path";
import { MongoMemoryServer } from "mongodb-memory-server";
require("dotenv").config({ path: path.join(__dirname, "../../test.env") });

jest.mock("../nats-client-wrapper.ts");

let mongo: MongoMemoryServer;
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});
