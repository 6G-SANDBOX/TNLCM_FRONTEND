export default function CustomSelect({ value, onChange, options }) {
  return (
    <select value={value} onChange={onChange}>
      {options.map((option, idx) => (
        <option key={idx} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};