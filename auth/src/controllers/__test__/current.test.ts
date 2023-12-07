import request from "supertest";
import { signup } from "../../test/helpers";
import { app } from "../../app";

it("should have user info in current user after signup", async () => {
  const email = "test@test.com";
  const password = "password";

  const cookie = await signup(email, password);

  const currentUserRes = await request(app)
    .get("/api/users/current")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(currentUserRes.body.currentUser).toBeDefined();
  expect(currentUserRes.body.currentUser.email).toEqual(email);
});

it("should have current user = null if there is no cookie", async () => {
  const currentUserRes = await request(app)
    .get("/api/users/current")
    .send()
    .expect(200);

  expect(currentUserRes.body.currentUser).toBeDefined();
  expect(currentUserRes.body.currentUser).toEqual(null);
});
