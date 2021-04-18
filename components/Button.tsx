import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  onEnter: () => void;
  color?: "grey" | "blue" | "red" | "white";
  disabled?: boolean;
  preventDefault?: boolean;
  type?: "button" | "reset" | "submit";
}

/*const ButtonStyled = styled.button`
  color: ${(props) => props.color};
  background-color: ${(props) => props["background-color"]};
  font-size: 16px;
`;*/

const colorMap = {
  blue: {
    color: "white",
    "background-color": "blue",
  },
  grey: {
    color: "black",
    "background-color": "dark-grey",
  },
  red: {
    color: "white",
    "background-color": "red",
  },
  white: {
    color: "black",
    "background-color": "white",
  },
};

export default function Button({
  children,
  color,
  disabled,
  onClick,
  onEnter,
  preventDefault,
  type,
}: ButtonProps): JSX.Element {
  const buttonColor = color || "white";
  const handleClick = (e: React.MouseEvent) => {
    preventDefault && e.preventDefault();
    onClick();
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    preventDefault && e.preventDefault();
    e.key === "Enter" && onEnter();
  };
  return (
    <ButtonStyled
      type={type || "button"}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      {...colorMap[buttonColor]}
      disabled={disabled}
    >
      {children}
    </ButtonStyled>
  );
}
