import request from "supertest";
import { app } from "../../app";
import {
  generateRandomId,
  signin,
  saveOrder,
  saveTicket,
} from "../../test/helpers";

it("should return 401 when trying to get orders if the user is not authenticated", async () => {
  await request(app).get("/api/orders").expect(401);
});

it("should return user orders", async () => {
  const userOneId = generateRandomId();
  const userTwoId = generateRandomId();

  let response = await request(app)
    .get("/api/orders")
    .set("Cookie", signin(userOneId))
    .expect(200);

  expect(response.body.length).toEqual(0);

  response = await request(app)
    .get("/api/orders")
    .set("Cookie", signin(userTwoId))
    .expect(200);

  expect(response.body.length).toEqual(0);

  const ticketOne = await saveTicket();
  const ticketTwo = await saveTicket();
  const ticketThree = await saveTicket();

  // user one orders
  const orderOne = await saveOrder(userOneId, ticketOne);

  // user two orders
  const orderTwo = await saveOrder(userTwoId, ticketTwo);
  const orderThree = await saveOrder(userTwoId, ticketThree);

  response = await request(app)
    .get("/api/orders")
    .set("Cookie", signin(userOneId))
    .expect(200);
  expect(response.body.length).toEqual(1);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[0].ticket.id).toEqual(orderOne.ticket.id);

  response = await request(app)
    .get("/api/orders")
    .set("Cookie", signin(userTwoId))
    .expect(200);
  expect(response.body.length).toEqual(2);
});
