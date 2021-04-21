import React, { ReactNode } from "react";

/*const CardStyle = styled.div`
  color: inherit;
  text-decoration: none;
  border: 1px solid black;
  transition: color 0.15s ease, border-color 0.15s ease;
`;*/

type CardProps = {
  children: ReactNode;
};

const Card = ({ children }: CardProps) => (
  <div className="text-center p-4 border border-black rounded-md transition hover:border-blue-600">
    {children}
  </div>
);

export default Card;
