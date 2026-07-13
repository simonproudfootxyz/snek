"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  mini?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
};

const Button = ({
  className = "",
  type = "button",
  disabled = false,
  children,
  mini = false,
  fullWidth = false,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`button ${mini ? "button--mini " : ""}${
        fullWidth ? "button--full-width " : ""
      }${className}`.trim()}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export const InvertButton = ({
  className = "",
  mini = false,
  fullWidth = false,
  ...props
}: ButtonProps) => {
  return (
    <Button
      className={`button--invert ${className}`.trim()}
      mini={mini}
      fullWidth={fullWidth}
      {...props}
    />
  );
};

export const PrimaryButton = ({
  className = "",
  mini = false,
  fullWidth = false,
  ...props
}: ButtonProps) => {
  return (
    <Button
      className={`button--primary ${className}`.trim()}
      mini={mini}
      fullWidth={fullWidth}
      {...props}
    />
  );
};

export const PrimaryInvertButton = ({
  className = "",
  mini = false,
  fullWidth = false,
  ...props
}: ButtonProps) => {
  return (
    <Button
      className={`button--primary-invert ${className}`.trim()}
      mini={mini}
      fullWidth={fullWidth}
      {...props}
    />
  );
};

export const TextButton = ({
  className = "",
  mini = false,
  fullWidth = false,
  ...props
}: ButtonProps) => {
  return (
    <Button
      className={`button--text ${className}`.trim()}
      mini={mini}
      fullWidth={fullWidth}
      {...props}
    />
  );
};

export default Button;
