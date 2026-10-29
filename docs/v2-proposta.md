# Site v2: proposta (planejamento, nada construído)

**Objetivo:** fazer o site deixar de ser uma página de apresentação e virar uma **plataforma de salas**. O visitante encontra a sala certa, vê fotos e medidas, entende quanto custa e **reserva**: hoje pelo WhatsApp e, depois, direto no site, como em plataformas de hotel.

**Maquete visual:** `docs/v2-mockup-salas.html`. Abra no navegador para ver como fica a nova seção de Salas, o detalhe de uma sala e o formulário de reserva.

O processo do `CLAUDE.md` continua valendo: esta é a etapa de copy e wireframe da versão 2. Só construo depois do "aprovado".

---

## 1. Revisão do site atual: o que melhorar

| Área | Hoje | Problema | Proposta |
|---|---|---|---|
| **Salas** | 7 cartões só com texto. As fotos ficam separadas, na Galeria | O cliente não liga a foto à sala, e não há medida nem preço por sala | **Catálogo de salas** com foto, m², equipamentos, "a partir de" e o botão **Reservar** |
| **Galeria** | 13 fotos soltas | Repete as salas e não ajuda a decidir | As fotos passam para dentro de cada sala. Fica uma faixa curta de "Ambientes comuns" (recepção, copa e fachada) |
| **Números das salas** | "11 salas" + 7 tipos, incluindo "Salas superiores" | **3 + 4 + 1 + 1 + 1 + 1 = 11** sem contar as superiores. Elas são parte dessas 11 ou são extras? Onde fica o "escritório e reuniões"? | Confirmar com o cliente. Ver a seção 6 |
| **Menu** | 9 itens | Muito para um site de uma página; no celular vira uma lista longa | 5 itens: **Salas · Como funciona · Valores · Dúvidas · Localização**, mais o botão "Agendar visita". O "Início" fica no logo e o "Contato" no rodapé |
| **Botão principal** | "Reservar pelo WhatsApp" | O professor pediu venda presencial | Principal: **"Agendar visita"**. Secundário: **"Ver salas e reservar"** |
| **Fontes** | Fraunces e Nunito Sans | O "h" itálico do Fraunces estranha. Não combina com a nova marca | **Cormorant Garamond** (títulos) e **Jost** (texto), as mesmas do Conceito 01 da logo e dos slides |
| **Cores** | Preto, creme, dourado e marrom | Estão boas | Adotar a paleta do Conceito 01, que é praticamente a mesma: entram o **Mocha** `#3A2D20` e o **Ouro Claro** `#E8D2A2` para detalhes |
| **FAQ** | 12 perguntas numa lista única | Cansa e esconde o que importa | Agrupar em 3 abas: **Reservas e pagamento · Estrutura · Regras de uso** |
| **Horário** | O FAQ diz 8h às 17h | O Google diz "abre às 07:00" | Confirmar o horário real e usar o mesmo em todo lugar |
| **Prova social** | Não existe | Os concorrentes mostram nota no Google | Mostrar a nota **só quando houver o perfil próprio** no Google. Nada de depoimento inventado |
| **Seção Valores** | 4 cartões e condições | Boa | Mantém. Cada sala do catálogo mostra o "a partir de" e leva para cá |

---

## 2. Nova arquitetura da página

```
[Cabeçalho]  Logo · Salas · Como funciona · Valores · Dúvidas · Localização · [Agendar visita]

1. Hero ................ frase da marca + subtítulo + [Agendar visita] [Ver salas e reservar]
2. Faixa de confiança .. 11 salas · 5 modalidades · Recepção · Estacionamento · Wi-fi e café
3. SALAS (catálogo) .... filtros + cartões de sala → detalhe → reservar      ← mudança principal
4. Como funciona ....... 1 Escolha a sala · 2 Reserve · 3 Atenda (+ "venha conhecer antes")
5. Estrutura inclusa ... os 8 itens atuais, mais compactos
6. Valores ............. os 4 cartões atuais (hora, diária, período fixo, mensal)
7. Para quem é ......... profissões
8. Sobre ............... a história da Jéssica e da família
9. Ambientes comuns .... recepção, copa e fachada (substitui a galeria)
10. Dúvidas (FAQ) ...... 3 abas
11. Localização ........ mapa do Google + endereço
12. CTA final .......... "O espaço perfeito para o seu atendimento existe."
[Rodapé]
```

