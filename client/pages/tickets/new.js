import { useState } from "react";
import { useRequest } from "../../hooks/useRequest";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const requestConfig = {
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: (data) => console.log(data),
  };
  const [doRequest, errsJSX] = useRequest(requestConfig);

  const onSubmit = async (e) => {
    e.preventDefault();
    doRequest();
  };

  const onBlurPrice = () => {
    const priceValue = parseFloat(price);
    if (isNaN(priceValue)) {
      return;
    }

    setPrice(priceValue.toFixed(2));
  };

  return (
    <div>
      <h1>Create new Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group mt-2 mb-2">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group mt-2 mb-2">
          <label htmlFor="price">Price</label>
          <input
            type="text"
            className="form-control"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={onBlurPrice}
          />
        </div>

        {/* display errors if any */}
        {errsJSX}

        <button className="btn btn-primary">Save</button>
      </form>
    </div>
  );
};

export default NewTicket;
