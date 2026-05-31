"use client";

import { useEffect, useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/features/dashboard/StatCard";
import { RecentTransactions } from "@/components/features/dashboard/RecentTransactions";
import { AddTransactionModal } from "@/components/features/transactions/AddTransactionModal";
import { useTransactionStore } from "@/store/transactions";
import { getCurrentMonthRange } from "@/lib/utils";

export default function DashboardPage() {
  const { transactions, fetchTransactions, loading } = useTransactionStore();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const { start, end } = getCurrentMonthRange();
  const monthTxs = transactions.filter((t) => t.date >= start && t.date <= end);
  const monthIncome  = monthTxs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const monthExpense = monthTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const totalBalance = transactions.reduce((s, t) => t.type === "income" ? s + t.amount : s - t.amount, 0);
  const savingsRate  = monthIncome > 0 ? ((monthIncome - monthExpense) / monthIncome) * 100 : 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-text-primary">
            {greeting} 👋
          </motion.h1>
          <p className="mt-1 text-sm text-text-secondary">Aqui está o resumo das suas finanças</p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
          <Plus size={15} /> Nova transação
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Saldo total"     value={totalBalance}  type="balance"  index={0} />
        <StatCard title="Receitas do mês" value={monthIncome}   type="income"   index={1} />
        <StatCard title="Gastos do mês"   value={monthExpense}  type="expense"  index={2} />
        <StatCard title="Taxa de economia" value={savingsRate}  type="savings"  index={3} />
      </div>

      {/* AI tip banner */}
      {transactions.length > 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="mb-6 flex items-start gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4">
          <Sparkles size={16} className="mt-0.5 shrink-0 text-accent" />
          <div>
            <p className="text-sm font-medium text-text-primary">Insight de IA</p>
            <p className="text-sm text-text-secondary">
              {savingsRate >= 20
                ? `Parabéns! Você está economizando ${savingsRate.toFixed(1)}% da sua renda este mês. Continue assim!`
                : monthExpense > monthIncome
                ? "Atenção: seus gastos estão maiores que suas receitas este mês. Veja a aba Análises para entender onde reduzir."
                : "Acesse a aba Análises para ver um relatório completo gerado por IA das suas finanças."}
            </p>
          </div>
        </motion.div>
      )}

      {/* Recent transactions */}
      {loading ? (
        <div className="card animate-pulse">
          <div className="mb-4 h-4 w-32 rounded bg-surface-tertiary" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="mb-2 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-surface-tertiary" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-3/4 rounded bg-surface-tertiary" />
                <div className="h-2.5 w-1/2 rounded bg-surface-tertiary" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <RecentTransactions transactions={transactions} />
      )}

      <AddTransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
