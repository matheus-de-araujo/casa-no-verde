---
target: sidebar
total_score: 22
p0_count: 0
p1_count: 3
timestamp: 2026-06-18T19-59-31Z
slug: resources-js-components-app-sidebar-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Item ativo usa accent genérico; household não aparece |
| 2 | Match System / Real World | 1 | Logo "Laravel Starter Kit"; label "Platform" |
| 3 | User Control and Freedom | 3 | Collapse + atalho Cmd+B ok |
| 4 | Consistency and Standards | 2 | Footer com neutral-* hardcoded vs tokens sidebar |
| 5 | Error Prevention | n/a | Navegação only |
| 6 | Recognition Rather Than Recall | 2 | 7 itens flat; ação principal sem destaque |
| 7 | Flexibility and Efficiency | 3 | Atalho teclado; falta hierarquia de tarefas |
| 8 | Aesthetic and Minimalist Design | 2 | Lista starter-kit; links dev no footer |
| 9 | Error Recovery | n/a | |
| 10 | Help and Documentation | 2 | Laravel Docs no footer para casal usuário |
| **Total** | | **22/40** | **Acceptable — identidade e IA quebradas** |

## Anti-Patterns Verdict

**LLM assessment:** Sidebar ainda é Laravel Starter Kit: logo errado, grupo "Platform", footer com Laravel Docs. Lista plana de 7 links sem hierarquia. Accent sidebar neutro sem marca azul.

**Deterministic scan:** Limpo.

## Overall Impression

Funcional como shell shadcn, mas contradiz PRODUCT.md: não parece Casa no Azul, não prioriza "Lançar gasto", expõe artefatos de dev ao usuário final.

## What's Working

- shadcn sidebar com collapse icon e tooltips
- NavUser no footer
- Ícones Lucide consistentes por rota financeira

## Priority Issues

**[P1] Branding Laravel Starter Kit**
- **Fix:** Logo Casa no Azul + subtítulo household
- **Command:** `$impeccable polish app-logo`

**[P1] Lista flat sem hierarquia**
- **Fix:** Grupos Visão geral / Ação rápida / Finanças; highlight em Lançar gasto
- **Command:** `$impeccable layout sidebar`

**[P1] Footer com links de desenvolvedor**
- **Fix:** Remover Laravel Docs e spec técnica do footer do produto
- **Command:** `$impeccable distill sidebar`

**[P2] Accent sidebar sem identidade azul**
- **Fix:** Tokens sidebar-accent com tint OKLCH hue 250
- **Command:** `$impeccable colorize sidebar`

**[P2] NavFooter neutral-* hardcoded**
- **Fix:** Usar tokens sidebar-menu
- **Command:** `$impeccable polish nav-footer`

## Persona Red Flags

**Jordan (Primeiro uso):** "Platform" e "Laravel Starter Kit" destroem confiança.

**Casey (Mobile):** Sidebar é desktop; ok, mas ação principal não se destaca quando visível.

## Minor Observations

- SidebarGroupLabel "Platform" em inglês
- Ícones footer h-5 w-5 inconsistentes com menu h-4

## Questions to Consider

- O nome do household no header ajuda casais com múltiplas casas?
- Lançar gasto deveria ser botão filled no topo do conteúdo mobile também?
