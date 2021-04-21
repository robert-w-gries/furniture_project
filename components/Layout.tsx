import React from "react";
import Head from "next/head";
import Link from "next/link";
import { ReactNode } from "react";

type HeaderLinkProps = {
  children: ReactNode;
  href: string;
  className?: string;
};

const HeaderLink = ({ children, href }: HeaderLinkProps) => {
  return (
    <Link href={href} passHref>
      <a className="text-xl mr-6" href={href}>
        {children}
      </a>
    </Link>
  );
};

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps): JSX.Element => (
  <div className="flex flex-col items-center h-screen w-full">
    <Head>
      <title>Furniture Project</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <div className="flex-1 flex flex-col max-w-screen-lg w-full py-4 px-8">
      <header className="flex">
        <HeaderLink href="/">Home</HeaderLink>
        <HeaderLink href="/check-in">Check-in</HeaderLink>
      </header>

      <main className="flex-1 flex flex-col py-5">{children}</main>
    </div>
  </div>
);

export default Layout;
