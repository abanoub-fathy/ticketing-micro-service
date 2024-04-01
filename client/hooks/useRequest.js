import { useState } from "react";
import axios from "axios";

export const useRequest = ({ url, method, body, onSuccess }) => {
  const [errsJSX, setErrors] = useState(null);

  const doRequest = async (addiotinalBodyProps = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, {
        ...body,
        ...addiotinalBodyProps,
      });

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      let errors = err.response.data.errors;

      setErrors(
        <div className="alert alert-danger">
          <h4>Oops...</h4>
          <ul className="my-0">
            {errors.map((error) => (
              <li key={error.message}>{error.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return [doRequest, errsJSX];
};
