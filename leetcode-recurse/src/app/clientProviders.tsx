"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "./Navbar";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <Navbar />
      {children}
    </SessionProvider>
  );
}
