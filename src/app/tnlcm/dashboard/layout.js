import CustomNavLink from "@/components/elements/CustomNavLink";
import styles from "./Dashboard.module.css";

export default function Layout ({ children }) {
    return (
        <div className={styles["dashboard-container"]}>
            <div className={styles["navlink-container"]}>
                <CustomNavLink />
            </div>
            <div className={styles["children-container"]}>
                {children}
            </div>
        </div>
    );
};