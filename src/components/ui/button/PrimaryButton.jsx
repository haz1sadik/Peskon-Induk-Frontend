import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

const icons = {
  squarePlus: (
    <FontAwesomeIcon
      icon={faSquarePlus}
      className="flex !w-[1.125rem] !h-[1.125rem] justify-center items-center"
    />
  ),
  chevronRight: (
    <FontAwesomeIcon
      icon={faChevronRight}
      className="flex !w-[1.125rem] !h-[1.125rem] justify-center items-center "
    />
  ),
};

const PrimaryButton = ({
  to,
  onClick,
  leftIcon = false,
  rightIcon = false,
  text = "Button",
  disabled = false,
}) => {
  const content = (
    <>
      {leftIcon && icons.squarePlus}
      <span>{text}</span>
      {rightIcon && icons.chevronRight}
    </>
  );

  const style =
    "w-full inline-flex items-center justify-center gap-[0.5rem] rounded-full px-[1.25rem] py-[0.625rem] bg-peskon-primary hover:bg-peskon-primary-hover disabled:bg-peskon-primary/45 text-white text-sm cursor-pointer disabled:cursor-not-allowed";

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

export default PrimaryButton;
