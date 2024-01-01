import request from "supertest";
import { app } from "../../app";
import { generateRandomId, saveTicket } from "../../test/helpers";

it("should return empty array when there is no ticket", async () => {
  const responsoe = await request(app).get("/api/tickets").send();
  expect(responsoe.statusCode).toBe(200);
  expect(responsoe.body).toEqual([]);
});

it("should return ticket when it exists", async () => {
  // create ticket in db
  const ticketAttrs = {
    title: "golden ticket",
    price: 200,
    userId: generateRandomId(),
  };
  await saveTicket(ticketAttrs);

  const response = await request(app).get(`/api/tickets/`).send();
  expect(response.statusCode).toEqual(200);
  expect(response.body.length).toEqual(1);
});
