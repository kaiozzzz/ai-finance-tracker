-- Execute este SQL no Supabase SQL Editor
-- supabase.com > seu projeto > SQL Editor > New query

-- Tabela de transações
create table public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  type        text check (type in ('income', 'expense')) not null,
  category    text not null,
  amount      numeric(10, 2) not null check (amount > 0),
  description text not null,
  date        date not null,
  created_at  timestamptz default now() not null
);

-- Índices para performance
create index transactions_user_id_idx on public.transactions(user_id);
create index transactions_date_idx     on public.transactions(date desc);

-- Row Level Security — cada usuário só vê suas próprias transações
alter table public.transactions enable row level security;

create policy "Users can view own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own transactions"
  on public.transactions for delete
  using (auth.uid() = user_id);
