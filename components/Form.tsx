import React, { useState } from "react";
import Button from "../components/Button";

type FormProps = {
  onSubmit: (value: string) => void;
  label?: string;
  submitText?: string;
};

const Form = ({ onSubmit, label, submitText }: FormProps): JSX.Element => {
  const [value, setValue] = useState("");

  return (
    <div
      className="flex flex-col items-center"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
    >
      <label>
        <span className="select-none">{label ? `${label}` : null}</span>
        <input
          className="border ml-2"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
      <div className="mt-4">
        <Button
          color="grey"
          onClick={() => onSubmit(value)}
          onEnter={() => onSubmit(value)}
          preventDefault
        >
          {submitText || "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default Form;