Por que as Salas vêm logo depois do Hero: é o produto. Em plataformas de reserva, o catálogo aparece primeiro, e a história e as regras vêm depois.

---

## 3. Seção Salas: copy e comportamento

**Título:** "Escolha a sua *sala*."
**Subtítulo:** "11 salas prontas, com recepção, ar-condicionado e wi-fi inclusos. Veja as fotos e as medidas e reserve o seu horário."

**Filtros** (chips; um clique mostra só o grupo):
- Todas
- Saúde (psicologia, salas com maca, injetáveis)
- Estética (massoterapia, salas com maca, injetáveis)
- Negócios (salas superiores, sala de cursos)
- Infantil (espaço kids)

**Cartão de sala**, um por tipo:

| Campo | Exemplo (Massoterapia) | Origem |
|---|---|---|
| Foto principal (com "+N fotos") | sala-massoterapia.jpg | assets |
| Selo de medida | **[__ m²]** | **PENDENTE** |
| Nome | Massoterapia | briefing |
| Quantidade | "3 salas" | briefing |
| Itens da sala (chips) | Maca de madeira · Ar-condicionado | fotos e briefing; confirmar a lista de cada sala |
| Ideal para | Massoterapeutas, terapeutas | briefing |
| Preço | "a partir de **R$ 50/hora**" | Confirmar se a hora vale para todas as salas |
| Botões | **Ver sala** · **Reservar** | |

**Detalhe da sala** (abre por cima da página, como num site de hotel):
- galeria de fotos da sala;
- medida, itens e para quem é;
- tabela de preços da modalidade (hora, pacotes, diária, período fixo e mensal);
- regras rápidas: cadastro, cancelamento com 1h de antecedência e pagamento;
- **bloco "Reservar":**
  - **Fase 1 (agora):** formulário curto (sala, data, período, modalidade, nome e profissão) → **abre o WhatsApp com a mensagem já escrita**. Ex.: *"Olá! Quero reservar uma sala. Sala: Massoterapia · Data: 15/10/2026 · Período: tarde · Modalidade: por hora. Sou Ana, fisioterapeuta."* O formato fixo, em campos, facilita a leitura pelo agente. Funciona em site estático (GitHub Pages), sem custo. Corta os 5 a 10 minutos de troca de mensagens para combinar data e hora.
  - **Fase 2:** calendário com **horários livres de verdade** (agenda por sala). O mesmo calendário que o agente de WhatsApp consulta.
  - **Fase 3:** **reserva e pagamento online** (PIX) com confirmação automática. É o modelo de plataforma de hotel.
- link "Prefere conhecer antes? **Agende uma visita**".

**Os 7 cartões e as fotos que já existem**

| Sala | Quantidade | Fotos disponíveis | Itens (confirmar) |
|---|---|---|---|
| Massoterapia | 3 | sala-massoterapia.jpg | Maca de madeira |
| Salas com maca | 4 | sala-maca-janela, sala-maca-mesa-quadro-arvore, sala-maca-quadros-trigo, sala-maca-quadros-gratidao | Maca; pia e mocho em algumas |
| Injetáveis | 1 | sala-injetaveis.jpg | Frigobar, cadeira reclinável, pia |
| Psicologia | 1 | sala-psicologia, sala-psicologia-alternativa | Poltronas, recamier |
| Espaço kids | 1 | espaco-kids.jpg | Mesa infantil, tapete emborrachado, brinquedos |
| Sala de cursos | 1 | sala-cursos.jpg | Projetor, quadro branco, cadeiras em fileiras (capacidade: [__ pessoas]) |
| Salas superiores | [?] | sala-escritorio-reunioes.jpg [confirmar se é uma superior] | Mobiliário personalizável |

> **Fotos:** a maioria das salas tem só 1 foto. Para o catálogo ficar com cara de plataforma, o ideal são **3 ou 4 fotos por sala**, com a mesma luz e ângulos parecidos. É a mesma sessão de fotos profissional que o plano propõe para a capa e para o Google.

---

## 4. Uma fonte de dados para o site e para o agente

Para o site e o agente de WhatsApp **falarem a mesma língua**, as informações das salas ficam num **único arquivo** (`salas.json`). O site lê esse arquivo para montar os cartões, e o agente lê o mesmo arquivo para responder. Quando um preço mudar, muda num lugar só.

