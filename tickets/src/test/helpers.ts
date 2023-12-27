import { app } from "../app";
import request from "supertest";

export const signup = async (email: string, password: string) => {
  const res = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const cookie = res.get("Set-Cookie");
  return cookie;
};
