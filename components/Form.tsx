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
    <form>
      <label>
        {label ? `${label}:` : null}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
      <Button onClick={() => onSubmit(value)} preventDefault>
        {submitText || "Submit"}
      </Button>
    </form>
  );
};

export default Form;