```json
{
  "id": "massoterapia",
  "nome": "Massoterapia",
  "quantidade": 3,
  "area_m2": null,
  "grupo": ["estetica", "saude"],
  "itens": ["Maca de madeira", "Ar-condicionado", "Wi-fi"],
  "ideal_para": ["Massoterapeutas", "Terapeutas"],
  "fotos": ["assets/fotos/sala-massoterapia.jpg"],
  "preco_a_partir": { "valor": 50, "unidade": "hora" },
  "agenda_id": null
}
```

O campo `area_m2` fica `null` até chegarem as medidas, e o `agenda_id` só é preenchido na fase 2.

---

## 5. Revisão de textos, fontes, cores e alinhamento

- **Textos:** frases curtas, um assunto por seção, nada repetido. A regra do `CLAUDE.md` continua: só dados reais.
- **Fontes:** Cormorant Garamond nos títulos (peso 500 ou 600, itálico só nas palavras de destaque) e Jost no texto (400 a 500). Corpo com no mínimo 17px.
- **Cores:** Café Preto e Mocha nos fundos escuros, Creme nos claros, Ouro só em destaques e botões, Ouro Claro em detalhes. Nunca dourado em texto pequeno sobre fundo claro (contraste fraco).
- **Alinhamento das imagens:**
  - todas as fotos do catálogo na mesma proporção (**4:3**), com `object-fit: cover` e ponto focal por foto;
  - cartões da mesma altura;
  - grade de 3 colunas no desktop, 2 no tablet e 1 no celular;
  - quando a última linha ficar incompleta, o cartão estica (a mesma regra que já usamos).
- **Componentes padronizados:** um estilo de botão principal, um de botão secundário, um de chip e um de selo de m², usados no site todo.

---

## 6. Perguntas para o cliente (antes de construir)
1. **Medidas (m²)** de cada sala (vocês já estão levantando).
2. **Salas superiores:** são parte das 11 (por exemplo, algumas das salas com maca ficam no andar de cima)? Quantas são? A sala de escritório e reuniões é uma delas?
3. **O preço por hora é o mesmo para todas as salas?** Injetáveis, cursos e kids também custam R$ 50?
4. **Capacidade da sala de cursos** (número de pessoas).
5. **Itens de cada sala** (pia, mocho, armário etc.), para os chips não prometerem o que não existe.
6. **Horário real** de funcionamento.
7. **Logo:** adotar o Conceito 01 no site agora ou só depois da aprovação dos sócios? Até lá, a maquete usa a logo atual.
8. **Reserva fase 2:** qual agenda usam hoje para controlar as salas (caderno, Google Agenda, planilha)? Isso define o caminho da fase 2.

---

## Decisões de 08/10/2026 (aplicadas no site)

- **Marca:** fontes (Fraunces e Nunito Sans) e cores atuais **mantidas**. O Conceito 01 só entra se os sócios aprovarem.
- **Salas superiores:** fazem parte das 11. A foto de escritório e reuniões é do **térreo**.
- **Horário:** segunda a sexta, das 8h às 17h. Mais cedo e aos sábados pela manhã, sob agendamento.
- **Menu:** Salas · Como funciona · Valores · **Sobre** · Dúvidas · Localização + "Agendar visita".
- **Sobre:** sem nomes nem profissões dos sócios, em tom formal.
- **Reservar:** abre a sala com um **calendário**; o cliente escolhe o dia, o período e a modalidade, e a mensagem chega pronta no WhatsApp, em campos fixos, para a equipe (e depois o agente) responder.
- **Medidas:** a planta tem as 12 salas medidas, mas sem o uso. Os cartões ficam sem m² até os sócios preencherem `docs/mapa-das-salas.md`.

- **Ordem final das seções (08/10):** Topo · Sobre · Para quem é · Salas · Como funciona · Estrutura · Ambientes comuns · Valores · Dúvidas · Localização · Chamada final. Cada seção responde à próxima pergunta do visitante, e o preço vem depois de mostrar o que está incluso.

## 7. Ordem sugerida de execução (depois do "aprovado")
1. Fontes e cores do Conceito 01 + menu de 5 itens + botões "Agendar visita".
2. Catálogo de Salas com detalhe e reserva fase 1 (WhatsApp), lendo do `salas.json`.
3. Ambientes comuns no lugar da galeria + FAQ em abas.
4. Revisão completa pelo checklist do `CLAUDE.md`.
5. Fase 2 (agenda real), junto com o agente de WhatsApp.
