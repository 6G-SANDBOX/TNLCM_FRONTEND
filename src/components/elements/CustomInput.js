import styles from "@/components/modules/CustomInput.module.css";

export default function CustomInput({ type, extraContent, placeholder, value, onChange, onKeyDown, className, required }) {
  return (
    <div>
      {extraContent && (
        <h5>{extraContent}</h5>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className={`${styles[className]}`}
        required={required}
      />
    </div>
  );
};