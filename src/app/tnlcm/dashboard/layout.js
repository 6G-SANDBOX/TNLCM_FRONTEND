import NavLink from "@/components/elements/NavLink";
import styles from "./Dashboard.module.css";

export default function Layout ({ children }) {
    return (
        <div className={styles.container}>
            <div className={styles.navLinkContainer}>
                <NavLink />
            </div>
            <div className={styles.childrenContainer}>
                {children}
            </div>
        </div>
    );
};