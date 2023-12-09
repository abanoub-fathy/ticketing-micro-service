import React from "react";
import { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signupHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/users/signup", {
        email,
        password,
      });

      console.log(data);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  return (
    <form onSubmit={signupHandler}>
      <h1>SignUp</h1>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          className="form-control"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          className="form-control"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

export default Signup;
