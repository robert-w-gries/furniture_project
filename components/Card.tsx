import React, { ReactNode } from "react";
import styled from "styled-components";

const CardStyle = styled.div`
  margin: 1rem;
  flex: 0 0 auto;
  padding: 1.5rem;
  text-align: left;
  color: inherit;
  text-decoration: none;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  transition: color 0.15s ease, border-color 0.15s ease;

  @media (max-width: 600px) {
    width: 100%;
    margin: 1rem 0;
  }

  & h3 {
    text-align: center;
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    user-select: none;
  }

  & p {
    margin: 0;
    font-size: 1.25rem;
    line-height: 1.5;
  }
`;

type CardProps = {
  className?: string;
  title: string;
  children: ReactNode;
};
export default function Card({ className, title, children }: CardProps) {
  return (
    <CardStyle className={className}>
      <h3>{title}</h3>
      {children}
    </CardStyle>
  );
}
