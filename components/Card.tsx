import React, { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
};

const Card = ({ children }: CardProps) => (
  <div className="text-center p-4 border border-black rounded-md transition hover:border-blue-600">
    {children}
  </div>
);

export default Card;
