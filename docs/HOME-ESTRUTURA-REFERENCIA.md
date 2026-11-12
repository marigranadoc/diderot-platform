# Estrutura da página Home — shopmy.us/home

Fonte: DOM renderizado (HTML salvo) + regras de `main.a43051f7.css`. Valores literais do CSS; itens marcados *(inferido)* são interpretação.

## 1. Árvore da página

```
#root > .root.sms.home
├─ .modal-outer-container.topmost                  (backdrop de modais)
├─ .nav-top.sms.home.blurred.white-elements        (HEADER, fixo)
│   ├─ .background                                 (fundo translúcido)
│   ├─ .header-main-container  → logo (.logo-img, .shrink-on-scroll)
│   ├─ .header-secondary-container
│   │   └─ nav.nav-tabs
│   │       ├─ .nav-tab-group.main   → For Shoppers | For Creators | For Brands
│   │       │     (cada um com .header-subpage-panel = mega-menu)
│   │       └─ .nav-tab-group        → Log In (.btn.login) · Sign Up (.btn.apply) · busca · hambúrguer
│   └─ .more-options-menu-outer-container-new      (menu mobile em tela cheia, 4 grupos + Apply/Log In)
│
├─ .content-container > .home-outer-container
│   ├─ 1. .home-header-shop-outer-container        HERO
│   ├─ 2. .download-shopper-app-banner-outer.style-7.is-dark   BANNER NOIR / APP
│   ├─ 3. .home-shop-features-outer-container      SHOP BY CURATOR   (.showcase-large-feature)
│   ├─ 4. .home-shop-features-outer-container      SHOP BY CIRCLE
│   ├─ 5. .home-shop-interrupt-outer-container     CTA "The best things in life…"
│   ├─ 6. .home-shop-features-outer-container      SHOP BY CATEGORY
│   └─ 7. .home-shop-features-outer-container      SHOP BY BRAND   (último: margin-bottom 160px)
│
└─ .footer-outer-shell.home                        FOOTER
```

## 2. Header
- **Nav principal (desktop):** For Shoppers · For Creators · For Brands, cada um abre um painel (`.header-subpage-panel`) com itens `.subpage` (título + descrição):
  - **Shoppers:** Shop By Curator / Circle / Brand / Category, My Circles, My Taste Profile
  - **Creators:** For Creators, Digital Shops, Affiliate Links, Brand Partnerships, Apply to be a Creator
  - **Brands:** For Brands, Discover, Engage, Track, Amplify
- **Ações:** Log In, Sign Up (`.btn.apply`, borda branca 1px), busca, hambúrguer (`.hide-on-large`).
- **Menu mobile:** 4 grupos (Creators, Brands, Shoppers, General: About, Blog, Careers, Contact) + ações Apply e Log In.
- **Estilo:** `padding: 36px 0 24px`, transparente sobre o hero. Variante `white-elements`: logo com `filter: brightness(0) invert(1)`, texto/ícones brancos. Ao rolar (`scrolled`): fundo `rgba(0,0,0,.55)` + borda inferior `hsla(0,0%,100%,.12)`, logo e abas encolhem (`shrink-on-scroll`).

## 3. Hero (`.home-header-shop-outer-container`)
| Propriedade | Valor |
|---|---|
| Altura | `85vh` (90vh ≤576px) |
| Fundo | `#000`, texto `#fff`, `border-bottom: 2px solid #fff` |
| Mídia | `.smart-video-outer.cover-media`: vídeo em loop + poster `Home_Shop2026.jpg`; opacidade `.8` (`.6` no mobile, `object-position: 75% center`) |
| Container | `max-width 1240px` (1440 ≥1600), `padding-top 60px`, alinhado à esquerda, `gap 40px` |
| H1 | Tobias 400, line-height 1.05; tamanho responsivo **34 → 40 (576) → 52 (768) → 64 (992) → 70px (1240)**; letter-spacing −1.5px (−3px ≥1240) |
| Ênfase | "obsessed" em `<i>` → `font-style: italic` |
| H2 | DM Sans 300, 14 → 16 → 18px, line-height 1.4, `max-width: min(60vw, 340px)` |
| Extra | `.scroll-down-icon` (indicador de rolagem), `opacity .8` no hover |

Texto: **"Curated by the *obsessed*, not the algorithm."** / "Shop the recommendations of the world's most trusted curators."

## 4. Banner Noir / app (`.download-shopper-app-banner-outer.style-7.is-dark`)
- Altura **135px** (164px ≤576px), fundo `#000`, `padding: 0 40px`, container 1240px.
- Esquerda (`.left.stacked`): título Tobias 300, 30px (20px mobile): "It's better on mobile."; subtítulo DM Sans 400, 16px, `opacity .65`, line-height 140%: texto sobre o **Noir** (concierge 1:1 por texto).
- Direita: badge App Store (40px de altura, 32px mobile) → `apps.apple.com/us/app/shopmy/id6443850511`.
- Fundo: `--dsab-bg-image: noir-banner-bg.png` com `blur(33px)` + wordmark Noir (`.noir-wordmark`) posicionado à direita, `object-fit: contain`.
- Mobile ≤576px: empilhado e centralizado.
- O CSS define 7 estilos de banner (`style-1` a `style-7`); a home usa o 7.

