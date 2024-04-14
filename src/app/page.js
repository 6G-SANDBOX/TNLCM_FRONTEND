import Link from "next/link";
import Image from "next/image";

export default function Page() {
  return (
    <div>
      <Link href="https://6g-sandbox.eu/" target="_blank">
        <Image src="/logo6gsandbox.png" alt="Project Logo" width={500} height={300} priority />
      </Link>
      <h1>Trial Network Life Cycle Manager Web Portal</h1>
      <Link href="/tnlcm/login">
        <p>Log in</p>
      </Link>
    </div>
  );
}