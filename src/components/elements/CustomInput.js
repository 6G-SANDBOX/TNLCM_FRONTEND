import styles from "@/components/modules/CustomInput.module.css";

export default function CustomInput({ type, title, placeholder, value, options, onChange, onKeyDown, className, required }) {
  return (
    <div>
      {title && (
        <h5>{title}</h5>
      )}
      {type === 'select' ? (
        <select
          value={value}
          onChange={onChange}
          className={`${styles[className]}`}
          required={required}
        >
          {options.map((option, idx) => (
            <option key={idx} value={option}>
              {option}
            </option>
          ))}
        </select>
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