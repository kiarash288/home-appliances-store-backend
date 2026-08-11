import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: {
    default: "STORE. — Modern Essentials",
    template: "%s — STORE.",
  },
  description:
    "A modern e-commerce experience. Curated products, secure ZarinPal payments, and fast delivery.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50 font-sans text-stone-900 antialiased">
        {children}
        <Toaster
          richColors
          position="top-center"
          toastOptions={{ style: { borderRadius: "14px" } }}
        />
      </body>
    </html>
  );
}
