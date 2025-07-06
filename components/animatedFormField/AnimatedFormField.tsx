import React from "react";
import "./AnimatedFormField.css";

interface AnimatedFormFieldProps {
  inputType: string;
  name: string;
  labelName: string;
  autoComplete?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

const AnimatedFormField = ({
  inputType,
  labelName,
  autoComplete = "off",
  onChange,
  value,
  name,
}: AnimatedFormFieldProps) => {
  return (
    <div className="flex relative h-[40px] group mb-7">
      <input
        type={inputType}
        value={value}
        onChange={onChange}
        name={name}
        placeholder=""
        className="form__input w-full border-2 border-gray-300 rounded-md  outline-none px-4 group focus-within:border-secondary
        hover:border-gray-400
        bg-transparent"
        autoComplete={autoComplete}
      />
      <label
        htmlFor={inputType}
        className="form__label absolute top-[18%] text-gray-400 left-[4%] bg-white group-focus-within:text-sm
        group-focus-within:text-secondary
        font-medium
         transition-all 
        duration-300
        cursor-text -z-10"
      >
        {labelName}
      </label>
    </div>
  );
};

export default AnimatedFormField;
