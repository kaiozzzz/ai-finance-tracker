import type { TransactionCategory } from "@/types";

export const CATEGORY_CONFIG: Record<
  TransactionCategory,
  { label: string; color: string; emoji: string }
> = {
  // Receitas
  salary:        { label: "Salário",       color: "#22c55e", emoji: "💼" },
  freelance:     { label: "Freelance",     color: "#10b981", emoji: "💻" },
  investment:    { label: "Investimento",  color: "#06b6d4", emoji: "📈" },
  other_income:  { label: "Outra receita", color: "#84cc16", emoji: "💰" },
  // Despesas
  food:          { label: "Alimentação",   color: "#f97316", emoji: "🍔" },
  transport:     { label: "Transporte",    color: "#f59e0b", emoji: "🚗" },
  housing:       { label: "Moradia",       color: "#8b5cf6", emoji: "🏠" },
  health:        { label: "Saúde",         color: "#ec4899", emoji: "❤️" },
  education:     { label: "Educação",      color: "#3b82f6", emoji: "📚" },
  entertainment: { label: "Lazer",         color: "#a855f7", emoji: "🎮" },
  shopping:      { label: "Compras",       color: "#ef4444", emoji: "🛍️" },
  other_expense: { label: "Outra despesa", color: "#6b7280", emoji: "📦" },
};

export const INCOME_CATEGORIES: TransactionCategory[] = [
  "salary", "freelance", "investment", "other_income",
];

export const EXPENSE_CATEGORIES: TransactionCategory[] = [
  "food", "transport", "housing", "health",
  "education", "entertainment", "shopping", "other_expense",
];

export const MONTHS_PT = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];
