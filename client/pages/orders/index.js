import moment from "moment";

const UserOrders = ({ orders }) => {
  if (!orders.length) {
    return (
      <div>
        <h3>You have no orders ...</h3>
      </div>
    );
  }

  return (
    <div>
      <h1>Available Tickets List</h1>
      <table className="table text-center table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Ticket Title</th>
            <th>Created At</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, i) => (
            <tr key={order.id}>
              <td>{i + 1}</td>
              <td>{order.ticket.title}</td>
              <td>
                {moment(order.createdAt).utc().format("MM/DD/YYYY, HH:mm:ss")}{" "}
                UTC
              </td>
              <td>{order.ticket.price}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

UserOrders.getInitialProps = async (content, client, currentUser) => {
  const { data } = await client.get("/api/orders");
  return { orders: data };
};

export default UserOrders;
