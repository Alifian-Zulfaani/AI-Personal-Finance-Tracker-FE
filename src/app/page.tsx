"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowRight, BarChart3, Bot, Shield, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[200px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg">FinTracker</span>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button>
                Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Masuk</Button>
              </Link>
              <Link href="/register">
                <Button>
                  Daftar <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm mb-8 animate-fade-in">
          <Sparkles className="h-4 w-4" />
          <span>Didukung oleh Google Gemini AI</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in animate-delay-100">
          Kelola Keuangan Anda{" "}
          <span className="gradient-text">Lebih Cerdas</span>{" "}
          dengan AI
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in animate-delay-200">
          Pantau pemasukan & pengeluaran, dapatkan kategorisasi otomatis, dan
          terima saran keuangan personal dari asisten AI berbahasa Indonesia.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animate-delay-300">
          <Link href={isAuthenticated ? "/dashboard" : "/register"}>
            <Button size="lg" className="text-base px-8">
              Mulai Gratis <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="text-base px-8">
              Sudah Punya Akun
            </Button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-24 text-left">
          {[
            {
              icon: BarChart3,
              title: "Analisis Real-time",
              desc: "Dashboard interaktif dengan grafik pengeluaran bulanan dan breakdown per kategori.",
              gradient: "from-blue-500 to-cyan-400",
            },
            {
              icon: Bot,
              title: "Asisten AI Cerdas",
              desc: "Tanya apa saja tentang keuangan Anda. AI kami memahami konteks Indonesia.",
              gradient: "from-violet-500 to-purple-400",
            },
            {
              icon: Shield,
              title: "Aman & Privat",
              desc: "Data terenkripsi dan tersimpan aman. Privasi keuangan Anda adalah prioritas kami.",
              gradient: "from-emerald-500 to-green-400",
            },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className={`glass-card p-6 hover:border-white/[0.12] transition-all duration-300 hover:translate-y-[-2px] animate-fade-in animate-delay-${(i + 2) * 100}`}
            >
              <div className={`h-11 w-11 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}>
                <feature.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-6 text-center text-sm text-muted-foreground">
        <p>© 2026 FinTracker. Dibuat dengan ❤️ di Indonesia.</p>
      </footer>
    </div>
  );
}
