import React from "react";
import { ChakraUIProvider } from '@/providers/ChakraProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import ClientLayout from '@/components/layout/ClientLayout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Receivables App</title>
        <meta name="description" content="Myanmar Business Receivables Tracker" />
      </head>
      <body>
        <ChakraUIProvider>
          <AuthProvider>
            <ClientLayout>{children}</ClientLayout>
          </AuthProvider>
        </ChakraUIProvider>
      </body>
    </html>
  );
}