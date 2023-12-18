import React from "react";
import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  console.log("currentUser =", currentUser);

  return <h1>LandingPage</h1>;
};

// getInitialProps is used for server side rendering
// it can be run on the server and also in special cases on the client
// we need to handle the two cases
//
// we can't use useRequest to send request here because
//  inside getInitialProps we can't use hooks
LandingPage.getInitialProps = async (context) => {
  // build client according to the context
  const client = buildClient(context);

  try {
    const { data } = await client.get("/api/users/current");
    return data;
  } catch (err) {
    console.log("Error while running getInitialProps =", err);
    return { currentUser: null };
  }
};

export default LandingPage;
