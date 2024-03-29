import { useRequest } from "../../hooks/useRequest";
import { useRouter } from "next/router";

const TicketShow = ({ ticket }) => {
  const router = useRouter();

  const [doRequest, errsJSX] = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      router.push("/orders/[orderId]", `/orders/${order.id}`),
  });

  return (
    <div>
      <h1>Ticket Details</h1>
      <hr />
      <h2 className="text-info">Title: {ticket.title}</h2>
      <h3 className="text-info">Price: {ticket.price} USD</h3>
      {errsJSX}
      <button onClick={doRequest} className="btn btn-primary">
        Purchacse
      </button>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client, currentUser) => {
  const ticketId = context.query.ticketId;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
