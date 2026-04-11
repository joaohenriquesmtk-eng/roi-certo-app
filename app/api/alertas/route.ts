export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) return NextResponse.json({ erro: "Chave ausente." }, { status: 500 });

    const dados = await req.json();
    const { cidade, estado } = dados;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
    
    // O comando focado puramente em Mercado e Dinheiro
    const prompt = `Atue como um Analista de Inteligência de Mercado Agro. 
O usuário está visualizando o sistema na região de ${cidade} (${estado}). 
Gere um alerta econômico curto (máximo de 3 linhas) focado na cotação de commodities (soja/milho) ou mercado de fertilizantes (MAP, KCl, Ureia) impactando essa região hoje. Seja executivo. Recomende travamento de custo ou venda antecipada. 
NÃO use saudações. Retorne APENAS o texto direto do alerta financeiro.`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const result = await response.json();
    if (!response.ok) return NextResponse.json({ erro: "Falha na IA" }, { status: response.status });

    const alertaTexto = result.candidates?.[0]?.content?.parts?.[0]?.text || "Mercado de commodities estável na sua região hoje.";

    return NextResponse.json({ sucesso: true, alerta: alertaTexto, cidade: cidade });

  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}