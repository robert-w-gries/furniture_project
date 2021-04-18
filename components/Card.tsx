import React, { ReactNode } from "react";
import styled from "styled-components";

const CardStyle = styled.div`
  color: inherit;
  text-decoration: none;
  border: 1px solid black;
  transition: color 0.15s ease, border-color 0.15s ease;
`;

type CardProps = {
  className?: string;
  children: ReactNode;
};

const Card = ({ className, children }: CardProps) => (
  <CardStyle className={className}>{children}</CardStyle>
);

export default Card;
