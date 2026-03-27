import { AccessibilityProvider } from "@/context/AccessibilityContext";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { AccPanel } from "@/components/AccPanel";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">
        <ConvexClientProvider>
          <AccessibilityProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
            <AccPanel />
          </AccessibilityProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}