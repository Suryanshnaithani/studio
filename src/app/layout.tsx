import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';


export const metadata: Metadata = {
  title: 'Brochure Builder',
  description: 'Create stunning real estate brochures.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-[Georgia,serif] antialiased bg-background text-foreground">
        {children}
        <div className="no-print">
          <Toaster />
        </div>
      </body>
    </html>
  );
}