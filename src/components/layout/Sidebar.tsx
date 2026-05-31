"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ArrowLeftRight, BarChart2, LogOut, TrendingUp, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

const NAV = [
  { label: "Dashboard",   href: "/dashboard",    icon: LayoutDashboard },
  { label: "Transações",  href: "/transactions", icon: ArrowLeftRight },
  { label: "Análises",    href: "/analytics",    icon: BarChart2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Até logo!");
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-border bg-surface-secondary">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
          <TrendingUp size={16} className="text-accent" />
        </div>
        <span className="font-semibold text-text-primary">Finance AI</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-accent/10 text-accent font-medium"
                  : "text-text-secondary hover:bg-surface-tertiary hover:text-text-primary"
              )}
            >
              <Icon size={16} />
              {item.label}
              {active && (
                <motion.div layoutId="sidebar-active"
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-accent"
                />
              )}
            </Link>
          );
        })}

        {/* AI Insights link */}
        <Link href="/analytics"
          className="mt-4 flex items-center gap-3 rounded-lg border border-accent/20 bg-accent/5 px-3 py-2 text-sm text-accent transition-colors hover:bg-accent/10">
          <Sparkles size={16} />
          Insights de IA
        </Link>
      </nav>

      {/* Logout */}
      <div className="border-t border-border p-3">
        <button onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-tertiary hover:text-expense">
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  );
}
