import "../globals.css";
import { Providers } from "../providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="relative flex min-h-screen items-center justify-center bg-gray-100">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-blue-900 opacity-90"></div>
          {/* Dotted Overlay */}
          <div className="absolute inset-0 bg-dotted-pattern opacity-10 mix-blend-overlay"></div>
          {/* Content */}
            <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
