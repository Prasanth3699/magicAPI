import "./globals.css";
import { LogProvider } from "./context/LogContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LogProvider>{children}</LogProvider>
      </body>
    </html>
  );
}
