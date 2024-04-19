import styles from "@/components/modules/CustomLoader.module.css";

export default function CustomLoader() {
    return (
        <div className={styles["loader-container"]}>
            <div className={styles["loader"]}></div>
        </div>
    );
};