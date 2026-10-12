import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Cadence — Life Organizer", description: "Plan tasks, routines, schedules, shopping, income, notes, and favorite apps in one cheerful daily workspace.", icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
