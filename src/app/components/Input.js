import styles from './Input.module.css';

export default function({ type, placeholder, value, onChange, onKeyDown, className }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className={`${styles[className]}`}
    />
  );
};