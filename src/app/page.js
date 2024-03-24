import Link from 'next/link';
import Image from 'next/image';

export default function Page() {
  return (
    <div>
      <Image src="/logo6gsandbox.png" alt="Project Logo" width={500} height={300}/>
      <h1>Welcome to TNLCM frontend</h1>
      <Link href="/tnlcm/login">
        <p>Log in</p>
      </Link>
    </div>
  );
}