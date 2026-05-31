"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useTransactionStore } from "@/store/transactions";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, CATEGORY_CONFIG } from "@/constants";
import type { TransactionType } from "@/types";

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddTransactionModal({ open, onClose }: AddTransactionModalProps) {
  const { addTransaction } = useTransactionStore();
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) { toast.error("Valor inválido"); return; }
    setLoading(true);
    try {
      await addTransaction({
        type, amount: parseFloat(amount), description, date,
        category: category as typeof categories[number],
      });
      toast.success("Transação adicionada!");
      setAmount(""); setDescription(""); onClose();
    } catch {
      toast.error("Erro ao adicionar transação");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />

          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-md -translate-y-1/2 rounded-2xl border border-border bg-surface-secondary p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-text-primary">Nova transação</h2>
              <button onClick={onClose} className="rounded-lg p-1.5 text-text-tertiary hover:bg-surface-tertiary hover:text-text-primary">
                <X size={16} />
              </button>
            </div>

            {/* Type toggle */}
            <div className="mb-4 flex rounded-lg border border-border bg-surface p-1">
              {(["expense", "income"] as TransactionType[]).map((t) => (
                <button key={t} type="button" onClick={() => { setType(t); setCategory(t === "income" ? "salary" : "food"); }}
                  className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
                    type === t
                      ? t === "income" ? "bg-income/20 text-income" : "bg-expense/20 text-expense"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {t === "income" ? "Receita" : "Despesa"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Valor (R$)</label>
                <input type="number" required min="0.01" step="0.01" value={amount}
                  onChange={(e) => setAmount(e.target.value)} placeholder="0,00" className={inputCls} />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Descrição</label>
                <input type="text" required value={description}
                  onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Almoço, Salário..." className={inputCls} />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Categoria</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
                  {categories.map((c) => (
                    <option key={c} value={c}>{CATEGORY_CONFIG[c].emoji} {CATEGORY_CONFIG[c].label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Data</label>
                <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
              </div>

              <button type="submit" disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50">
                <Plus size={15} />
                {loading ? "Adicionando…" : "Adicionar transação"}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
