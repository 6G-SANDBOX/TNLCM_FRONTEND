import styles from "@/components/modules/CustomInput.module.css";
import CustomSelect from "./CustomSelect";

export default function CustomInput({ type, title, placeholder, value, options, onChange, onKeyDown, className, required }) {
  return (
    <div>
      {title && (
        <h5>{title}</h5>
      )}
      {type === 'select' ? (
        <CustomSelect
          value={value}
          onChange={onChange}
          options={options}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          className={`${styles[className]}`}
          required={required}
        />
      )}
    </div>
  );
};