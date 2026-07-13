"use client";

import {
  useId,
  type ChangeEventHandler,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import "./Toggle.css";

type ToggleProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange"
> & {
  type?: "checkbox" | "radio";
  onChange?: ChangeEventHandler<HTMLInputElement>;
  label?: ReactNode;
};

const Toggle = ({
  id,
  name,
  value,
  type = "checkbox",
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  label,
  className = "",
}: ToggleProps) => {
  const fallbackId = useId();
  const inputId = id || `toggle-${name || fallbackId}`;

  return (
    <label
      htmlFor={inputId}
      className={`toggle ${disabled ? "toggle--disabled" : ""} ${className}`.trim()}
    >
      <input
        id={inputId}
        name={name}
        value={value}
        type={type}
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        disabled={disabled}
        className="toggle__input"
      />
      <span className="toggle__track" aria-hidden="true">
        <span className="toggle__thumb" />
      </span>
      {label ? <span className="toggle__label">{label}</span> : null}
    </label>
  );
};

export default Toggle;
