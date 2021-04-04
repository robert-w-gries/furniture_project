import React from "react";
import Layout from "../components/Layout";
import useUser from "../lib/hooks/useUser";

const SignUp = (): JSX.Element => {
  const [user, isLoading] = useUser({ redirectTo: "/login" });
  if (isLoading) {
    return (
      <Layout>
        <h1>Loading...</h1>
      </Layout>
    );
  }
  return <Layout>{user && user.email}</Layout>;
};

export default SignUp;
