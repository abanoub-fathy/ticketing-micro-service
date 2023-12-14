import React, { useState } from "react";
import { useRequest } from "../../hooks/useRequest";
import { useRouter } from "next/router";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const useReqConfig = {
    url: "/api/users/signup",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => router.push("/"),
  };
  const [doRequest, errsJSX] = useRequest(useReqConfig);

  const signupHandler = async (e) => {
    e.preventDefault();

    // the error is handled in this hook
    doRequest();
  };

  return (
    <form onSubmit={signupHandler}>
      <h1>SignUp</h1>
      <div className="form-group mt-2 mb-2">
        <label htmlFor="email">Email</label>
        <input
          className="form-control"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group mt-2 mb-2">
        <label htmlFor="password">Password</label>
        <input
          className="form-control"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* display errors if any */}
      {errsJSX}

      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

export default Signup;