## 5. Seções "Shop by …" (padrão repetido 4×)
**Cabeçalho (`.header-section`)**, `flex`, `justify-content: space-between`, alinhado embaixo, `gap 48px`:
- `.main`: "Shop by" (`.shop-by`, Tobias 400 *italic* 24px) + palavra-chave (`.header`, Tobias 300, **100px**, line-height 1; 60px ≤992px).
- `.secondary`: subtítulo (DM Sans 300, 14 → 16 → 18px, ≤480px, alinhado à direita ≥992px) + `.actions`: botão primário "Shop All …" (`#000`, texto branco, 12px, uppercase, tracking .1em, radius 4px, padding 12×24px). No mobile (≤992px) as ações somem do cabeçalho e aparecem em `.actions-mobile` abaixo do grid.
- Container: `max-width 1240px`, `padding: 80px 0 0` (64px 0 40px ≤768px), `gap 60px` (48px ≤768px).

**Grid de tiles (`.features-section` > `.features-subsection.grid` > `.feature`)**
- 4 colunas (2 colunas ≤992px), `gap 4px`.
- Tile: `aspect-ratio 4/5`, fundo `#f2f2f2`, `overflow hidden`; dentro, `.shop-tile-outer-container > a.shop-tile-container > img.image` (link cobre o tile inteiro, `position:absolute`). Imagens com fade (`image-loaded`, 400ms).
- Rótulos dos tiles vêm no `alt`; o CSS não mostra texto sobre a imagem nesta seção.

| # | Seção | Layout | Itens (alt das imagens) |
|---|---|---|---|
| 3 | **Curator** | `.showcase-large-feature`: 2 colunas 50/50 (1 coluna ≤992px); 1 tile grande + mini-grids | Sofia Richie Grainge, Alexandra Leclerc, Elsa Hosk, Lila Moss, Nara Smith, aurora, Marianna Hewitt, Hailee Steinfeld, Kelly Wearstler |
| 4 | **Circle** | grid 4 col | The ShopMy Team, Stylists, Tastemakers in the Kitchen, Professional Makeup Artists, Interior Designers, Fashion Industry Insiders, Beauty Industry Insiders, Designers & Founders |
| 6 | **Category** | grid 4 col | Necklaces, Jeans, Sandals, Dresses, Blazers, Sneakers, Tote Bags, Flats |
| 7 | **Brand** | grid 4 col | Call It By Your Name, Emme Parsons, ALÉMAIS, Sofie Pavitt Face, Olive Ateliers, Liberowe… |

Na seção Curator, os tiles usam `hide-on-large` / `hide-on-small` para trocar a composição entre desktop e mobile (os mesmos curadores aparecem duplicados no DOM). A seção Circle também tem o botão secundário "Create Circle" (borda `#4a4a4a`, fundo branco).

Links dos tiles: `/shop/<handle>` (curadores), `/shop?CuratorGroup_id=…&tab=popular-monthly` (circles), `/shop?Category_id=…&tab=popular-monthly`, `/shop?AllBrand_id=…&tab=popular-monthly`.

## 6. Faixa CTA (`.home-shop-interrupt-outer-container`)
- Altura `min(280px, 50vh)` → 360px (≥576) → 440px (≥992); fundo `#1f1f1f` + imagem `sub.jpg` em `object-fit: cover`; margem superior 80px (64px ≤768px).
- Título centralizado, Tobias 300, **30 → 40 → 48 → 54 → 60px** (breakpoints 576/768/992/1240): "The *best* things in life are worth sharing." (a palavra "best" em destaque, provavelmente itálico *(inferido)*).
- Duas ações (`gap 16px`) no estilo **blur**: `backdrop-filter: blur(40px)`, fundo `hsla(0,0%,100%,.05)`, borda `1px #fff`, texto branco 12px/500, uppercase, tracking .1em: **Sign Up** e **Create a Circle**.

## 7. Rodapé (`.footer-outer-shell.home`)
- `.footer-main-body.wide` com `.footer-panel.with-subpanels` e **5 colunas** (`.footer-subpanel`): For Creators · For Brands · For Shoppers · Explore (Blog, About, Careers, Shop All Categories, Reports) · Support + Legal (Creator Guide, Brand Guide, Contact, Terms, Privacy).
- Cabeçalhos de coluna: DM Sans 700, 14px/20px, uppercase, tracking .09em. Links: `.footer-panel-link`.
- `.footer-brand-container`: logo + linha inferior (`.footer-bottom-row`): "© Copyright 2026 Shop My Shelf, Inc. All Rights Reserved." | "Do Not Sell or Share My Personal Information" | "Cookie Settings".
- O CSS também prevê newsletter (`.email-container form`, input com borda `#e5e5e5`, radius 4px) e redes sociais (`.footer-panel-social-links`); não aparecem renderizados nesta captura da home.

## 8. Comportamentos
- Header: encolhe e ganha fundo escuro ao rolar; mega-menu no hover (desktop), menu em tela cheia (mobile).
- Hero: poster aparece primeiro e faz crossfade (1s) para o vídeo.
- Imagens: fade-in 400ms; botões: `opacity` .2s no hover (.8 a .85).
- Troca desktop/mobile: `show-on-large`, `hide-on-large`, `hide-on-small` no breakpoint de **992px**.

## 9. Fora da captura
Conteúdo carregado dinamicamente (vídeo do hero, imagens dos tiles) e estados de modais não aparecem como markup estático. O hover exato das imagens dos tiles e a composição fina do grid do Curator em 992–1240px dependem de seletores muito aninhados que mapeei só em parte.
