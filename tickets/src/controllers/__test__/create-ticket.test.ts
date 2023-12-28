import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/helpers";

it("should return a status code indicating there is an endpoint for creating tickets", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.statusCode).not.toEqual(400);
});

it("should return an error if the user is not authenticated", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("should not returning 401 unauthanticated if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({});

  console.log("response.statusCode", response.statusCode);
  expect(response.statusCode).not.toEqual(401);
});

it("should return an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it("should return an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title: "asldkfj",
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title: "laskdfj",
    })
    .expect(400);
});
