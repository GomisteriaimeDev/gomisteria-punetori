import React from "react";
import "./FormInput.scss";

interface FormInputProps {
  type: string;
  name?: string;
  id?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  isError?: boolean;
  className?: string;
}

function FormInput({
  type,
  name,
  id,
  value = "",
  onChange,
  placeholder,
  isError,
  className = "",
}: FormInputProps) {
  return (
    <input
      id={id}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`formInput ${isError ? "error" : ""} ${className}`}
      autoComplete="off"
    />
  );
}

export default FormInput;
