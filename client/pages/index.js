import React from "react";

const LandingPage = ({ currentUser }) => {
  return <h1>You are {!currentUser && "Not"} Signed in</h1>;
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  return {};
};

export default LandingPage;
