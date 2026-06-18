---
name: Casa no Azul
description: Controle financeiro familiar — direto, prático, acolhedor.
colors:
  background: "oklch(1 0 0)"
  foreground: "oklch(0.145 0 0)"
  primary: "oklch(0.205 0 0)"
  primary-foreground: "oklch(0.985 0 0)"
  muted: "oklch(0.97 0 0)"
  muted-foreground: "oklch(0.556 0 0)"
  border: "oklch(0.922 0 0)"
  destructive: "oklch(0.577 0.245 27.325)"
  success: "oklch(0.65 0.15 155)"
  warning: "oklch(0.75 0.12 85)"
  danger: "oklch(0.577 0.245 27.325)"
  info: "oklch(0.55 0.12 250)"
typography:
  display:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 2rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  sm: "calc(0.625rem - 4px)"
  md: "calc(0.625rem - 2px)"
  lg: "0.625rem"
  xl: "1rem"
  card: "1rem"
spacing:
  page: "1rem"
  section: "1.25rem"
  card: "1rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
  card-default:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.card}"
    padding: "{spacing.card}"
  metric-card-good:
    backgroundColor: "oklch(0.97 0.03 155)"
    textColor: "oklch(0.25 0.05 155)"
    rounded: "{rounded.card}"
    padding: "{spacing.card}"
---

# Design System: Casa no Azul

## 1. Overview

**Creative North Star: "A Mesa da Cozinha"**

Como sentar à mesa e saber, em uma frase, como está o mês — sem planilha, sem banco, sem drama. A interface é clara como uma conversa de casal sobre contas: números grandes onde importam, detalhes acessíveis quando pedidos, nada de decoração que distraia do que sobra para gastar.

Densidade moderada, mobile-first com bottom nav. shadcn/ui New York como base estrutural, mas a identidade vem da hierarquia financeira (métrica hero → grid secundário → listas) e dos tons semânticos (verde/âmbar/vermelho/azul) nos cards de status — não de efeitos visuais genéricos.

Rejeita explicitamente: SaaS clone, banco corporativo, fintech gamificada, planilha disfarçada.

**Key Characteristics:**

- Métrica hero dominante por tela (ex.: "Pode gastar hoje")
- Cards semânticos com cor de fundo tintada, não apenas borda lateral
- Instrument Sans única família, pesos 400–600
- Neutros OKLCH frios (chroma 0), sem cream/sand/paper
- Mobile: bottom nav fixa; desktop: sidebar shadcn
- Dark mode nativo via classe `.dark`

## 2. Colors

Paleta neutra fria com acentos semânticos aplicados por contexto financeiro, não por decoração.

### Primary

- **Ink Charcoal** (oklch(0.205 0 0)): botões primários, texto de ênfase, sidebar primary. Quase preto, sem saturação — confiança discreta.

### Neutral

- **Paper White** (oklch(1 0 0)): fundo light mode, cards default.
- **Ink** (oklch(0.145 0 0)): texto principal.
- **Soft Gray** (oklch(0.97 0 0)): fundos muted, hover states.
- **Mid Gray** (oklch(0.556 0 0)): labels, helper text — contraste ≥4.5:1 verificado.
- **Line Gray** (oklch(0.922 0 0)): bordas, inputs.

### Semantic (Metric tones)

- **Safe Green** (emerald tint): saldo positivo, meta atingida.
- **Alert Amber** (amber tint): atenção, gap de reserva.
- **Deficit Red** (red tint): orçamento estourado, allowance zero.
- **Highlight Blue** (blue tint): métricas de destaque secundário.

**The Semantic-Only Color Rule.** Cores saturadas aparecem apenas em cards de status financeiro ou feedback (sucesso/alerta/erro). Superfícies estruturais permanecem neutras.

## 3. Typography

**Display Font:** Instrument Sans (ui-sans-serif, system-ui fallback)
**Body Font:** Instrument Sans (mesma família)

