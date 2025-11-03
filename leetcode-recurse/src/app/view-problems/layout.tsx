// src/app/layout.tsx
"use client";
import { Toaster } from "sonner";
import React, { ReactNode } from "react";

// Define the type for the component props
interface RootLayoutProps {
  children: ReactNode;
}

// Use the defined interface for the props and specify the return type as JSX.Element
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
