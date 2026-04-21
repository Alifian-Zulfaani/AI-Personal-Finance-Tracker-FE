"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { transactionService } from "@/services";
import { TransactionSummary, Transaction } from "@/types";
import { formatRupiah, getGreeting, formatDateShort } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#6366f1",
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [recentTx, setRecentTx] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [summaryRes, txRes] = await Promise.all([
        transactionService.getSummary(),
        transactionService.getAll({ limit: 5, sortBy: "date", sortOrder: "desc" }),
      ]);

      if (summaryRes.data.data) setSummary(summaryRes.data.data);
      if (txRes.data.data) setRecentTx(txRes.data.data.transactions);
    } catch (error) {
      console.error("Dashboard load error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categoryData = summary
    ? Object.entries(summary.categoryBreakdown).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 text-sm">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name === "income" ? "Pemasukan" : "Pengeluaran"}:{" "}
              {formatRupiah(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 rounded-xl lg:col-span-2" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold tracking-tight">
          {getGreeting()}, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Berikut ringkasan keuangan Anda bulan ini.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Balance */}
        <Card className="glass-card hover:border-white/[0.12] transition-all duration-300 animate-fade-in animate-delay-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-blue-500/15 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-blue-400" />
              </div>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Saldo</p>
            <p className="text-2xl font-bold tracking-tight">
              {formatRupiah(summary?.balance || 0)}
            </p>
          </CardContent>
        </Card>

        {/* Income */}
        <Card className="glass-card hover:border-white/[0.12] transition-all duration-300 animate-fade-in animate-delay-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Pemasukan</p>
            <p className="text-2xl font-bold tracking-tight text-emerald-400">
              {formatRupiah(summary?.totalIncome || 0)}
            </p>
          </CardContent>
        </Card>

        {/* Expense */}
        <Card className="glass-card hover:border-white/[0.12] transition-all duration-300 animate-fade-in animate-delay-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-red-500/15 flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-red-400" />
              </div>
              <ArrowDownRight className="h-4 w-4 text-red-400" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Pengeluaran</p>
            <p className="text-2xl font-bold tracking-tight text-red-400">
              {formatRupiah(summary?.totalExpense || 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <Card className="glass-card lg:col-span-2 animate-fade-in animate-delay-300">
          <CardHeader>
            <CardTitle className="text-base">Tren Keuangan 6 Bulan Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              {summary && summary.monthlyTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={summary.monthlyTrend}>
                    <defs>
                      <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis
                      dataKey="month"
                      stroke="rgba(255,255,255,0.4)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.4)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${(value / 1000000).toFixed(1)}jt`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#incomeGrad)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="expense"
                      stroke="#ef4444"
                      fillOpacity={1}
                      fill="url(#expenseGrad)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <p className="text-sm">Belum ada data untuk ditampilkan</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="glass-card animate-fade-in animate-delay-400">
          <CardHeader>
            <CardTitle className="text-base">Kategori Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatRupiah(Number(value))}
                      contentStyle={{
                        background: "rgba(15,23,42,0.9)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <p className="text-sm">Belum ada data</p>
                </div>
              )}
            </div>
            {/* Legend */}
            <div className="space-y-2 mt-2">
              {categoryData.slice(0, 4).map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-muted-foreground truncate max-w-[120px]">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-medium">{formatRupiah(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="glass-card animate-fade-in animate-delay-400">
        <CardHeader>
          <CardTitle className="text-base">Transaksi Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTx.length > 0 ? (
            <div className="space-y-3">
              {recentTx.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                        tx.type === "INCOME"
                          ? "bg-emerald-500/15"
                          : "bg-red-500/15"
                      }`}
                    >
                      {tx.type === "INCOME" ? (
                        <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {tx.category} · {formatDateShort(tx.date)}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-sm font-semibold ${
                      tx.type === "INCOME" ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {tx.type === "INCOME" ? "+" : "-"}
                    {formatRupiah(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">Belum ada transaksi. Mulai catat keuangan Anda!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
