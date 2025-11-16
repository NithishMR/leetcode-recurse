"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";

export default function AccountSettings() {
  const { data: session } = useSession();
  const user = session?.user;

  const [darkMode, setDarkMode] = useState(false);
  const [emailReminders, setEmailReminders] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-start justify-center py-6 px-3 sm:py-12 sm:px-4">
      <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-10 space-y-10 border border-gray-200 dark:border-zinc-800">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white">
          Account Settings
        </h1>

        {/* ================= PROFILE SECTION ================= */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Profile
          </h2>

          {/* Avatar Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
            <Avatar className="h-20 w-20 shadow mx-auto sm:mx-0">
              <AvatarImage
                src={user?.image ?? "https://github.com/shadcn.png"}
              />
              <AvatarFallback className="text-xl">
                {user?.name?.[0] ?? "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col text-center sm:text-left">
              <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                {user?.name ?? "User"}
              </p>
              <p className="text-gray-500 dark:text-gray-400 break-all">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                disabled
                placeholder={user?.name ?? "Username"}
                className="hover:border-gray-400 dark:hover:border-gray-600"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.email ?? ""}
                disabled
                className="bg-gray-100 dark:bg-zinc-800 border-none"
              />
            </div>
          </div>
        </section>

        <Separator />

        {/* ================= PREFERENCES ================= */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Preferences
          </h2>

          <div className="flex justify-between items-center py-2">
            <Label htmlFor="theme" className="text-gray-700 dark:text-gray-300">
              Dark Mode
            </Label>
            <Switch
              id="theme"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>

          <div className="flex justify-between items-center py-2">
            <Label
              htmlFor="emailReminders"
              className="text-gray-700 dark:text-gray-300"
            >
              Email Reminders
            </Label>
            <Switch
              id="emailReminders"
              checked={emailReminders}
              onCheckedChange={setEmailReminders}
            />
          </div>
        </section>

        <Separator />

        {/* ================= ACCOUNT ACTIONS ================= */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Account
          </h2>

          <div className="flex flex-col gap-4">
            <Button variant="destructive" className="w-full sm:flex-1" disabled>
              Delete Account
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
