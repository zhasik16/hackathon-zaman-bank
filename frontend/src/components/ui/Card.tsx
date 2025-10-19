import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`
      financial-card p-6 
      ${
        hover
          ? "hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          : ""
      }
      ${className}
    `}
    >
      {children}
    </div>
  );
}
