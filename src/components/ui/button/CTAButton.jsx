import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

const icons = {
  squarePlus: (
    <FontAwesomeIcon icon={faSquarePlus} className="!w-[1.2rem] !h-[1.2rem]" />
  ),
  chevronRight: (
    <FontAwesomeIcon
      icon={faChevronRight}
      className="!w-[1.2rem] !h-[1.2rem]"
    />
  ),
};

const CTAButton = ({
  to,
  onClick,
  leftIcon = false,
  rightIcon = false,
  text = "Button",
  disabled = false,
  className = "",
}) => {
  const content = (
    <>
      {leftIcon && icons.squarePlus}
      <span>{text}</span>
      {rightIcon && icons.chevronRight}
    </>
  );

  const style =
    `inline-flex items-center justify-center gap-[0.5rem] rounded-full px-[2rem] py-[0.9375rem] bg-sonetra-primary hover:bg-sonetra-primary-hover disabled:bg-sonetra-primary/45 text-white text-[1rem] font-bold cursor-pointer disabled:cursor-not-allowed ${className}`;

  if (to) {
    return (
      <NavLink to={to} className={style}>
        {content}
      </NavLink>
    );
  }

  return (
    <>
      <button onClick={onClick} className={style} disabled={disabled}>
        {content}
      </button>
    </>
  );
};

export default CTAButton;
