---
target: dashboard
total_score: 24
p0_count: 0
p1_count: 3
timestamp: 2026-06-18T19-57-32Z
slug: resources-js-pages-finance-dashboard-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Tones semânticos existem, mas mês e estado do orçamento pouco visíveis |
| 2 | Match System / Real World | 3 | Linguagem clara em PT-BR; título genérico "Dashboard do mês" |
| 3 | User Control and Freedom | 3 | Bottom nav ok; dashboard é leitura-only |
| 4 | Consistency and Standards | 3 | shadcn consistente; grid de cards idênticos quebra hierarquia interna |
| 5 | Error Prevention | 2 | Estado de déficit visível só no card secundário |
| 6 | Recognition Rather Than Recall | 2 | 8 métricas com mesmo peso visual — usuário precisa ler tudo |
| 7 | Flexibility and Efficiency | 2 | Sem atalhos; mobile ok via bottom nav |
| 8 | Aesthetic and Minimalist Design | 2 | Grid homogêneo de MetricCards = tell de SaaS genérico |
| 9 | Error Recovery | n/a | Dashboard read-only |
| 10 | Help and Documentation | 2 | Empty state de parcelas sem orientação |
| **Total** | | **24/40** | **Acceptable — melhorias significativas necessárias** |

## Anti-Patterns Verdict

**LLM assessment:** Interface funcional mas com grid de 8 cards idênticos, hero metric sem destaque proporcional, paleta 100% neutra apesar do nome "Casa no Azul", padrão ghost-card (border + shadow-sm).

**Deterministic scan:** Limpo — nenhum finding em dashboard.tsx, metric-card.tsx, page-shell.tsx.

## Overall Impression

A lógica financeira está correta e o mobile-first funciona, mas a tela não responde em 2 segundos à pergunta central porque todas as métricas competem igualmente. Falta identidade de marca (azul) e hierarquia clara hero → resumo → detalhes.

## What's Working

- MetricCard com tons semânticos (good/warning/danger) para estados financeiros
- Bottom nav mobile alinhada ao uso entre compras
- Linguagem direta ("Pode gastar hoje") sem jargão bancário

## Priority Issues

**[P1] Grid homogêneo de 8 MetricCards**
- **Why:** Viola "clareza antes de densidade" e anti-referência SaaS genérico; carga cognitiva alta
- **Fix:** Hero grande + 3 resumos + seções agrupadas com list rows
- **Command:** `$impeccable distill dashboard`

**[P1] Ausência de identidade "Azul"**
- **Why:** Nome do produto promete cor; interface é shadcn neutral default
- **Fix:** Primary token azul calmo OKLCH; hero usa tone brand quando saudável
- **Command:** `$impeccable colorize dashboard`

**[P1] Hero metric sem escala visual**
- **Why:** Mesmo tamanho de card que secundários; pergunta central não domina
- **Fix:** variant hero com tipografia 4xl/5xl
- **Command:** `$impeccable layout dashboard`

**[P2] Ghost-card pattern (border + shadow-sm)**
- **Why:** Tell Codex; DESIGN.md proíbe par border+wide shadow
- **Fix:** Remover shadow-sm dos MetricCards
- **Command:** `$impeccable polish metric-card`

**[P2] Empty state de parcelas sem orientação**
- **Why:** "Nenhuma parcela" não ensina próximo passo
- **Fix:** Copy explicativa sobre quando parcelas aparecem
- **Command:** `$impeccable onboard dashboard`

## Persona Red Flags

**Casey (Mobile distraído):** 8 cards exigem scroll e leitura — hero deveria bastar na maioria dos check-ins.

**Jordan (Primeiro uso):** "Dashboard do mês" não comunica valor; "Falta guardar" sem barra de progresso exige interpretação mental.

## Minor Observations

- Título de página genérico vs pergunta do produto
- Mês (competence_month) não exibido no header
- Cartões/reserva sem visualização de progresso

## Questions to Consider

- E se 80% dos acessos precisassem só do hero + um número de restante?
- O azul da marca deveria aparecer só no hero saudável ou também nas barras de progresso?
