export default function CustomSelect({ value, onChange, options }) {
    return (
        <select value={value} onChange={onChange}>
            {options.map(option => (
                <option key={option.label} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};