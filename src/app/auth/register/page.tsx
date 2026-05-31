"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TrendingUp, Mail, Lock, User } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) { toast.error("Senha deve ter pelo menos 6 caracteres"); return; }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } },
      });
      if (error) throw error;
      toast.success("Conta criada! Verifique seu email.");
      router.push("/auth/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(hsl(var(--text-primary)) 1px,transparent 1px),linear-gradient(90deg,hsl(var(--text-primary)) 1px,transparent 1px)", backgroundSize: "50px 50px" }}
      />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 border border-accent/20">
            <TrendingUp size={22} className="text-accent" />
          </div>
          <h1 className="text-xl font-semibold text-text-primary">Criar conta</h1>
          <p className="mt-1 text-sm text-text-secondary">Comece a controlar suas finanças</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3">
          <div className="relative">
            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              className="w-full rounded-lg border border-border bg-surface-secondary py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors"
            />
          </div>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full rounded-lg border border-border bg-surface-secondary py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors"
            />
          </div>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha (mínimo 6 caracteres)"
              className="w-full rounded-lg border border-border bg-surface-secondary py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors"
            />
          </div>
          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50">
            {loading ? "Criando…" : "Criar conta"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-text-tertiary">
          Já tem conta?{" "}
          <Link href="/auth/login" className="text-accent hover:underline">Entrar</Link>
        </p>
      </motion.div>
    </div>
  );
}
