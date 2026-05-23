import React, { ChangeEvent } from "react";
import "./TextInput.scss";

interface TextInputProps {
  label?: string;
  value: string;
  name: string;
  width?: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  handleChange,
  name,
  width,
}) => {
  return (
    <div className="text-with-label" style={{ width: `${width}` }}>
      <label className="input-label-text">
        {label} {/* Using label directly for better accessibility */}
        <input
          type="text"
          value={value}
          name={name}
          onChange={handleChange}
          className={`text-field ${value ? "has-value" : ""}`}
        />
      </label>
    </div>
  );
};

export default TextInput;
