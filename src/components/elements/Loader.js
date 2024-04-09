import styles from "@/components/modules/Loader.module.css";

export default function Loader() {
    return (
        <div className={styles["loader-container"]}>
            <div className={styles["loader"]}></div>
        </div>
    );
};