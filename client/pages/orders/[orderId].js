import { useState, useEffect } from "react";
import StripeCheckout from "react-stripe-checkout";
import { useRequest } from "../../hooks/useRequest";
import { useRouter } from "next/router";

const OrderShow = ({ order, currentUser }) => {
  const router = useRouter();
  let [timeLeft, setTimeLeft] = useState(0);

  const [doRequest, errsJSX] = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => router.push("/orders"),
  });

  useEffect(() => {
    function changeTimeLeft() {
      const timeLeftms = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(timeLeftms / 1000));
    }

    changeTimeLeft();
    const timerId = setInterval(changeTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft <= 0) {
    return <h2>❌ order is expired</h2>;
  }

  return (
    <div>
      ⏲️ this order has: {timeLeft} seconds to expire.
      <br />
      <StripeCheckout
        stripeKey={process.env.STRIPE_PUBLISHABLE_KEY}
        email={currentUser.email}
        amount={order.ticket.price * 100}
        token={(token) => doRequest({ token: token.id })}
      />
      {errsJSX}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client, currentUser) => {
  const orderId = context.query.orderId;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data, currentUser };
};

export default OrderShow;
