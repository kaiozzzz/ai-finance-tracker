# AI Finance Tracker

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=flat-square&logo=openai)](https://openai.com)

Dashboard de controle financeiro pessoal com análise por IA, gráficos interativos e insights personalizados.

## Demonstração

🔗 **[finance-tracker.vercel.app](https://finance-tracker.vercel.app)**

## Funcionalidades

- Autenticação com email/senha e Google (Supabase Auth)
- Registro de receitas e despesas com categorias
- Dashboard com saldo, receitas, gastos e taxa de economia do mês
- Gráfico de barras: receitas vs gastos nos últimos 6 meses
- Gráfico de pizza: distribuição de gastos por categoria
- Insights gerados por IA (GPT-4o-mini) com análise personalizada
- Filtro e busca de transações
- Dados isolados por usuário com Row Level Security

## Stack

| Tecnologia | Uso |
|---|---|
| Next.js 14 (App Router) | Framework full stack |
| TypeScript | Tipagem estática |
| TailwindCSS | Estilização |
| Supabase | Banco PostgreSQL + Auth |
| OpenAI API | Geração de insights |
| Recharts | Gráficos interativos |
| Zustand | Estado global |
| Framer Motion | Animações |

## Como rodar localmente

```bash
# 1. Clone o repositório
git clone https://github.com/kaiozzzz/ai-finance-tracker.git
cd ai-finance-tracker

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite o .env.local com suas chaves

# 4. Configure o banco de dados
# Execute o arquivo supabase-schema.sql no Supabase SQL Editor

# 5. Rode o projeto
npm run dev
```

## Configuração do Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Execute o SQL em `supabase-schema.sql` no SQL Editor
3. Em **Authentication > Providers**, ative Google se quiser login social
4. Copie a URL e a Anon Key em **Settings > API** para o `.env.local`

## Estrutura de pastas

```
src/
├── app/
│   ├── auth/          # Login e registro
│   ├── dashboard/     # Página principal
│   ├── transactions/  # Lista de transações
│   ├── analytics/     # Gráficos e insights de IA
│   └── api/           # API Routes (AI insights)
├── components/
│   ├── layout/        # Sidebar
│   └── features/      # Componentes por feature
├── store/             # Zustand (estado global)
├── lib/               # Supabase client, utils
├── types/             # TypeScript interfaces
└── constants/         # Categorias e configurações
```
