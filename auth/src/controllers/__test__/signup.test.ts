import request from "supertest";
import { app } from "../../app";

it("should return 201 when the email & password are correct", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("should return 400 when email is invalid", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test.com",
      password: "password",
    })
    .expect(400);
});

it("should return 400 when password is invalid", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "p",
    })
    .expect(400);
});

it("should return 400 when the email or password are missing", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      password: "password",
    })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
    })
    .expect(400);
});

it("should not allow signup with the same registered email address", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(409);
});

it("should set cookie in the response after creating user", async () => {
  const res = await request(app).post("/api/users/signup").send({
    email: "test@test.com",
    password: "password",
  });

  expect(res.get("Set-Cookie")).toBeDefined();
});
