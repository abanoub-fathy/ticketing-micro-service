import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appCtx) => {
  const client = buildClient(appCtx.ctx);

  let pageProps = {};
  let data = {};

  try {
    const response = await client.get("/api/users/current");
    data = response.data;
  } catch (err) {
    console.log("Error while running getInitialProps in AppComponent =", err);
  }

  // if tge component has getInitilProps
  if (appCtx.Component.getInitialProps) {
    try {
      pageProps = await appCtx.Component.getInitialProps(
        appCtx.ctx,
        client,
        data.currentUser
      );
    } catch (err) {
      console.log(
        "Error while running getInitialProps of the Component =",
        err
      );
    }
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
