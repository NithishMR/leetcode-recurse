"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function AccountSettings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-2xl shadow-md p-8 space-y-8 border border-gray-200 dark:border-zinc-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
          Account Settings
        </h1>

        {/* Profile Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Profile
          </h2>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
              <AvatarFallback>NM</AvatarFallback>
            </Avatar>
            <div>
              <Input id="avatar" type="file" disabled />
            </div>

            <Button variant="outline" size="sm">
              Change Avatar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="Nithish" />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="nithish@example.com" disabled />
            </div>
          </div>
        </section>

        <Separator />

        {/* Preferences Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Preferences
          </h2>
          <div className="flex justify-between items-center">
            <Label htmlFor="theme" className="text-gray-700 dark:text-gray-300">
              Dark Mode
            </Label>
            <Switch
              id="theme"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
          <div className="flex justify-between items-center">
            <Label
              htmlFor="notifications"
              className="text-gray-700 dark:text-gray-300"
            >
              Email Reminders
            </Label>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
        </section>

        <Separator />

        {/* Account Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Account
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1">
              Change Password
            </Button>
            <Button variant="destructive" className="flex-1" disabled>
              Delete Account
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
