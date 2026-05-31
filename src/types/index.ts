export type TransactionType = "income" | "expense";

export type TransactionCategory =
  | "salary" | "freelance" | "investment" | "other_income"
  | "food" | "transport" | "housing" | "health"
  | "education" | "entertainment" | "shopping" | "other_expense";

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  date: string;
  created_at: string;
}

export interface TransactionInsert {
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  date: string;
}

export interface MonthlySummary {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CategorySummary {
  category: TransactionCategory;
  total: number;
  count: number;
  percentage: number;
}

export interface AIInsight {
  type: "tip" | "warning" | "achievement";
  title: string;
  description: string;
}

export interface DashboardStats {
  totalBalance: number;
  monthIncome: number;
  monthExpense: number;
  savingsRate: number;
}
