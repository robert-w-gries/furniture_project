import React from "react";
import { AppProps } from "next/app";
// import "../styles/globals.css";
import "tailwindcss/tailwind.css";

function App({ Component, pageProps }: AppProps): JSX.Element {
  return <Component {...pageProps} />;
}

export default App;
