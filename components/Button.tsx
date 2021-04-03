import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface ButtonProps {
  children: ReactNode,
  onClick: () => void;
  color?: "grey" | "blue" | "red" | "white";
  disabled?: boolean;
  preventDefault?: boolean;
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

export default function Button({ children, color, disabled, onClick, preventDefault, type }: ButtonProps): JSX.Element {
  const buttonColor = color || "white";
  const handleClick = (e: React.MouseEvent) => {
    preventDefault && e.preventDefault();
    onClick();
  }
  return <ButtonStyled type={type || "button"} onClick={handleClick} {...colorMap[buttonColor]} disabled={disabled}>{children}</ButtonStyled>;
}
