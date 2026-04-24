import "./globals.css";

export const metadata = {
  title: "VerifyPay",
  description: "AI-powered fraud detection for suspicious messages and payment screenshots."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
