import React from "react";
import InputField from "./InputField";

const RadioWithInput = ({ label, radioValue, selectedValue, onChange, inputProps, error }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={radioValue} className="flex items-conter gap-2 cursor-pointer">
      <input
      id={radioValue}
        type="radio"
        value={radioValue}
        checked={selectedValue === radioValue}
        onChange={onChange}
        className="accent-blue-500"
      />
      <span>{label}</span>
    </label>
    <InputField {...inputProps} disabled={selectedValue !== radioValue} error={error} />
  </div>
);

export default RadioWithInput;
