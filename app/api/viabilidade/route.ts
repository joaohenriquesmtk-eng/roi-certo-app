export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) return NextResponse.json({ erro: "Chave ausente na variável de ambiente." }, { status: 500 });

    const dados = await req.json();
    const { cultura, regiaoSolo, produtividade, fosforo, potassio, precoMap, precoKcl, precoUreia, precoCommodity, unidadeProd, unidadePreco } = dados;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
    
    const regraNitrogenio = (cultura === "Soja" || cultura === "Feijão")
      ? "Considere FBN (Fixação Biológica). Não inclua custo de Nitrogênio na base mineral."
      : `Adicione o custo da Ureia (45% N) cotada a R$ ${precoUreia} / ton para suprir a extração/exportação de ${produtividade} ${unidadeProd} de ${cultura}.`;

    const promptFinanceiro = `
Atue como um Consultor Agroeconômico Sênior e Especialista em Solos do Brasil.
Faça o cálculo de viabilidade econômica de adubação macronutricional considerando a capacidade tampão e a textura do solo.

**DADOS DO TALHÃO E MERCADO:**
- Cultura: ${cultura}
- Produtividade Alvo: ${produtividade} ${unidadeProd}
- Região/Tipo de Solo: ${regiaoSolo}
- Fósforo (P) no solo (Mehlich): ${fosforo} mg/dm³
- Potássio (K) no solo: ${potassio} cmolc/dm³
- Preço MAP: R$ ${precoMap} / ton
- Preço KCl: R$ ${precoKcl} / ton
- Cotação da Cultura: ${unidadePreco} ${precoCommodity}
- Manejo de N: ${regraNitrogenio}

**PASSO A PASSO LÓGICO MENTAL (NÃO EXIBA O CÁLCULO BRUTO):**
1. Considere a dinâmica do solo: Se for Latossolo Argiloso (Cerrado), pondere a alta fixação de P (exigindo dose maior corretiva se P estiver baixo). Se for Neossolo Arenoso, pondere a lixiviação de K (recomendando parcelamento no texto) e menor capacidade tampão.
2. Formule a recomendação em kg/ha de MAP, KCl e Ureia (se aplicável).
3. Calcule o custo total da operação em R$/ha.
4. Divida o custo pelo preço da commodity para achar o Ponto de Equilíbrio em ${unidadeProd}.
5. Calcule o ROI estimado: ((Receita Bruta Esperada - Custo da Adubação) / Custo da Adubação) * 100.

**REGRA ABSOLUTA DE SAÍDA (Obrigatoriamente um objeto JSON puro, sem formatação markdown ou blocos \`\`\`json):**
{
  "roi": "Ex: 154%",
  "pontoEquilibrio": "Ex: 22.5 ${unidadeProd}",
  "analise": "Texto corporativo explicando a recomendação. OBRIGATÓRIO citar como o tipo de solo (${regiaoSolo}) afeta a decisão técnica da dose recomendada de Fósforo ou Potássio. Avalie se a relação de troca atual favorece o investimento."
}
`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptFinanceiro }] }]
      })
    });

    const result = await response.json();
    if (!response.ok) return NextResponse.json({ erro: `Google diz: ${JSON.stringify(result)}` }, { status: response.status });

    const respostaBruta = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const textoJson = respostaBruta.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let dadosFinanceiros;
    try {
      dadosFinanceiros = JSON.parse(textoJson);
    } catch (e) {
      return NextResponse.json({ sucesso: false, erro: "Falha ao processar matriz de dados da IA." });
    }

    return NextResponse.json({ sucesso: true, dadosFinanceiros });

  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}