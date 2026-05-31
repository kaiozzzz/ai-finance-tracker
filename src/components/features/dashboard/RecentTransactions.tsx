"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CATEGORY_CONFIG } from "@/constants";
import type { Transaction } from "@/types";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const recent = transactions.slice(0, 6);

  return (
    <div className="card">
      <h3 className="mb-4 text-sm font-semibold text-text-primary">Transações recentes</h3>

      {recent.length === 0 ? (
        <div className="py-8 text-center text-sm text-text-tertiary">
          Nenhuma transação ainda. Adicione a primeira!
        </div>
      ) : (
        <div className="space-y-2">
          {recent.map((tx, i) => {
            const config = CATEGORY_CONFIG[tx.category];
            return (
              <motion.div key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-surface-tertiary"
              >
                <span className="text-lg">{config.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-text-primary">{tx.description}</p>
                  <p className="text-xs text-text-tertiary">{config.label} · {formatDate(tx.date)}</p>
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${tx.type === "income" ? "text-income" : "text-expense"}`}>
                  {tx.type === "income"
                    ? <ArrowUpRight size={14} />
                    : <ArrowDownRight size={14} />
                  }
                  {formatCurrency(tx.amount)}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
