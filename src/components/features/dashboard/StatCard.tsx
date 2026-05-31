"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, Percent } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  type: "balance" | "income" | "expense" | "savings";
  index?: number;
}

const CONFIG = {
  balance:  { icon: Wallet,       label: "Saldo total",    color: "text-text-primary",  bg: "bg-surface-tertiary" },
  income:   { icon: TrendingUp,   label: "Receitas do mês", color: "text-income",        bg: "bg-income" },
  expense:  { icon: TrendingDown, label: "Gastos do mês",  color: "text-expense",       bg: "bg-expense" },
  savings:  { icon: Percent,      label: "Taxa de economia", color: "text-accent",       bg: "bg-accent-muted" },
};

export function StatCard({ title, value, type, index = 0 }: StatCardProps) {
  const { icon: Icon, color, bg } = CONFIG[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="card"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-text-tertiary">{title}</span>
        <div className={cn("rounded-lg p-1.5", bg)}>
          <Icon size={14} className={color} />
        </div>
      </div>
      <p className={cn("text-2xl font-bold", color)}>
        {type === "savings" ? `${value.toFixed(1)}%` : formatCurrency(value)}
      </p>
    </motion.div>
  );
}
