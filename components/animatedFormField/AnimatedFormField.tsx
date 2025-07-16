import React from "react";
import "./AnimatedFormField.css";

interface AnimatedFormFieldProps {
  inputType: string;
  name: string;
  autoComplete?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  placeholder?: string;
}

const AnimatedFormField = ({
  inputType,
  autoComplete = "off",
  onChange,
  value,
  name,
  placeholder,
}: AnimatedFormFieldProps) => {
  return (
    <div className="flex relative h-[40px] group mb-7">
      <input
        type={inputType}
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        className="form__input w-full border-2 border-white/20 caret-primary rounded-md  outline-none px-4 group  hover:border-white/70
        bg-white/30 text-black transition-all duration-300"
        autoComplete={autoComplete}
      />
    </div>
  );
};

export default AnimatedFormField;
