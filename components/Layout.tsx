import React from "react";
import Head from "next/head";
import Link from "next/link";
import { ReactNode } from "react";
import styled from "styled-components";

const RootContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const LayoutContainer = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column;
  max-width: 1200px;
  width: 100%;
  padding: 0 32px;
`;

const Header = styled.header`
  display: flex;
  padding: 0.5rem 0;
  & > a:not(:last-child) {
    margin-right: 24px;
  }
`;

const MainContainer = styled.main`
  flex: 1;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  padding: 5rem 0;
`;

const Footer = styled.footer`
  width: 100%;
  height: 100px;
  border-top: 1px solid #eaeaea;
  display: flex;
  justify-content: center;
  align-items: center;

  & img {
    height: 1rem;
  }
`;

const LinkWrapper = styled.a`
  font-size: 20px;
`;

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps): JSX.Element => (
  <RootContainer>
    <Head>
      <title>Furniture Project</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <LayoutContainer>
      <Header>
        <Link href="/" passHref>
          <LinkWrapper>Home</LinkWrapper>
        </Link>
        <Link href="/check-in" passHref>
          <LinkWrapper>Check-in</LinkWrapper>
        </Link>
      </Header>

      <MainContainer>{children}</MainContainer>
    </LayoutContainer>
  </RootContainer>
);

export default Layout;
