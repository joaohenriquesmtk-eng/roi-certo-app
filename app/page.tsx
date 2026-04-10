"use client";

import { useState } from "react";

export default function ROICerto() {
  const [loading, setLoading] = useState(false);
  
  // Variáveis Agronômicas e Dinâmicas
  const [cultura, setCultura] = useState("Soja");
  const [regiaoSolo, setRegiaoSolo] = useState("Cerrado (Latossolo Argiloso)"); // <--- NOVA VARIÁVEL
  const [produtividade, setProdutividade] = useState("");
  const [fosforo, setFosforo] = useState("");
  const [potassio, setPotassio] = useState("");
  
  // Variáveis Financeiras
  const [precoMap, setPrecoMap] = useState("");
  const [precoKcl, setPrecoKcl] = useState("");
  const [precoUreia, setPrecoUreia] = useState(""); 
  const [precoCommodity, setPrecoCommodity] = useState(""); 

  // Variáveis de Saída (JSON da IA)
  const [roi, setRoi] = useState<string | null>(null);
  const [equilibrio, setEquilibrio] = useState<string | null>(null);
  const [insights, setInsights] = useState<string | null>(null);

  // Lógica Dinâmica de Unidades
  const precisaUreia = cultura === "Milho Safrinha" || cultura === "Algodão";
  const unidadeProd = cultura === "Algodão" ? "@/ha" : "sc/ha";
  const unidadePreco = cultura === "Algodão" ? "R$/@" : "R$/sc";

  const handleCalcular = async () => {
    if (!produtividade || !fosforo || !potassio || !precoMap || !precoKcl || !precoCommodity || (precisaUreia && !precoUreia)) {
      setInsights("Por favor, preencha todos os campos obrigatórios para a cultura selecionada.");
      return;
    }

    setLoading(true);
    setInsights(`Processando viabilidade para ${cultura} em ${regiaoSolo}... Calculando fixação/lixiviação e cruzando cotações.`);
    setRoi(null);
    setEquilibrio(null);

    try {
      const resposta = await fetch("/api/viabilidade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          cultura, regiaoSolo, produtividade, fosforo, potassio, precoMap, precoKcl, precoUreia, precoCommodity, unidadeProd, unidadePreco
        }),
      });

      const dados = await resposta.json();
      if (dados.sucesso) {
        setRoi(dados.dadosFinanceiros.roi);
        setEquilibrio(dados.dadosFinanceiros.pontoEquilibrio);
        setInsights(dados.dadosFinanceiros.analise);
      } else {
        setInsights("Erro na análise: " + dados.erro);
      }
    } catch (error) {
      setInsights("Falha na comunicação com o servidor. Verifique se o backend está respondendo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&family=Inter:wght@400;500;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>

      <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen pb-32 font-['Inter'] overflow-x-hidden selection:bg-[#4edea3] selection:text-[#002f1e]">
        
        <header className="fixed top-0 w-full z-50 bg-[#f7f9fb]/90 backdrop-blur-xl shadow-sm flex justify-between items-center px-6 py-4">
          <div className="w-full max-w-2xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-[#002366] text-3xl">query_stats</span>
              <h1 className="text-xl font-black tracking-tighter text-[#002366] font-['Manrope']">ROI Certo</h1>
            </div>
          </div>
        </header>

        <main className="pt-28 px-6 max-w-2xl mx-auto space-y-8">
          <section className="space-y-2">
            <p className="text-[#444650] font-bold tracking-widest text-xs uppercase">Inteligência de Campo</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#00113a] font-['Manrope']">Análise de Rentabilidade</h2>
          </section>

          <div className="bg-[#f2f4f6] rounded-2xl p-6 space-y-6 shadow-sm border border-[#e6e8ea]">
            
            {/* Linha Dinâmica: Cultura e Solo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 border-b border-[#c5c6d2] pb-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#002366] tracking-wider uppercase px-1">Cultura Alvo</label>
                <select 
                  value={cultura} 
                  onChange={(e) => setCultura(e.target.value)}
                  className="w-full bg-[#ffffff] border-2 border-[#dbe1ff] rounded-xl py-4 px-4 text-[#00174a] focus:ring-2 focus:ring-[#435b9f]/50 font-bold outline-none cursor-pointer"
                >
                  <option value="Soja">Soja (Verão)</option>
                  <option value="Milho Safrinha">Milho Safrinha</option>
                  <option value="Algodão">Algodão (Pluma)</option>
                  <option value="Trigo">Trigo</option>
                  <option value="Sorgo">Sorgo</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#002366] tracking-wider uppercase px-1">Região / Textura do Solo</label>
                <select 
                  value={regiaoSolo} 
                  onChange={(e) => setRegiaoSolo(e.target.value)}
                  className="w-full bg-[#ffffff] border-2 border-[#dbe1ff] rounded-xl py-4 px-4 text-[#00174a] focus:ring-2 focus:ring-[#435b9f]/50 font-bold outline-none cursor-pointer"
                >
                  <option value="Cerrado (Latossolo Argiloso)">Cerrado (Latossolo Argiloso)</option>
                  <option value="Cerrado/Matopiba (Neossolo Arenoso)">Matopiba/Cerrado (Arenoso)</option>
                  <option value="Sul (Nitossolo Vermelho)">Sul (Nitossolo Vermelho Argiloso)</option>
                  <option value="Sudeste (Argissolo)">Sudeste (Argissolo)</option>
                  <option value="Norte (Latossolo Amarelo)">Norte (Latossolo Amarelo)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#444650] tracking-wider uppercase px-1">Expectativa Prod. ({unidadeProd})</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none material-symbols-outlined text-[#757682]">agriculture</span>
                  <input value={produtividade} onChange={(e)=>setProdutividade(e.target.value)} type="number" placeholder="Ex: 75.5" className="w-full bg-[#ffffff] border-none rounded-xl py-4 pl-12 pr-6 text-[#191c1e] focus:ring-2 focus:ring-[#435b9f]/50 font-medium placeholder:text-[#c5c6d2] outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#444650] tracking-wider uppercase px-1">Cotação Atual ({unidadePreco})</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none material-symbols-outlined text-[#757682]">trending_up</span>
                  <input value={precoCommodity} onChange={(e)=>setPrecoCommodity(e.target.value)} type="number" placeholder="Ex: 135.50" className="w-full bg-[#ffffff] border-none rounded-xl py-4 pl-12 pr-6 text-[#191c1e] focus:ring-2 focus:ring-[#435b9f]/50 font-medium placeholder:text-[#c5c6d2] outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#444650] tracking-wider uppercase px-1">Fósforo (P) Mehlich (mg/dm³)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none material-symbols-outlined text-[#757682]">science</span>
                  <input value={fosforo} onChange={(e)=>setFosforo(e.target.value)} type="number" placeholder="Ex: 15.0" className="w-full bg-[#ffffff] border-none rounded-xl py-4 pl-12 pr-6 text-[#191c1e] focus:ring-2 focus:ring-[#435b9f]/50 font-medium placeholder:text-[#c5c6d2] outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#444650] tracking-wider uppercase px-1">Potássio (K) (cmolc/dm³)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none material-symbols-outlined text-[#757682]">biotech</span>
                  <input value={potassio} onChange={(e)=>setPotassio(e.target.value)} type="number" placeholder="Ex: 0.15" className="w-full bg-[#ffffff] border-none rounded-xl py-4 pl-12 pr-6 text-[#191c1e] focus:ring-2 focus:ring-[#435b9f]/50 font-medium placeholder:text-[#c5c6d2] outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#444650] tracking-wider uppercase px-1">Preço do MAP (R$/ton)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none material-symbols-outlined text-[#757682]">payments</span>
                  <input value={precoMap} onChange={(e)=>setPrecoMap(e.target.value)} type="number" placeholder="Ex: 4500.00" className="w-full bg-[#ffffff] border-none rounded-xl py-4 pl-12 pr-6 text-[#191c1e] focus:ring-2 focus:ring-[#435b9f]/50 font-medium placeholder:text-[#c5c6d2] outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#444650] tracking-wider uppercase px-1">Preço do KCl (R$/ton)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none material-symbols-outlined text-[#757682]">universal_currency_alt</span>
                  <input value={precoKcl} onChange={(e)=>setPrecoKcl(e.target.value)} type="number" placeholder="Ex: 3800.00" className="w-full bg-[#ffffff] border-none rounded-xl py-4 pl-12 pr-6 text-[#191c1e] focus:ring-2 focus:ring-[#435b9f]/50 font-medium placeholder:text-[#c5c6d2] outline-none" />
                </div>
              </div>

              {precisaUreia && (
                <div className="space-y-2 md:col-span-2 border-t border-[#c5c6d2] pt-4 mt-2">
                  <label className="block text-xs font-bold text-[#005236] tracking-wider uppercase px-1">Preço da Ureia / Nitrogênio (R$/ton)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none material-symbols-outlined text-[#4edea3]">water_drop</span>
                    <input value={precoUreia} onChange={(e)=>setPrecoUreia(e.target.value)} type="number" placeholder="Obrigatório para gramíneas e algodão" className="w-full bg-[#ffffff] border-none rounded-xl py-4 pl-12 pr-6 text-[#191c1e] focus:ring-2 focus:ring-[#4edea3]/50 font-medium placeholder:text-[#c5c6d2] outline-none" />
                  </div>
                </div>
              )}
            </div>

            <button onClick={handleCalcular} disabled={loading} className="w-full mt-4 bg-gradient-to-r from-[#4edea3] to-[#00a371] text-white font-extrabold py-5 rounded-xl shadow-[0px_8px_24px_rgba(78,222,163,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                {loading ? "hourglass_top" : "calculate"}
              </span>
              {loading ? "Executando Modelo Matemático..." : "Calcular Viabilidade Econômica"}
            </button>
          </div>

          <section className="bg-white rounded-2xl overflow-hidden shadow-lg border border-[#e6e8ea]">
            <div className="bg-[#00113a] px-6 py-5 flex justify-between items-center">
              <h3 className="text-white font-bold tracking-tight text-lg font-['Manrope']">Relatório de Viabilidade</h3>
              <span className="material-symbols-outlined text-[#4edea3]">analytics</span>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#f2f4f6] p-4 rounded-xl border-l-4 border-[#4edea3]">
                  <p className="text-[10px] uppercase font-bold text-[#444650] mb-1">ROI Estimado</p>
                  <p className="text-2xl font-black text-[#00113a]">{roi || "--"}</p>
                </div>
                <div className="bg-[#f2f4f6] p-4 rounded-xl border-l-4 border-[#002366]">
                  <p className="text-[10px] uppercase font-bold text-[#444650] mb-1">Equilíbrio (Custo)</p>
                  <p className="text-2xl font-black text-[#00113a]">{equilibrio || "--"}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#005236] border-b border-[#e6e8ea] pb-2">
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <span className="text-xs font-bold uppercase tracking-widest">Insights Estratégicos</span>
                </div>
                <div className="text-[#444650] leading-relaxed font-medium whitespace-pre-wrap">
                  {insights || "Preencha o formulário acima e processe o laudo para obter o diagnóstico agronômico e financeiro cruzado."}
                </div>
              </div>
            </div>
          </section>
          {/* Assinatura do Desenvolvedor */}
          <div className="w-full text-center pt-8 pb-4 border-t border-[#e6e8ea] mt-8">
            <p className="text-xs text-[#626567] font-['Inter']">
              Idealizado e desenvolvido por <a href="https://www.linkedin.com/in/joaohenriquedasilva-agronomo/" target="_blank" rel="noopener noreferrer" className="font-bold text-[#002366] hover:text-[#4edea3] transition-colors">Eng. Agr. João</a>
            </p>
            <p className="text-[10px] text-[#a8abb0] mt-1">© {new Date().getFullYear()} Vigor IA & ROI Certo. Todos os direitos reservados.</p>
          </div>
        </main>
      </div>
    </>
  );
}