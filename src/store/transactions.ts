import { create } from "zustand";
import type { Transaction, TransactionInsert } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface TransactionStore {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  addTransaction: (data: TransactionInsert) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  loading: false,
  error: null,

  fetchTransactions: async () => {
    set({ loading: true, error: null });
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      set({ transactions: data || [] });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Erro ao buscar transações" });
    } finally {
      set({ loading: false });
    }
  },

  addTransaction: async (data) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");

      const { data: newTx, error } = await supabase
        .from("transactions")
        .insert({ ...data, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ transactions: [newTx, ...state.transactions] }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Erro ao adicionar transação" });
      throw err;
    }
  },

  deleteTransaction: async (id) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Erro ao deletar transação" });
      throw err;
    }
  },
}));
