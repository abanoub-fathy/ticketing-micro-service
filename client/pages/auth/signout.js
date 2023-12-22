import { useEffect } from "react";
import { useRequest } from "../../hooks/useRequest";
import { useRouter } from "next/router";

const Signout = () => {
  const router = useRouter();

  const reqConfig = {
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => router.push("/"),
  };
  const [doRequest, errsJSX] = useRequest(reqConfig);

  useEffect(() => {
    doRequest();
  }, []);

  return <h1>Signing you out...</h1>;
};

export default Signout;
