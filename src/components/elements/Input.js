import styles from "@/components/modules/Input.module.css";

export default function({ type, placeholder, value, onChange, onKeyDown, className, required }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className={`${styles[className]}`}
      required={required}
    />
  );
};