import LeftNavLink from "@/components/elements/LeftNavLink";
import TopNavLink from "@/components/elements/TopNavLink";
import styles from "./Dashboard.module.css";

export default function Layout ({ children }) {
    return (
        <div className={styles["dashboard-container"]}>
            {/* <TopNavLink /> */}
            <div className={styles["leftnavlink-container"]}>
                <LeftNavLink />
            </div>
            <div className={styles["children-container"]}>
                {children}
            </div>
        </div>
    );
};