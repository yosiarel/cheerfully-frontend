// Root layout — the locale-specific layout lives in /[locale]/layout.tsx.
// This file is required by Next.js but only serves as a passthrough.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
