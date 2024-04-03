import RequireAuth from "@/components/elements/RequireAuth";
import "./global.css";

export const metadata = {
  title: "TNLCM",
  description: "Frontend developed for Trial Network Lifecycle Manager",
}

export default function RootLayout({ children }) {
  return (
    <RequireAuth children={children}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </RequireAuth>
  );
};