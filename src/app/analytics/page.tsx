"use client";

import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { useTransactionStore } from "@/store/transactions";
import { CATEGORY_CONFIG, MONTHS_PT } from "@/constants";
import { formatCurrency } from "@/lib/utils";
import type { AIInsight } from "@/types";

export default function AnalyticsPage() {
  const { transactions, fetchTransactions } = useTransactionStore();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  // Dados para gráfico de barras (últimos 6 meses)
  const barData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const year = d.getFullYear();
    const month = d.getMonth();
    const txs = transactions.filter((t) => {
      const td = new Date(t.date);
      return td.getFullYear() === year && td.getMonth() === month;
    });
    return {
      name: MONTHS_PT[month],
      Receitas: txs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
      Gastos: txs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    };
  });

  // Dados para gráfico de pizza (gastos por categoria)
  const expenseByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieData = Object.entries(expenseByCategory)
    .map(([cat, value]) => ({
      name: CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG]?.label || cat,
      value,
      color: CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG]?.color || "#888",
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Totais gerais
  const totalIncome  = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  async function fetchAIInsights() {
    if (transactions.length < 2) return;
    setLoadingInsights(true);
    try {
      const res = await fetch("/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalIncome, totalExpense,
          topCategories: pieData.slice(0, 3).map((d) => ({ name: d.name, value: d.value })),
          savingsRate: totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0,
        }),
      });
      const data = await res.json();
      setInsights(data.insights || []);
    } catch {
      // fallback: insights locais sem IA
      setInsights([
        {
          type: totalExpense > totalIncome ? "warning" : "achievement",
          title: totalExpense > totalIncome ? "Gastos acima das receitas" : "Saldo positivo!",
          description: totalExpense > totalIncome
            ? "Seus gastos estão maiores que suas receitas. Revise suas despesas maiores."
            : `Você tem um saldo positivo de ${formatCurrency(totalIncome - totalExpense)}. Continue assim!`,
        },
        {
          type: "tip",
          title: "Dica de economia",
          description: pieData[0]
            ? `Sua maior categoria de gasto é "${pieData[0].name}" com ${formatCurrency(pieData[0].value)}. Considere reduzir nessa área.`
            : "Adicione mais transações para receber dicas personalizadas.",
        },
      ]);
    } finally {
      setLoadingInsights(false);
    }
  }

  const INSIGHT_STYLE = {
    tip:         { border: "border-accent/20",   bg: "bg-accent/5",   text: "text-accent" },
    warning:     { border: "border-expense/20",  bg: "bg-expense/5",  text: "text-expense" },
    achievement: { border: "border-income/20",   bg: "bg-income/5",   text: "text-income" },
  };

  const tooltipStyle = {
    backgroundColor: "hsl(220 13% 11%)",
    border: "1px solid hsl(220 13% 20%)",
    borderRadius: "8px",
    fontSize: "12px",
    color: "hsl(0 0% 96%)",
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Análises</h1>
        <p className="mt-1 text-sm text-text-secondary">Visualize seus padrões financeiros</p>
      </div>

      {/* Receitas vs Gastos — barras */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card mb-6">
        <h2 className="mb-4 text-sm font-semibold text-text-primary">Receitas vs Gastos (6 meses)</h2>
        {transactions.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-sm text-text-tertiary">
            Adicione transações para ver o gráfico
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barCategoryGap="30%">
              <XAxis dataKey="name" tick={{ fill: "hsl(0 0% 40%)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(0 0% 40%)", fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
              <Bar dataKey="Receitas" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Gastos"   fill="hsl(0 84% 60%)"   radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      <div className="mb-6 grid gap-6 md:grid-cols-2">
        {/* Pizza de gastos */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
          <h2 className="mb-4 text-sm font-semibold text-text-primary">Gastos por categoria</h2>
          {pieData.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-text-tertiary">
              Nenhuma despesa registrada
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                  paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
                <Legend iconType="circle" iconSize={8}
                  formatter={(v) => <span style={{ fontSize: 12, color: "hsl(0 0% 60%)" }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Resumo */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card space-y-4">
          <h2 className="text-sm font-semibold text-text-primary">Resumo geral</h2>
          <div className="space-y-3">
            {[
              { label: "Total de receitas", value: totalIncome, icon: TrendingUp, color: "text-income" },
              { label: "Total de gastos",   value: totalExpense, icon: TrendingDown, color: "text-expense" },
              { label: "Saldo acumulado",   value: totalIncome - totalExpense, icon: TrendingUp, color: totalIncome >= totalExpense ? "text-income" : "text-expense" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg bg-surface p-3">
                <div className="flex items-center gap-2">
                  <item.icon size={14} className={item.color} />
                  <span className="text-sm text-text-secondary">{item.label}</span>
                </div>
                <span className={`text-sm font-bold ${item.color}`}>{formatCurrency(item.value)}</span>
              </div>
            ))}
            {totalIncome > 0 && (
              <div className="rounded-lg bg-accent/5 border border-accent/20 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Taxa de economia</span>
                  <span className="text-sm font-bold text-accent">
                    {(((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* AI Insights */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-accent" />
            <h2 className="text-sm font-semibold text-text-primary">Insights de IA</h2>
          </div>
          <button onClick={fetchAIInsights} disabled={loadingInsights || transactions.length < 2}
            className="flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/5 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/10 disabled:opacity-50">
            {loadingInsights ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
            {loadingInsights ? "Analisando…" : "Gerar análise"}
          </button>
        </div>

        {insights.length === 0 ? (
          <div className="py-8 text-center">
            <Sparkles size={28} className="mx-auto mb-3 text-text-tertiary" />
            <p className="text-sm font-medium text-text-primary">Análise personalizada com IA</p>
            <p className="mt-1 text-xs text-text-tertiary">
              {transactions.length < 2
                ? "Adicione pelo menos 2 transações para gerar insights"
                : "Clique em \"Gerar análise\" para receber dicas personalizadas"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight, i) => {
              const style = INSIGHT_STYLE[insight.type];
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-lg border p-4 ${style.border} ${style.bg}`}>
                  <p className={`mb-1 text-sm font-semibold ${style.text}`}>{insight.title}</p>
                  <p className="text-sm text-text-secondary">{insight.description}</p>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </>
  );
}
