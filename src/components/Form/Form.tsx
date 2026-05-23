import React from "react";
import "./Form.scss";

type Props = {
  title?: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
};

const FormWrapper: React.FC<Props> = ({ title, onSubmit, children }) => {
  return (
    <form
      className="formWrapper"
      onSubmit={(e) => {
        e.preventDefault();     // stop reload
        e.stopPropagation();    // avoid bubbling issues
        onSubmit?.(e);          // ✅ pass the real event
      }}
    >
      {title ? <legend>{title}</legend> : null}
      {children}
    </form>
  );
};

export default FormWrapper;
