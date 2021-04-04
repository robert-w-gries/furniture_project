import React from "react";
import Layout from "../components/Layout";
import useUser from "../lib/hooks/useUser";

const SignUp = (): JSX.Element => {
  const user = useUser({ redirectTo: "/login" });
  return <Layout>{user && user.email}</Layout>;
};

export default SignUp;
