"use client";

import { useEffect, useState, useCallback } from "react";
import { transactionService, aiService } from "@/services";
import { Transaction, TransactionFormData } from "@/types";
import { formatRupiah, formatDateShort, formatDateInput } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import {
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Pencil,
  Trash2,
  Filter,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const CATEGORIES = [
  "Makanan & Minuman",
  "Transportasi",
  "Belanja",
  "Tagihan & Utilitas",
  "Hiburan",
  "Kesehatan",
  "Pendidikan",
  "Investasi",
  "Gaji",
  "Freelance",
  "Hadiah",
  "Lainnya",
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState<TransactionFormData>({
    type: "EXPENSE",
    category: "",
    amount: 0,
    description: "",
    date: formatDateInput(new Date()),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const { toast } = useToast();

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: any = { page, limit: 10, sortBy: "date", sortOrder: "desc" };
      if (filterType) params.type = filterType;
      if (filterCategory) params.category = filterCategory;

      const res = await transactionService.getAll(params);
      if (res.data.data) {
        let txs = res.data.data.transactions;
        if (searchQuery) {
          txs = txs.filter(
            (tx) =>
              tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              tx.category.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        setTransactions(txs);
        setTotalPages(res.data.data.pagination.totalPages);
        setTotal(res.data.data.pagination.total);
      }
    } catch (error) {
      console.error("Load transactions error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, filterType, filterCategory, searchQuery]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const openCreateForm = () => {
    setEditingTx(null);
    setFormData({
      type: "EXPENSE",
      category: "",
      amount: 0,
      description: "",
      date: formatDateInput(new Date()),
    });
    setShowForm(true);
  };

  const openEditForm = (tx: Transaction) => {
    setEditingTx(tx);
    setFormData({
      type: tx.type,
      category: tx.category,
      amount: tx.amount,
      description: tx.description,
      date: formatDateInput(tx.date),
    });
    setShowForm(true);
  };

  const handleAutoCategorize = async () => {
    if (!formData.description.trim()) {
      toast("Masukkan deskripsi terlebih dahulu.", "error");
      return;
    }
    setIsCategorizing(true);
    try {
      const res = await aiService.categorize(formData.description);
      if (res.data.data) {
        setFormData((prev) => ({ ...prev, category: res.data.data!.category }));
        toast(`Kategori: ${res.data.data.category}`, "success");
      }
    } catch {
      toast("Gagal mengkategorikan otomatis.", "error");
    } finally {
      setIsCategorizing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) {
      toast("Pilih kategori terlebih dahulu.", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingTx) {
        await transactionService.update(editingTx.id, formData);
        toast("Transaksi berhasil diperbarui!", "success");
      } else {
        await transactionService.create(formData);
        toast("Transaksi berhasil ditambahkan!", "success");
      }
      setShowForm(false);
      loadTransactions();
    } catch (error: any) {
      toast(error.response?.data?.message || "Gagal menyimpan transaksi.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await transactionService.delete(id);
      toast("Transaksi berhasil dihapus!", "success");
      setShowDeleteConfirm(null);
      loadTransactions();
    } catch {
      toast("Gagal menghapus transaksi.", "error");
    }
  };

  const clearFilters = () => {
    setFilterType("");
    setFilterCategory("");
    setSearchQuery("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transaksi</h1>
          <p className="text-muted-foreground mt-1">
            {total} transaksi tercatat
          </p>
        </div>
        <Button onClick={openCreateForm} id="add-transaction-btn">
          <Plus className="h-4 w-4 mr-2" /> Tambah Transaksi
        </Button>
      </div>

      {/* Search & Filters */}
      <Card className="glass-card animate-fade-in animate-delay-100">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari transaksi..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
                id="search-transactions"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="sm:w-auto"
            >
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
            {(filterType || filterCategory) && (
              <Button variant="ghost" onClick={clearFilters} size="sm">
                <X className="h-4 w-4 mr-1" /> Hapus Filter
              </Button>
            )}
          </div>

          {showFilters && (
            <div className="flex flex-col sm:flex-row gap-3 mt-3 pt-3 border-t border-white/[0.06]">
              <Select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setPage(1);
                }}
                options={[
                  { value: "INCOME", label: "Pemasukan" },
                  { value: "EXPENSE", label: "Pengeluaran" },
                ]}
                placeholder="Semua Tipe"
                className="sm:w-48"
              />
              <Select
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  setPage(1);
                }}
                options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                placeholder="Semua Kategori"
                className="sm:w-48"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="glass-card animate-fade-in animate-delay-200">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : transactions.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                        Deskripsi
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                        Kategori
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                        Tanggal
                      </th>
                      <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                        Jumlah
                      </th>
                      <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
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
                            <span className="text-sm font-medium">
                              {tx.description}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.06] text-muted-foreground">
                            {tx.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {formatDateShort(tx.date)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`text-sm font-semibold ${
                              tx.type === "INCOME"
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {tx.type === "INCOME" ? "+" : "-"}
                            {formatRupiah(tx.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditForm(tx)}
                              className="p-2 rounded-lg hover:bg-white/[0.06] text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(tx.id)}
                              className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile List */}
              <div className="md:hidden divide-y divide-white/[0.06]">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
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
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {tx.category} · {formatDateShort(tx.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <span
                        className={`text-sm font-semibold whitespace-nowrap ${
                          tx.type === "INCOME"
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {tx.type === "INCOME" ? "+" : "-"}
                        {formatRupiah(tx.amount)}
                      </span>
                      <button
                        onClick={() => openEditForm(tx)}
                        className="p-1.5 rounded hover:bg-white/[0.06] text-muted-foreground"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(tx.id)}
                        className="p-1.5 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06]">
                  <p className="text-sm text-muted-foreground">
                    Halaman {page} dari {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-sm mb-4">Belum ada transaksi yang tercatat.</p>
              <Button onClick={openCreateForm} variant="outline">
                <Plus className="h-4 w-4 mr-2" /> Tambah Transaksi Pertama
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent onClose={() => setShowForm(false)}>
          <DialogHeader>
            <DialogTitle>
              {editingTx ? "Edit Transaksi" : "Tambah Transaksi"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, type: "EXPENSE" }))}
                className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                  formData.type === "EXPENSE"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-white/[0.03] text-muted-foreground border border-white/[0.06] hover:bg-white/[0.06]"
                }`}
              >
                Pengeluaran
              </button>
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, type: "INCOME" }))}
                className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                  formData.type === "INCOME"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-white/[0.03] text-muted-foreground border border-white/[0.06] hover:bg-white/[0.06]"
                }`}
              >
                Pemasukan
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Input
                id="description"
                placeholder="Contoh: Makan siang di warteg"
                value={formData.description}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, description: e.target.value }))
                }
                required
              />
            </div>

            {/* Category with AI auto-categorize */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="category">Kategori</Label>
                <button
                  type="button"
                  onClick={handleAutoCategorize}
                  disabled={isCategorizing}
                  className="text-xs text-primary hover:underline flex items-center gap-1 disabled:opacity-50"
                >
                  <Sparkles className="h-3 w-3" />
                  {isCategorizing ? "Memproses..." : "Auto AI"}
                </button>
              </div>
              <Select
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, category: e.target.value }))
                }
                options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                placeholder="Pilih kategori"
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Jumlah (Rp)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                min="1"
                value={formData.amount || ""}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    amount: parseFloat(e.target.value) || 0,
                  }))
                }
                required
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, date: e.target.value }))
                }
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button type="submit" isLoading={isSubmitting} className="flex-1">
                {editingTx ? "Simpan" : "Tambah"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!showDeleteConfirm}
        onOpenChange={() => setShowDeleteConfirm(null)}
      >
        <DialogContent onClose={() => setShowDeleteConfirm(null)} className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Transaksi?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Transaksi yang dihapus tidak dapat dikembalikan.
          </p>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(null)}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
              className="flex-1"
            >
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
