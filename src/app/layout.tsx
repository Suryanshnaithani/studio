
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';


export const metadata: Metadata = {
  title: 'Brochure Builder',
  description: 'Create stunning real estate brochures.',
  icons: {
    icon: '/app-logo.png', // Points to public/app-logo.png
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* The body class will now primarily use system fonts defined in globals.css for the editor UI */}
      <body className="antialiased bg-background text-foreground">
        {children}
        <div className="no-print">
          <Toaster />
        </div>
      </body>
    </html>
  );
}
