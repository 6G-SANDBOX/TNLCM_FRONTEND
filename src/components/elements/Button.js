import styles from '../modules/Button.module.css';

export default function Button({ children, type, className, disabled, onClick }) {
    return (
        <button type={type} className={`${styles[className]}`} disabled={disabled} onClick={onClick}>
            {children}
        </button>
    );
};