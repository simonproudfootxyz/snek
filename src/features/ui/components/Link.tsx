"use client";

import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import "./Button.css";

type BaseAnchorProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

type StyledLinkProps = BaseAnchorProps &
  NextLinkProps & {
    mini?: boolean;
    fullWidth?: boolean;
    disabled?: boolean;
    children?: ReactNode;
  };

const Link = ({
  className = "",
  onClick,
  disabled = false,
  children,
  mini = false,
  fullWidth = false,
  tabIndex,
  href,
  ...props
}: StyledLinkProps) => {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);
  };

  return (
    <NextLink
      href={href}
      className={`button ${mini ? "button--mini " : ""}${
        fullWidth ? "button--full-width " : ""
      }${disabled ? "disabled " : ""}${className}`.trim()}
      onClick={handleClick}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : tabIndex}
      {...props}
    >
      {children}
    </NextLink>
  );
};

export const InvertLink = ({ className = "", ...props }: StyledLinkProps) => {
  return <Link className={`button--invert ${className}`.trim()} {...props} />;
};

export const PrimaryLink = ({ className = "", ...props }: StyledLinkProps) => {
  return <Link className={`button--primary ${className}`.trim()} {...props} />;
};

export const PrimaryInvertLink = ({
  className = "",
  ...props
}: StyledLinkProps) => {
  return (
    <Link className={`button--primary-invert ${className}`.trim()} {...props} />
  );
};

export const TextLink = ({ className = "", ...props }: StyledLinkProps) => {
  return <Link className={`button--text ${className}`.trim()} {...props} />;
};

export default Link;
