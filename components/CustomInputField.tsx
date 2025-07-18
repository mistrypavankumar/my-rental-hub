interface CustomInputFieldProps {
  value: string | number;
  type?: string;
  name: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  label?: string;
  disabled?: boolean;
}

const CustomInputField = ({
  value,
  type = "text",
  name,
  placeholder,
  onChange,
  required = false,
  label,
  disabled = false,
}: CustomInputFieldProps) => {
  return (
    <div className="relative">
      <label
        htmlFor={name}
        className="absolute top-[-10px] left-[12px] bg-white block text-sm font-medium text-gray-700"
      >
        {label}
        {label && <span className="text-red-500">{required ? "*" : ""}</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-400 px-4 py-2 rounded"
        required={required}
        disabled={disabled}
      />
    </div>
  );
};

export default CustomInputField;
