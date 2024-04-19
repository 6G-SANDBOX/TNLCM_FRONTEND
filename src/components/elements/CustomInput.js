import styles from "@/components/modules/CustomInput.module.css";

export default function CustomInput({ type, title, placeholder, value, onChange, onKeyDown, className, required }) {
  return (
    <div>
      {title && (
        <h5>{title}</h5>
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