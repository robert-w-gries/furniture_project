import React, { useState } from "react";
import styled from "styled-components";
import Button from "../components/Button";

const FormFlex = styled.form`
  display: flex;
  flex-flow: column;
  align-items: center;
  & div {
    margin-bottom: 12px;
  }
`;

type FormProps = {
  onSubmit: (value: string) => void;
  label?: string;
  submitText?: string;
};

const Form = ({ onSubmit, label, submitText }: FormProps): JSX.Element => {
  const [value, setValue] = useState("");

  return (
    <FormFlex
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
    >
      <label>
        {label ? `${label}` : null}
        <div>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </label>
      <div>
        <Button
          color="grey"
          onClick={() => onSubmit(value)}
          onEnter={() => onSubmit(value)}
          preventDefault
        >
          {submitText || "Submit"}
        </Button>
      </div>
    </FormFlex>
  );
};

export default Form;
