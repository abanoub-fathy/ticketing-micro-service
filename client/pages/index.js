import React from "react";
import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
  return (
    <div>
      <h1>Tickets List</h1>
      <table className="table text-center table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Price</th>
            <th>Show</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket, i) => (
            <tr key={ticket.id}>
              <td>{i + 1}</td>
              <td>{ticket.title}</td>
              <td>{ticket.price}</td>
              <td>
                <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                  Show Ticket
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets");
  return { tickets: data };
};

export default LandingPage;
