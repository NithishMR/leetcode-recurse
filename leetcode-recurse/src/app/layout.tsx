import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "./clientProviders";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { NextStepProvider, NextStep, Tour } from "nextstepjs";
import TailwindDarkModeCard from "./TailwindDarkModeCard";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Anamnesis",
  description: "Daily Problem Tracker",
};
const steps: Tour[] = [
  {
    tour: "docs-demo",
    steps: [
      {
        icon: <>🧭</>,
        title: "Quick Navigation",
        content: (
          <>
            This short tour highlights only the parts that might feel confusing.
            Everything else is meant to be explored naturally.
            <br />
            <br />
            If you prefer navigating by routes, these are the main pages you can
            visit.
          </>
        ),
        selector: "#programmatic-navigation",
        side: "left",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
        nextRoute: "/",
      },

      {
        icon: <>📅</>,
        title: "Upcoming Reviews",
        content: (
          <>
            You can see the problems you need to review here.
            <br />
            This section shows reviews due in the next 7 days.
          </>
        ),
        selector: "#upcoming-reviews",
        side: "top",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
        nextRoute: "/problems",
        prevRoute: "/",
      },

      {
        icon: <>✍️</>,
        title: "Add a Problem (Manual)",
        content: (
          <>
            Use this option if you want to enter all details yourself.
            <br />
            Works for any platform.
          </>
        ),
        selector: "#manual-problem-entry",
        side: "left",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,

        // ✅ no route changes here
      },

      {
        icon: <>⚡</>,
        title: "Add a Problem (By URL)",
        content: (
          <>
            Use this option to auto-fill problem details using a link.
            <br />
            Currently supported only for LeetCode.
          </>
        ),
        selector: "#automated-problem-entry",
        side: "left",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
        prevRoute: "/problems",
        nextRoute: "/view-problems/1",
      },

      {
        icon: <>🧠</>,
        title: "Review a Problem",
        content: (
          <>
            Clicking this button means you reviewed the problem, and you’ll be
            redirected to the original platform link.
            <br />
            Anamnesis will then schedule the next review automatically.
            <br />
            <br />
            Try this after adding your first problem.
          </>
        ),
        selector: "#problem-review-instruction-page",
        side: "bottom",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
        nextRoute: "/docs",
        prevRoute: "/problems",
      },

      {
        icon: <>📘</>,
        title: "Docs & Help",
        content: (
          <>
            This is the documentation page.
            <br />
            You can always come back here if you forget how something works.
          </>
        ),
        selector: "#docs-page",
        side: "top",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
        nextRoute: "/account-settings",
        prevRoute: "/view-problems/1",
      },

      {
        icon: <>🔔</>,
        title: "Reminders & Notifications",
        content: (
          <>
            Anamnesis can remind you through <b>Google Calendar</b> and{" "}
            <b>Email</b>.
            <br />
            <br />
            Email reminders are <b>OFF</b> by default.
            <br />
            Calendar sync is <b>ON</b> by default.
            <br />
            <br />
            You can enable either one — or use both.
          </>
        ),
        selector: "#calendar-page-color-settings",
        side: "top",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
        prevRoute: "/docs",
      },
    ],
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NextStepProvider>
            <NextStep
              steps={steps}
              cardComponent={TailwindDarkModeCard}
              shadowRgb="0, 0, 0"
              shadowOpacity="0.65"
            >
              <ClientProviders>{children}</ClientProviders>
            </NextStep>
          </NextStepProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
