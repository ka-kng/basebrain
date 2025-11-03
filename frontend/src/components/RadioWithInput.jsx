import React from "react";
import InputField from "./InputField";

// RadioWithInputコンポーネントを定義（親からpropsを受け取る）
const RadioWithInput = ({ label, radioValue, selectedValue, onChange, inputProps, error }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={radioValue} className="flex items-conter gap-2 cursor-pointer">
      <input
      id={radioValue}
        type="radio"
        value={radioValue}
        checked={selectedValue === radioValue} // 現在選択中の値と一致すればON状態にする
        onChange={onChange} // ラジオ選択時に親の処理を呼び出す
        className="accent-blue-500" // ラジオのチェック色を青にする
      />
      <span>{label}</span>
    </label>
    <InputField {...inputProps} disabled={selectedValue !== radioValue} error={error} />
  </div>
);

export default RadioWithInput;
