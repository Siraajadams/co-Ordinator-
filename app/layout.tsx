import "./globals.css";

export const metadata = {
  title: "Co-Ordinator Weddings",
  description: "Wedding planning CRM and registration platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
