import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface ButtonProps {
  children: ReactNode,
  color?: "grey" | "blue" | "red" | "white";
  disabled?: boolean;
  type?: "button" | "reset" | "submit";
}

const ButtonStyled = styled.button`
  color: ${props => props.color};
  background-color: ${props => props['background-color']};
`;

const colorMap = {
  blue: {
    color: "white",
    'background-color': "blue",
  },
  grey: {
    color: "white",
    'background-color': "dark-grey",
  },
  red: {
    color: "white",
    'background-color': "red",
  },
  white: {
    color: "black",
    'background-color': "white",
  },
}

export default function Button({ children, color, disabled, type }: ButtonProps): JSX.Element {
  const buttonColor = color || "white";
  return <ButtonStyled type={type || "button"} {...colorMap[buttonColor]} disabled={disabled}>{children}</ButtonStyled>;
}
