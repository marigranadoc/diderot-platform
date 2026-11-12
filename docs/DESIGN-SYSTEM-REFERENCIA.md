# Design System — ShopMy (shopmy.us)

Fonte: `main.a43051f7.css` (7,4 MB, ~49 mil regras) + DOM renderizado de `/home`. Valores abaixo são literais do CSS; itens marcados *(inferido)* são interpretação.

## 1. Princípios visuais
- Editorial/luxo: preto e branco quase puro, cinzas neutros, **cor só semântica** (verde para sucesso/dados, vermelho para erro).
- Títulos em **serifada variável em peso 200 (light)**; UI em sans com **labels uppercase espaçados**.
- Cantos quase retos (4px dominante), superfícies planas, sombras muito suaves e em camadas.
- Hero com texto branco sobre imagem, header translúcido com `blur` (variantes `blurred` / `white-elements`).

## 2. Cores
| Token | Valor | Uso |
|---|---|---|
| foreground-primary | `#000` | texto principal, botão primário |
| brand-ink / theme-color | `#1f1f1f` | títulos, `theme-color`, 2º preto mais usado (1950×) |
| foreground-secondary | `#525252` | texto de corpo, hover do primário |
| foreground-tertiary | `#757575` | texto leve |
| foreground-quaternary | `#8f8f8f` | eixos, apoio |
| foreground-disabled | `#b8b8b8` | desabilitado |
| background-primary | `#fff` | página |
| background-secondary | `#f7f7f7` | superfícies, hover |
| background-tertiary | `#f7f7f5` | superfície quente |
| background-quaternary | `#e0e0e0` | |
| background-inverse | `#292929` | blocos escuros |
| stroke-light / regular / hover | `#ebebeb` / `#e0e0e0` / `#ccc` | bordas |
| success | `#11835a` (fg), `#dcf6ea` (bg), `#9fdabd` (stroke), `#61be91` (claro) | |
| danger | `#da0e3f` (fg), `#ffebeb` (bg) | |
| warning | `#ffa000` (fg), `#fff3e0` (bg), `#b97f1d` (texto) | |
| chart | `#11835a`, `#61be91`, `#00a3ff` | gráficos |
| scrim | `rgba(0,0,0,.1)`, modal `rgba(0,0,0,.28)`, hero `linear-gradient(90deg, rgba(0,0,0,.65), rgba(0,0,0,.35))` | |

Em fundo escuro: branco com alpha (`hsla(0,0%,100%,.05/.1/.15/.2/.8)`) e `backdrop-filter: blur(22.5px / 40px)`.

## 3. Tipografia
**Famílias reais (@font-face)**
| Família | Pesos | Papel |
|---|---|---|
| **Tobias** (variável) | 100–900 | títulos/serif (`--font-serif`: Tobias, Para Supreme Normal, serif) |
| **Para Supreme Normal** | 100, 400, 500, 600 | fallback serif |
| **DM Sans** (Google) | variável | corpo e UI (`--font-body`: DM Sans, Karla, sans-serif) |
| **ShopMy Plain** | 300, 400, 400i, 500, 700 | sans proprietária |
| **ShopMy Octave** | 300 italic | itálico de destaque *(inferido: ênfase como "obsessed")* |
| Fraunces / JetBrains Mono | — | áreas de app/dados |
| Karla | — | fallback sans |

As demais fontes do `<head>` (Playfair, Poppins, Raleway, Quicksand, Vidaloka, Hanken Grotesk, Source Sans Pro, Noto Sans) são carregadas, mas **não aparecem como família principal** no CSS.

**Escala**
| Token | Desktop | Mobile | Line-height | Peso |
|---|---|---|---|---|
| title-1 | 52px | 30px | 1.15 | 200 |
| title-2 | 36px | 24px | 1.05 | 200 |
| title-3 | 24px | 18px | 1.17 | 200 |
| title-4 | 16px | — | 1.17 | 200 |
| headline | 18px | — | 1.2 | 400 |
| body | 14px | 12px (small) | 1.7 / 1.4 | 400 (500 bold, 700 extra-bold) |
| label | 12px | 10px (small) | normal | 700 / 600, uppercase, tracking .1em / 1px |

Rodapé: título serif 28px/45px peso 600 (36px em telas grandes); cabeçalhos de painel DM Sans 14px/20px, 700, uppercase, tracking .09em.

## 4. Espaçamento
Sem tokens de spacing; a escala em uso (por frequência): 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64px. Base prática de 4/8px. Gutter de página: `max(24px, calc(50% - 608px))`.

## 5. Raios
4px (padrão: card, botão, 1511×), 2px, 8px (field), 10px, 12px (popover), 24px, 50% (avatares), 999px (pill), imagens 0px.

## 6. Sombras
- tile: `0 1px 4px rgba(0,0,0,.04), 0 3.6px 3.6px rgba(0,0,0,.03), 0 6px 4px rgba(0,0,0,.03)`
- section: `0 24px 32px rgba(0,0,0,.04)`
- floating: `0 26px 58px rgba(0,0,0,.1), 0 106px 106px rgba(0,0,0,.09)`
- utilitárias: `0 0 10px rgba(0,0,0,.04/.1/.15/.2)`, `0 4px 10px rgba(0,0,0,.1/.15)`

## 7. Botões (`.shopmy-shared-button`)
Base: radius 4px, DM Sans 700, **uppercase**, transição `.2s ease`.
| Tamanho | Altura | Fonte | Padding | Tracking |
|---|---|---|---|---|
| small | 34px | 10px | 12px | 1px |
| medium | 37px | 10px | 12px 18px | 1px |
| large | 48px | 12px | 16px 32px | 1.2px |

Variantes: `primary`, `secondary`, `ghost`, `blur` (só dark) × `mode-light` / `mode-dark`. Detalhes de cor/hover/disabled em `shopmy-design-tokens.css`.

## 8. Layout e breakpoints
Media queries em uso: **400, 576, 640, 768 (principal), 992, 1240, 1600** (+ `prefers-reduced-motion`). Container máximo ~1240px (conteúdo 1216px). Utilitários `show-on-large` / `hide-on-small` / `hide-on-large`.

## 9. Movimento
`opacity .2s`, `all .2s ease-in-out`, `border-color .2s`; fade de imagem 400ms, transform 250ms; slides 1s `cubic-bezier(.45,0,.25,1)`; hover dos steppers `translateX(±2px)`.

## 10. Z-index
Camadas: 1–6 (conteúdo), 10, 90, 100–101, 1000, 10000–10001 (modais/overlays).

## 11. Componentes da home (classes)
Header (`nav-top`, mega-menu `header-subpage-panel`, logo `shrink-on-scroll`), seções `shop-by` / `features-section`, `showcase-large-feature`, `half-size-feature`, tiles `shop-tile-*`, footer `footer-panel-*`. Variantes de contexto: `sms home blurred white-elements`.

## 12. Limitações
- Valores específicos de cada seção da home (alturas, grids exatos) estão em seletores muito aninhados; extraí só os tokens globais e componentes-base.
- Ícones: Font Awesome 6 (Free + Pro).
