import { Magic } from "magic-sdk";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Form from "../components/Form";
import Layout from "../components/Layout";
import useUser from "../lib/hooks/useUser";

const Login = (): JSX.Element => {
  useUser({ redirectTo: "/signup", redirectIfFound: true });
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (email: string) => {
    if (errorMsg) {
      setErrorMsg("");
    }

    try {
      const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);
      const didToken = await magic.auth.loginWithMagicLink({ email });
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + didToken,
        },
      });
      if (res.status === 200) {
        router.push("/signup");
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    }
  };

  return (
    <Layout>
      <Form label="Email" submitText="Login" onSubmit={handleSubmit} />
    </Layout>
  );
};

export default Login;
