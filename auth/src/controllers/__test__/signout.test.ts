import { app } from "../../app";
import { signup } from "../../test/helpers";
import request from "supertest";

it("should return no cookie when signout used", async () => {
  const cookie = await signup("test@test.com", "password");

  const signoutRes = await request(app)
    .post("/api/users/signout")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(signoutRes.get("Set-Cookie")[0]).toEqual(
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
