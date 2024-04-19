import styles from "@/components/modules/CustomButton.module.css";

export default function CustomButton({ children, type, className, disabled, onClick }) {
    return (
        <button type={type} className={`${styles[className]}`} disabled={disabled} onClick={onClick}>
            {children}
        </button>
    );
};