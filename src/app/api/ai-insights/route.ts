import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { totalIncome, totalExpense, topCategories, savingsRate } = await request.json();

    const prompt = `Você é um consultor financeiro pessoal. Analise estes dados financeiros e retorne EXATAMENTE um JSON com a chave "insights" contendo um array de 3 objetos. Cada objeto deve ter: "type" (uma das opções: "tip", "warning", "achievement"), "title" (máximo 8 palavras) e "description" (máximo 2 frases, em português).

Dados:
- Receita total: R$ ${totalIncome.toFixed(2)}
- Gasto total: R$ ${totalExpense.toFixed(2)}
- Taxa de economia: ${savingsRate.toFixed(1)}%
- Principais categorias de gasto: ${topCategories.map((c: { name: string; value: number }) => `${c.name} (R$ ${c.value.toFixed(2)})`).join(", ")}

Retorne APENAS o JSON, sem markdown, sem explicações.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 600,
    });

    const content = response.choices[0]?.message?.content || "";
    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("AI insights error:", err);
    return NextResponse.json({ insights: [] }, { status: 500 });
  }
}
