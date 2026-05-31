"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Search, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useTransactionStore } from "@/store/transactions";
import { AddTransactionModal } from "@/components/features/transactions/AddTransactionModal";
import { CATEGORY_CONFIG } from "@/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { TransactionType } from "@/types";

export default function TransactionsPage() {
  const { transactions, fetchTransactions, deleteTransaction, loading } = useTransactionStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TransactionType | "all">("all");

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const filtered = transactions.filter((t) => {
    const matchSearch = t.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || t.type === filter;
    return matchSearch && matchFilter;
  });

  async function handleDelete(id: string) {
    if (!confirm("Deletar esta transação?")) return;
    try {
      await deleteTransaction(id);
      toast.success("Transação deletada");
    } catch { toast.error("Erro ao deletar"); }
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Transações</h1>
          <p className="mt-1 text-sm text-text-secondary">{transactions.length} transações registradas</p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity">
          <Plus size={15} /> Nova transação
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar transações…"
            className="w-full rounded-lg border border-border bg-surface-secondary py-2 pl-8 pr-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors"
          />
        </div>
        <div className="flex rounded-lg border border-border bg-surface-secondary p-1">
          {(["all", "income", "expense"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                filter === f ? "bg-accent text-white" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {f === "all" ? "Todos" : f === "income" ? "Receitas" : "Despesas"}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="card divide-y divide-border p-0 overflow-hidden">
        {loading ? (
          <div className="p-5 text-center text-sm text-text-tertiary">Carregando…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-text-tertiary">
            {search ? "Nenhuma transação encontrada." : "Nenhuma transação ainda."}
          </div>
        ) : (
          filtered.map((tx, i) => {
            const config = CATEGORY_CONFIG[tx.category];
            return (
              <motion.div key={tx.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="group flex items-center gap-4 p-4 transition-colors hover:bg-surface-secondary"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-tertiary text-lg">
                  {config.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-text-primary">{tx.description}</p>
                  <p className="text-xs text-text-tertiary">{config.label} · {formatDate(tx.date)}</p>
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${tx.type === "income" ? "text-income" : "text-expense"}`}>
                  {tx.type === "income" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {formatCurrency(tx.amount)}
                </div>
                <button onClick={() => handleDelete(tx.id)}
                  className="ml-2 rounded-lg p-1.5 text-text-tertiary opacity-0 transition-all group-hover:opacity-100 hover:bg-expense/10 hover:text-expense">
                  <Trash2 size={14} />
                </button>
              </motion.div>
            );
          })
        )}
      </div>

      <AddTransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