**Character:** Geométrica-humanista, legível em telas pequenas, sem personalidade editorial — serve os números, não compete com eles.

### Hierarchy

- **Display** (600, clamp 1.5–2rem, lh 1.2, ls -0.02em): títulos de página ("Dashboard do mês").
- **Metric value** (600, 1.5rem/2xl, tracking-tight): valores monetários em cards.
- **Body** (400, 0.875rem, lh 1.5): texto corrido, descrições.
- **Label** (500, 0.875rem): rótulos de métricas, nav items.
- **Helper** (400, 0.75rem, opacity 70%): dias restantes, subtítulos.

**The Number-First Rule.** Valores monetários sempre ≥ body size e weight 600. Labels nunca competem com o número.

## 4. Elevation

Sistema predominantemente flat com sombras mínimas. Profundidade vem de bordas (`border`) e tintas de fundo semânticas, não de drop shadows largos.

### Shadow Vocabulary

- **Card rest** (`shadow-sm`): sombra sutil em cards e botões — blur ≤8px, nunca paired com border+wide-shadow ghost-card pattern.
- **Nav bar** (`border-t` + `backdrop-blur`): bottom nav mobile usa borda superior, não sombra flutuante.

**The Flat-By-Default Rule.** Superfícies planas em repouso. Sombra indica interatividade (botão) ou elevação mínima (card), nunca decoração.

## 5. Components

### Buttons (shadcn)

- **Shape:** cantos moderados (rounded-md, 10px base radius)
- **Primary:** bg-primary, text primary-foreground, shadow-xs, hover 90% opacity
- **Outline/Ghost:** para ações secundárias; sem gradientes
- **Focus:** ring 3px ring-ring/50

### MetricCard (signature)

- **Corner Style:** rounded-2xl (16px)
- **Background:** tinta semântica por tone (good/warning/danger/strong) ou bg-card default
- **Border:** 1px solid matching tone, nunca border-left accent stripe
- **Internal Padding:** p-4 (16px)
- **Structure:** label (sm, medium, 70% opacity) → value (2xl, semibold) → helper (xs, optional)

### Cards (shadcn)

- **Corner Style:** rounded-xl (12px)
- **Background:** bg-card
- **Border:** 1px border
- **Padding:** py-6 px-6 (CardHeader/Content)

### Inputs

- **Style:** h-9, rounded-md, border-input, bg-transparent
- **Focus:** border-ring + ring 3px
- **Placeholder:** text-muted-foreground com contraste verificado

### Navigation

- **Mobile:** bottom nav fixa, 4 colunas, ícones Lucide 20px + label xs, rounded-xl hover
- **Desktop:** sidebar shadcn com links financeiros

## 6. Do's and Don'ts

### Do:

- **Do** colocar "Pode gastar hoje" como métrica hero no dashboard, com tone semântico automático.
- **Do** usar OKLCH para todos os tokens de cor.
- **Do** manter formulários de lançamento curtos e mobile-friendly.
- **Do** usar Instrument Sans em todo o app — uma família, múltiplos pesos.
- **Do** respeitar dark mode com tokens `.dark` existentes.

### Don't:

- **Don't** parecer SaaS genérico — sem cards idênticos icon+heading+text em grid infinito, sem gradientes decorativos.
- **Don't** parecer app bancário — sem menus profundos, sem jargão ("liquidez", "apropriação").
- **Don't** parecer fintech infantilizada — sem mascotes, gamificação ou neon.
- **Don't** parecer planilha — sem tabelas densas como layout principal; preferir métricas hierárquicas.
- **Don't** usar border-left colorido >1px como accent em cards ou alertas.
- **Don't** parear `border: 1px solid` com `box-shadow` blur ≥16px no mesmo elemento.
- **Don't** usar border-radius >16px em cards ou inputs (pill ok apenas em tags/botões pequenos).
- **Don't** usar fundo cream/sand/beige — neutros frios ou branco puro.
