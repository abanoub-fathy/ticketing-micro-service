import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: "new title",
    price: 123,
    userId: "123456",
  });
  await ticket.save();

  // fetch the ticket twice
  const instanceOne = await Ticket.findById(ticket.id);
  expect(instanceOne).not.toBeNull();

  const instanceTwo = await Ticket.findById(ticket.id);
  expect(instanceTwo).not.toBeNull();

  // update the first instance
  instanceOne!.price = 700;

  // update the second instance
  instanceTwo!.price = 900;

  // save first instance
  await instanceOne!.save();

  // save the second instance
  await expect(async () => {
    await instanceTwo!.save();
  }).rejects.toThrow("No matching document found");
});

it("increment the version number on each ticket save", async () => {
  const ticket = Ticket.build({
    title: "new title",
    price: 123,
    userId: "123456",
  });
  await ticket.save();

  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
