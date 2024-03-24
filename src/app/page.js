import Link from 'next/link';

export default function Page() {
  return (
    <div>
      <h1>Welcome to TNLCM frontend</h1>
      <Link href="/tnlcm/login">
        <p>Log in</p>
      </Link>
    </div>
  );
}