import React from "react";
import axios from "axios";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>LandingPage</h1>;
};

LandingPage.getInitialProps = async () => {
  // we can't use useRequest here because inside getInitialProps we
  // can't use hooks

  try {
    const response = await axios.get("/api/users/current");
    return response.data;
  } catch (err) {
    console.log(err);
    return { currentUser: null };
  }
};

export default LandingPage;
