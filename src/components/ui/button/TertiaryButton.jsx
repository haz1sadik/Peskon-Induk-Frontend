import React from "react";
import { NavLink } from "react-router-dom";

const TertiaryButton = ({ text = "Button", onClick, to, disabled = false }) => {
  const style = `
    underline underline-offset-[15%] 
    decoration-solid decoration-2 
    text-sonetra-primary disabled:text-sonetra-primary/45 
    cursor-pointer disabled:cursor-not-allowed
    `;

  if (to) {
    return (
      <NavLink to={to}>
        <button className={style}>{text}</button>
      </NavLink>
    );
  }

  return (
    <button className={style} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};

export default TertiaryButton;
