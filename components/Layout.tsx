import React from 'react';
import Head from 'next/head'
import Link from 'next/link';
import { ReactNode } from 'react';
import styled from 'styled-components';

const RootContainer = styled.div`
  min-height: 100vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: left;
`;

const Header = styled.header`
  display: flex;
  justify-content: flex-start;
`;

const MainContainer = styled.main`
  padding: 5rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MainContent = styled.div`
  max-width: 1200px;
`

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

const HomeLink = styled.a`
  font-size: 1.5rem;
`;

type LayoutProps = {
  children: ReactNode,
  useFullWidth?: boolean,
};

export default function Layout({ children, useFullWidth }: LayoutProps): JSX.Element {
  return (
    <RootContainer>
      <Head>
        <title>Furniture Project</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header>
        <Link href="/" passHref>
          <HomeLink>Home</HomeLink>
        </Link>
      </Header>

      <MainContainer>
        {useFullWidth ? children : <MainContent>{children}</MainContent>}
      </MainContainer>

      {false ? <Footer /> : null}
    </RootContainer>
  );
}
