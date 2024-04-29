import Link from "next/link";
import Image from "next/image";
import styles from "./InitPage.module.css";

export default function Page() {
  return (
    <div className={styles["init-container"]}>
      <h1>Trial Network Life Cycle Manager Web Portal</h1>
      <Link href="https://6g-sandbox.eu/" target="_blank">
        <Image src="/SANDBOX_LOGO.png" alt="6GSandbox Logo" width={500} height={300} priority />
      </Link>
      <Link href="/tnlcm/login">
        <p>Log in</p>
      </Link>
    </div>
  );
}