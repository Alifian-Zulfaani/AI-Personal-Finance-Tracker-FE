"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ArrowLeftRight,
  MessageSquare,
  Sparkles,
  LogOut,
  Wallet,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transaksi", icon: ArrowLeftRight },
  { href: "/chat", label: "Asisten AI", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg glass hover:bg-white/10 transition-colors"
        id="mobile-menu-toggle"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen border-r border-white/[0.06] bg-card/80 backdrop-blur-xl transition-all duration-300 flex flex-col",
          collapsed ? "w-[72px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className={cn("flex items-center gap-3 px-4 h-16 border-b border-white/[0.06]", collapsed && "justify-center")}>
          <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-sm tracking-tight">FinTracker</h1>
              <p className="text-[10px] text-muted-foreground">AI-Powered</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-primary/15 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]",
                  collapsed && "justify-center px-0"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                {!collapsed && <span>{item.label}</span>}
                {isActive && !collapsed && (
                  <Sparkles className="h-3 w-3 ml-auto text-primary/60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className={cn("border-t border-white/[0.06] p-3 space-y-2", collapsed && "px-2")}>
          {!collapsed && user && (
            <div className="px-3 py-2">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          )}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all duration-200",
              collapsed && "justify-center px-0"
            )}
            title={collapsed ? "Keluar" : undefined}
            id="logout-button"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Keluar</span>}
          </button>
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 h-6 w-6 items-center justify-center rounded-full border bg-card shadow-sm hover:bg-accent transition-colors"
        >
          <ChevronLeft className={cn("h-3 w-3 transition-transform", collapsed && "rotate-180")} />
        </button>
      </aside>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
      >
        <DialogContent onClose={() => setShowLogoutConfirm(false)} className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Konfirmasi Keluar</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mt-2">
            Apakah Anda yakin ingin keluar dari akun ini?
          </p>
          <div className="flex gap-3 mt-6 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowLogoutConfirm(false)}
            >
              Batal
            </Button>
            <Button variant="destructive" onClick={logout}>
              Ya, Keluar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
