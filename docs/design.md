# Direção visual — Mariah Espaço Comercial

Etapa 3 do processo (ver `CLAUDE.md`). Três propostas para escolha, cada uma com paleta, tipografia, espaçamento e componentes. Amostra visual em `docs/estilo.html`. Depois da escolha, este arquivo será reduzido para documentar só a direção aprovada.

Ponto de partida (do `CLAUDE.md`): logo dourado sobre preto (casa formando o "A" de MARIAH), Instagram usa dourado + preto + marrom café + creme, tipografia serifada elegante com detalhes manuscritos, formas em arco.

---

## Proposta A — "Clássico Dourado"

A leitura mais literal da marca: fundo escuro, dourado em destaque, clima de espaço nobre à noite. É a linha mais parecida com o que já existe no Instagram e no Protótipo 1.

**Paleta**
| Uso | Cor | Hex |
|---|---|---|
| Fundo principal (seções escuras) | Preto quente | `#15110D` |
| Fundo alternado (seções claras) | Creme | `#F5ECDD` |
| Texto sobre fundo escuro | Creme | `#F3EAD9` |
| Texto sobre fundo claro | Marrom café escuro | `#3A2A1C` |
| Destaque / dourado | Dourado | `#C9A24B` |
| Superfície secundária (cards) | Marrom café | `#4A3323` |

**Tipografia**
- Títulos: *Cormorant Garamond* (serifada, elegante, contraste alto), com palavras-chave em itálico para o "detalhe manuscrito" da marca.
- Corpo de texto: *Jost* (sans-serif geométrica, limpa, mínimo 17px no desktop).
- Sem fonte script separada — o toque manuscrito vem do itálico da serifada, para não comprometer a legibilidade.

**Espaçamento**
- Escala base 8px (8/16/24/32/48/64/96).
- Seções com padding generoso: 96px desktop / 48px mobile.
- Largura máxima de conteúdo: 1200px.

**Componentes**
- Botão primário: fundo dourado sólido, texto preto, cantos levemente arredondados (4px), letras maiúsculas com leve espaçamento.
- Botão secundário/ghost: borda dourada 1,5px, fundo transparente, texto creme.
- Cartões: fundo marrom café, borda dourada fina (1px), canto superior com curva mais acentuada (remete ao arco da logo).
- Galeria: grade com uma foto em destaque maior (estilo bento), moldura dourada fina.

---

## Proposta B — "Acolhedor Contemporâneo"

Mais clara e convidativa — pensada para não intimidar quem nunca alugou uma sala (psicólogos, fisioterapeutas, quem está começando). Mantém a base dourado/marrom/creme da marca, mas em tom diurno, mais leve.

**Paleta**
| Uso | Cor | Hex |
|---|---|---|
| Fundo principal | Creme quente | `#FBF6EE` |
| Texto principal | Marrom escuro (não preto puro) | `#3A2B22` |
| Destaque / dourado envelhecido | Dourado suave | `#B8874B` |
| Cabeçalho / rodapé | Marrom café | `#6B4A35` |
| Acento secundário (tags, badges) | Terracota suave | `#C17A54` |

**Tipografia**
- Títulos: *Fraunces* (serifada com contraste orgânico, menos "formal" que a Proposta A).
- Corpo de texto: *Nunito Sans* (arredondada, tom acolhedor, mínimo 17px).

**Espaçamento**
- Escala base 8px, mas seções mais compactas (64px desktop / 40px mobile) — ritmo mais ágil.
- Cantos arredondados uniformes em todos os componentes (12–16px), sem os ângulos retos da Proposta A.

**Componentes**
- Botão primário: preenchido em marrom café, texto creme, formato pílula (cantos totalmente arredondados).
- Botão secundário: contorno marrom, fundo creme.
- Cartões: fundo branco/creme com sombra suave (sem borda), tag terracota no canto indicando o tipo de sala.
- Galeria: grade uniforme com cantos arredondados suaves e leve zoom no hover.

---

## Proposta C — "Editorial Minimalista"

A opção mais discreta e sofisticada: usa o dourado como acento pontual (linhas finas, ícones, hover), não em blocos grandes. Sensação de estúdio de arquitetura/design — silenciosa, com muito espaço em branco. É a que mais se diferencia do "espaço dourado escuro" comum no nicho.

**Paleta**
| Uso | Cor | Hex |
|---|---|---|
| Fundo principal | Branco quente | `#FAF8F5` |
| Fundo alternado | Creme | `#F1E9DC` |
| Texto principal | Marrom café quase preto | `#2B211A` |
| Destaque / dourado (uso pontual) | Dourado | `#B08D3F` |
| Faixas de contraste (header/rodapé) | Preto | `#15110D` |

**Tipografia**
- Títulos: *Cormorant Garamond*, tamanhos grandes, letter-spacing levemente negativo — contraste editorial forte.
- Corpo/labels: *IBM Plex Sans* (neutra, técnica, mínimo 17px no corpo).

**Espaçamento**
- Escala base 8px, seções muito espaçadas (96–128px desktop), grid assimétrico.
- Linhas finas (1px, dourado ou marrom) como divisores no lugar de fundos de cartão.

**Componentes**
- Botão primário: sólido, usado só nos CTAs principais (Hero e WhatsApp final); os demais links de ação são texto sublinhado com seta, sem fundo.
- Cartões: sem fundo, numerados (01, 02...) e separados por linha fina — já usamos essa lógica na seção "Estrutura" do copy aprovado.
- Galeria: grade editorial com colunas de larguras variadas, legendas pequenas abaixo das fotos, sem bordas ou molduras.

---

## Direção escolhida (combinação A + B)

Paleta da **Proposta A** (Clássico Dourado) + tipografia da **Proposta B** (Fraunces + Nunito Sans). Componentes (cartões, cantos, molduras) seguem o padrão da Proposta A por padrão — pode ser ajustado se quiser algo mais arredondado da B.

**Paleta (da Proposta A)**
| Uso | Cor | Hex |
|---|---|---|
| Fundo escuro | Preto quente | `#15110D` |
| Fundo claro | Creme | `#F5ECDD` |
| Texto sobre escuro | Creme | `#F3EAD9` |
| Texto sobre claro | Marrom café escuro | `#3A2A1C` |
| Destaque / dourado | Dourado | `#C9A24B` |
| Superfície secundária (cards) | Marrom café | `#4A3323` |

**Tipografia (da Proposta B)**
- Títulos: *Fraunces* (serifada com contraste orgânico), com palavras-chave em itálico dourado.
- Corpo de texto: *Nunito Sans*, mínimo 17px no desktop.

Amostra de página completa (todas as seções principais em sequência) em `docs/estilo.html`.

## Próximo passo

Aprovar a direção combinada (ou pedir ajustes) antes de seguirmos para a etapa 4 (construção: `index.html`, `css/estilo.css`, `js/main.js`).
