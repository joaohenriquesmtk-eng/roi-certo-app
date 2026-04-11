# 📈 ROI Certo - Motor de Viabilidade Agroeconômica

**Acesso ao Sistema:** [roi-certo-app.vercel.app](https://roi-certo-app.vercel.app)

## 📌 Visão Executiva
O **ROI Certo** é uma ferramenta de inteligência financeira criada para blindar o teto produtivo de grandes operações agrícolas. O sistema cruza dados de análise de solo (Fósforo e Potássio) com a cotação em tempo real de fertilizantes macronutricionais e commodities, entregando um diagnóstico preciso sobre o Retorno sobre o Investimento (ROI), o Ponto de Equilíbrio (Break-even) da adubação e insights estratégicos para a safra.

## 🚀 Arquitetura e Funcionalidades
- **Modelagem Dinâmica de Solo e Nutrição:** O algoritmo distingue a alta capacidade de fixação de P em Latossolos Argilosos da alta lixiviação de K em Neossolos Arenosos. Além disso, possui lógica reativa de Nitrogênio: isenta a Soja (devido à FBN) e exige parâmetros de Ureia automaticamente para culturas de alta demanda (Milho Safrinha, Algodão, Trigo e Sorgo).
- **Radar de Mercado (Tempo Real):** Integração engenhosa com API de IP (geolocalização silenciosa) e LLM para rastrear a região do usuário e formular recomendações financeiras dinâmicas (travamento de custos, tendências cambiais ou venda antecipada) baseadas na volatilidade do mercado local.
- **Interface Executiva Reativa:** Renderização condicional construída com foco em UX para gestores e diretores (C-Level), entregando os números exatos sem atritos, além de um modal integrado de portfólio do Arquiteto do Sistema.

## 🛠️ Stack Tecnológico
- **Frontend:** React.js, Next.js (App Router), Tailwind CSS (Light Mode Corporativo).
- **Backend/API:** Next.js API Routes (Serverless Functions).
- **Inteligência Artificial:** Google Gemini (LLM treinado com prompt system financeiro/agronômico, com output estrito em matriz JSON).
- **Deploy & Infraestrutura:** Vercel (Hospedagem em nuvem) e GitHub (Controle de Versão).

---
*Idealizado e arquitetado por **João Henrique da Silva** (Engenheiro Agrônomo).* [Conecte-se no LinkedIn](https://www.linkedin.com/in/joaohenriquedasilva-agronomo/)