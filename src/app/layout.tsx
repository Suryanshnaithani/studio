import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import './globals.css';

// Using a placeholder font, replace with 'Georgia' if available via font provider or CSS import
// import { Lora } from 'next/font/google';
// const lora = Lora({ subsets: ['latin'], variable: '--font-serif' });

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
      {/* Apply serif font class if using next/font */}
      {/* <body className={`${lora.variable} font-serif antialiased`}> */}
      <body className="font-[Georgia,serif] antialiased"> {/* Apply Georgia font stack */}
        {children}
        <div className="no-print"> {/* Add wrapper with no-print class */}
             <Toaster /> {/* Add Toaster component */}
        </div>
      </body>
    </html>
  );
}
