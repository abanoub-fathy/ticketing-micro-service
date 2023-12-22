import React from "react";

const LandingPage = ({ currentUser }) => {
  return <h1>You are {!currentUser && "Not"} Signed in</h1>;
};

export default LandingPage;
