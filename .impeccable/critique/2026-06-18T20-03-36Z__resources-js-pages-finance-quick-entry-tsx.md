---
target: quick-entry
total_score: 23
p0_count: 0
p1_count: 3
timestamp: 2026-06-18T20-03-36Z
slug: resources-js-pages-finance-quick-entry-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Sem feedback de saving além do botão disabled |
| 2 | Match System / Real World | 3 | Labels ok; "Pessoa" genérico |
| 3 | User Control and Freedom | 3 | Form cancel via nav ok |
| 4 | Consistency and Standards | 1 | Native select vs shadcn Input; erros red-600 |
| 5 | Error Prevention | 2 | Muitos campos visíveis de uma vez |
| 6 | Recognition Rather Than Recall | 2 | 10+ campos same weight |
| 7 | Flexibility and Efficiency | 2 | Autofocus no valor ok; falta atalho mobile |
| 8 | Aesthetic and Minimalist Design | 2 | Form planilha — grid denso de selects |
| 9 | Error Recovery | 3 | Erros inline por campo |
| 10 | Help and Documentation | 2 | Placeholders mínimos |
| **Total** | | **23/40** | **Acceptable** |

## Anti-Patterns Verdict

**LLM:** Formulário tipo planilha — todos os campos com mesmo peso, valor não hero, native selects inconsistentes com shadcn, card rounded-2xl genérico.

**Detector:** Limpo.

## Priority Issues

**[P1] Valor sem hierarquia hero** → layout + colorize
**[P1] Native selects** → polish com shadcn Select
**[P1] Sobrecarga cognitiva (10 campos)** → distill com collapsible "Mais detalhes"
**[P2] Pagamento/tipo em dropdown** → colorize com ToggleGroup pills
**[P2] Erros text-red-600** → polish com text-destructive

## Persona Red Flags

**Casey (Mobile):** Grid 3-col de selects ilegível; botão submit no fim do scroll longo.

**Jordan:** "Tipo", "Necessidade", "Pagamento" juntos confundem.
