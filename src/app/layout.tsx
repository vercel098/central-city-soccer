import type { Metadata } from "next";
import "./globals.css";
import Navbar from '@/components/Nabvar';
import Footer from '@/components/Footer';


export const metadata: Metadata = {
  title: "Central City Soccer",
  description: "Central City Soccer",
  icons: {
    icon: "/ccslcopy.jpg",  // Set the favicon path
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        {/* Add both Navbar components */}
        <Navbar />
         {children}
        <Footer />

        {/* Render children (other page content) */}
       
      </body>
    </html>
  );
}
