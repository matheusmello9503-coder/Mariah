// Mariah Espaço Comercial — main.js
// Só melhorias progressivas: nenhum conteúdo depende deste arquivo para aparecer.
// Sem JavaScript, "Reservar" e "Agendar visita" abrem o WhatsApp direto.

(function () {
  "use strict";

  var WHATSAPP = "https://wa.me/556798537650?text=";
  var DIAS_A_FRENTE = 60; // até quantos dias à frente o calendário aceita

  // Disponibilidade das salas, lida do Google Agenda por um fluxo do n8n.
  // Enquanto AGENDA_URL estiver vazio, todos os horários aparecem livres e a
  // equipe confirma a disponibilidade pelo WhatsApp.
  // Contrato esperado: GET AGENDA_URL?sala=<tipo-de-sala>&data=AAAA-MM-DD
  //   → { "ocupados": [11, 14] }  (horas de início sem nenhuma sala livre daquele tipo)
  // Para mostrar aos sócios como fica, abra o site com ?demo-agenda (horários fictícios).
  var AGENDA_URL = "";
  var DEMO_AGENDA = /[?&]demo-agenda\b/.test(location.search);

  var PRECO = { hora: 50, pacote5: 225, pacote10: 400, diaria: 400, fixo: 550, fixoAdicional: 300 };
  var ABRE = 8, FECHA = 17, FECHA_SABADO = 12;

  /* ------------------------------------------------------------------
     Menu mobile (<details>): fecha ao clicar num link, fora dele ou no Esc
     ------------------------------------------------------------------ */
  var navMobile = document.querySelector(".nav-mobile");
  if (navMobile) {
    navMobile.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { navMobile.removeAttribute("open"); });
    });
    document.addEventListener("click", function (e) {
      if (navMobile.hasAttribute("open") && !navMobile.contains(e.target)) navMobile.removeAttribute("open");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") navMobile.removeAttribute("open");
    });
  }

  /* ------------------------------------------------------------------
     Catálogo: filtros e cartão largo na última linha
     ------------------------------------------------------------------ */
  var grade = document.getElementById("salas-grid");
  var cartoes = grade ? Array.prototype.slice.call(grade.querySelectorAll(".sala")) : [];

  function ajustarUltimaLinha() {
    if (!grade) return;
    var visiveis = cartoes.filter(function (c) { return !c.hidden; });
    visiveis.forEach(function (c) { c.classList.remove("larga"); });
    var colunas = getComputedStyle(grade).gridTemplateColumns.split(" ").length;
    if (colunas > 1 && visiveis.length % colunas === 1) {
      visiveis[visiveis.length - 1].classList.add("larga");
    }
  }

  document.querySelectorAll(".chip-filtro").forEach(function (botao) {
    botao.addEventListener("click", function () {
      document.querySelectorAll(".chip-filtro").forEach(function (b) {
        b.setAttribute("aria-pressed", b === botao ? "true" : "false");
      });
      var filtro = botao.getAttribute("data-filtro");
      cartoes.forEach(function (c) {
        var grupos = (c.getAttribute("data-grupos") || "").split(" ");
        c.hidden = filtro !== "todas" && grupos.indexOf(filtro) === -1;
      });
      ajustarUltimaLinha();
    });
  });

  ajustarUltimaLinha();
  window.addEventListener("resize", ajustarUltimaLinha);

  /* ------------------------------------------------------------------
     Janela: detalhe da sala + reserva, ou agendamento de visita
     ------------------------------------------------------------------ */
  var janela = document.getElementById("janela");
  if (!janela) return;

  var el = function (id) { return document.getElementById(id); };
  var form = el("reserva");
  var ultimoFoco = null;
  var salaAtual = null;   // { nome, fotos: [{src, pos, alt}] }
  var modo = "sala";      // "sala" ou "visita"

  function lerCartao(cartao) {
    var nome = cartao.querySelector("h3").textContent.trim();
    var imgPrincipal = cartao.querySelector(".sala-foto img");
    var fotos = (cartao.getAttribute("data-fotos") || "").split(";").filter(Boolean).map(function (item, i) {
      var partes = item.split("|");
      return {
        src: "assets/fotos/" + partes[0],
        pos: partes[1] || "center",
        alt: i === 0 && imgPrincipal ? imgPrincipal.alt : nome + ", foto " + (i + 1)
      };
    });
    var desc = cartao.querySelector(".sala-desc");
    var ideal = cartao.querySelector(".sala-ideal");
    return {
      nome: nome,
      qtd: cartao.querySelector(".sala-qtd").textContent.trim(),
      desc: desc ? desc.textContent.trim() : "",
      itens: Array.prototype.map.call(cartao.querySelectorAll(".sala-itens li"), function (li) { return li.textContent.trim(); }),
      idealHTML: ideal ? ideal.innerHTML : "",
      fotos: fotos
    };
  }

  function mostrarFoto(i) {
    var foto = salaAtual.fotos[i];
    var img = el("j-foto");
    img.src = foto.src;
    img.alt = foto.alt;
    img.style.objectPosition = foto.pos;
    el("j-miniaturas").querySelectorAll("button").forEach(function (b, k) {
      b.setAttribute("aria-current", k === i ? "true" : "false");
    });
  }

  function preencherSala(sala) {
    salaAtual = sala;
    el("j-titulo").textContent = sala.nome;
    el("j-qtd").textContent = sala.qtd;
    el("j-desc").textContent = sala.desc;
    el("j-desc").hidden = !sala.desc;
    el("j-itens").innerHTML = "";
    sala.itens.forEach(function (t) {
      var li = document.createElement("li");
      li.textContent = t;
      el("j-itens").appendChild(li);
    });
    el("j-ideal").innerHTML = sala.idealHTML;

    var mini = el("j-miniaturas");
    mini.innerHTML = "";
    if (sala.fotos.length > 1) {
      sala.fotos.forEach(function (f, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Ver foto " + (i + 1) + " de " + sala.fotos.length);
        var im = document.createElement("img");
        im.src = f.src;
        im.alt = "";
        im.style.objectPosition = f.pos;
        b.appendChild(im);
        b.addEventListener("click", function () { mostrarFoto(i); });
        mini.appendChild(b);
      });
    }
    mostrarFoto(0);

    el("r-titulo").textContent = "Reservar esta sala";
    el("r-intro").textContent = "Escolha a modalidade, o dia e o horário. O valor aparece no resumo.";
    el("r-enviar").textContent = "Solicitar reserva pelo WhatsApp";
    el("r-nota").textContent = "O WhatsApp abre com o seu pedido pronto. A confirmação do horário e o pagamento são feitos por lá.";
  }

  function prepararVisita() {
    salaAtual = null;
    el("j-titulo").textContent = "Agende sua visita";
    el("r-titulo").textContent = "Agende sua visita";
    el("r-intro").textContent = "Venha conhecer o espaço sem compromisso. Escolha o melhor dia e período.";
    el("r-enviar").textContent = "Agendar pelo WhatsApp";
    el("r-nota").textContent = "Nossa equipe confirma o horário da visita pelo WhatsApp.";
  }

  function abrir(novoModo, cartao, focoReserva) {
    modo = novoModo;
    ultimoFoco = document.activeElement;
    janela.classList.toggle("modo-sala", modo === "sala");
    janela.classList.toggle("modo-visita", modo === "visita");
    ["j-galeria", "j-cabecalho", "j-valores"].forEach(function (id) { el(id).hidden = modo === "visita"; });

    if (modo === "sala") preencherSala(lerCartao(cartao));
    else prepararVisita();

    reiniciarReserva();
    janela.hidden = false;
    document.body.classList.add("travado");
    janela.scrollTop = 0;

    // No desktop o painel de reserva já aparece ao lado da foto; no celular,
    // "Reservar" desce direto até o formulário.
    if (focoReserva && modo === "sala" && window.matchMedia("(max-width: 900px)").matches) {
      form.scrollIntoView({ block: "start" });
    }
    janela.querySelector(".janela-fechar").focus({ preventScroll: true });
  }

  function fechar() {
    janela.hidden = true;
    document.body.classList.remove("travado");
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }

  // Cartões: "Ver sala", foto e "Reservar"
  cartoes.forEach(function (cartao) {
    var ver = cartao.querySelector("[data-ver]");
    var foto = cartao.querySelector(".sala-foto");
    var reservar = cartao.querySelector("[data-reservar]");
    if (ver) ver.addEventListener("click", function () { abrir("sala", cartao, false); });
    if (foto) foto.addEventListener("click", function () { abrir("sala", cartao, false); });
    if (reservar) reservar.addEventListener("click", function (e) {
      e.preventDefault();
      abrir("sala", cartao, true);
    });
  });

  // Botões "Agendar visita"
  document.querySelectorAll("[data-visita]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      if (navMobile) navMobile.removeAttribute("open");
      abrir("visita", null, true);
    });
  });

  // Fechar: botão, clique no fundo, Esc. Foco preso dentro da janela.
  janela.addEventListener("click", function (e) {
    if (e.target === janela || e.target.closest("[data-fechar]")) fechar();
  });
  document.addEventListener("keydown", function (e) {
    if (janela.hidden) return;
    if (e.key === "Escape") { fechar(); return; }
    if (e.key !== "Tab") return;
    var focaveis = Array.prototype.filter.call(
      janela.querySelectorAll("button, a[href], input, select, textarea"),
      function (n) { return !n.disabled && n.offsetParent !== null; }
    );
    if (!focaveis.length) return;
    var primeiro = focaveis[0], ultimo = focaveis[focaveis.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
  });

  /* ------------------------------------------------------------------
     Formatação
     ------------------------------------------------------------------ */
  var NOMES_DIA = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
  var NOMES_MES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

  function doisDigitos(n) { return (n < 10 ? "0" : "") + n; }
  function dataCurta(d) { return doisDigitos(d.getDate()) + "/" + doisDigitos(d.getMonth() + 1) + "/" + d.getFullYear(); }
  function dataISO(d) { return d.getFullYear() + "-" + doisDigitos(d.getMonth() + 1) + "-" + doisDigitos(d.getDate()); }
  function dataLonga(d) {
    var dia = NOMES_DIA[d.getDay()];
    return dia.charAt(0).toUpperCase() + dia.slice(1) + ", " + d.getDate() + " de " + NOMES_MES[d.getMonth()];
  }
  function mesmoDia(a, b) { return a && b && a.getTime() === b.getTime(); }
  function hora(h) { return h + "h"; }
  function horas(n) { return n + (n === 1 ? " hora" : " horas"); }
  function reais(v) {
    return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
  }
  function slug(t) {
    return t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  /* ------------------------------------------------------------------
     Estado da reserva
     ------------------------------------------------------------------ */
  var hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  var limite = new Date(hoje);
  limite.setDate(limite.getDate() + DIAS_A_FRENTE);

  var mesVisivel = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  var diaEscolhido = null;
  var inicio = null;      // hora de início (por hora e pacotes)
  var duracao = 1;        // em horas
  var qtdFixo = 1;        // períodos por semana (período fixo)
  var agenda = { estado: "sem-agenda", ocupados: [] };
  var cacheAgenda = {};

  function modalidade() {
    var r = form.querySelector('input[name="modalidade"]:checked');
    return r ? r.value : "hora";
  }
  function porHoras(m) { return m === "hora" || m === "pacote5" || m === "pacote10"; }
  function fechamento(d) { return d && d.getDay() === 6 ? FECHA_SABADO : FECHA; }
  // Diária e período fixo da tarde não existem aos sábados (só manhã, com agendamento)
  function sabadoBloqueado(m) { return m === "diaria"; }

  /* ------------------------------------------------------------------
     Calendário
     ------------------------------------------------------------------ */
  function desenharCalendario() {
    var ano = mesVisivel.getFullYear(), mes = mesVisivel.getMonth();
    var nomeMes = NOMES_MES[mes];
    el("cal-mes").textContent = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1) + " de " + ano;
    el("cal-ant").disabled = ano === hoje.getFullYear() && mes === hoje.getMonth();
    el("cal-prox").disabled = new Date(ano, mes + 1, 1) > limite;

    var bloqueiaSabado = modo === "sala" && sabadoBloqueado(modalidade());
    var dias = el("cal-dias");
    dias.innerHTML = "";
    var vazio = new Date(ano, mes, 1).getDay();
    for (var v = 0; v < vazio; v++) dias.appendChild(document.createElement("span"));

    var total = new Date(ano, mes + 1, 0).getDate();
    for (var d = 1; d <= total; d++) {
      var data = new Date(ano, mes, d);
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = d;
      var semana = data.getDay();
      var fechado = semana === 0 || (semana === 6 && bloqueiaSabado);
      b.disabled = data < hoje || data > limite || fechado;
      b.setAttribute("aria-label", d + " de " + NOMES_MES[mes] + ", " + NOMES_DIA[semana] + (fechado ? ", indisponível" : ""));
      b.setAttribute("aria-pressed", mesmoDia(data, diaEscolhido) ? "true" : "false");
      if (semana === 6) b.classList.add("sabado");
      if (mesmoDia(data, hoje)) b.classList.add("hoje");
      (function (dataDoBotao) {
        b.addEventListener("click", function () { escolherDia(dataDoBotao); });
      })(data);
      dias.appendChild(b);
    }
  }

  function escolherDia(data) {
    diaEscolhido = data;
    el("r-erro").textContent = "";
    desenharCalendario();
    carregarAgenda();
  }

  function textoDiaEscolhido() {
    if (!diaEscolhido) return "Nenhum dia selecionado.";
    var sabado = diaEscolhido.getDay() === 6;
    var m = modalidade();
    var prefixo = modo === "sala" && (m === "fixo" || m === "mensal") ? "Início: " : "Dia escolhido: ";
    return prefixo + "<strong>" + NOMES_DIA[diaEscolhido.getDay()] + ", " + diaEscolhido.getDate() + " de " +
      NOMES_MES[diaEscolhido.getMonth()] + "</strong>" + (sabado ? ". Aos sábados, só pela manhã e com agendamento." : ".");
  }

  el("cal-ant").addEventListener("click", function () {
    mesVisivel = new Date(mesVisivel.getFullYear(), mesVisivel.getMonth() - 1, 1);
    desenharCalendario();
  });
  el("cal-prox").addEventListener("click", function () {
    mesVisivel = new Date(mesVisivel.getFullYear(), mesVisivel.getMonth() + 1, 1);
    desenharCalendario();
  });

  /* ------------------------------------------------------------------
     Agenda (Google Agenda via n8n, ou demonstração)
     ------------------------------------------------------------------ */
  function chaveAgenda() { return salaAtual && diaEscolhido ? slug(salaAtual.nome) + "|" + dataISO(diaEscolhido) : ""; }

  function ocupadosDemo(chave) {
    var n = 0;
    for (var i = 0; i < chave.length; i++) n = (n * 31 + chave.charCodeAt(i)) % 9973;
    var lista = [];
    for (var h = ABRE; h < FECHA; h++) if ((n + h * 7) % 5 === 0) lista.push(h);
    return lista;
  }

  function carregarAgenda() {
    var chave = chaveAgenda();
    if (!chave || modo !== "sala" || (!AGENDA_URL && !DEMO_AGENDA)) {
      agenda = { estado: "sem-agenda", ocupados: [] };
      atualizar();
      return;
    }
    if (cacheAgenda[chave]) { agenda = cacheAgenda[chave]; atualizar(); return; }
    if (DEMO_AGENDA) {
      agenda = cacheAgenda[chave] = { estado: "demo", ocupados: ocupadosDemo(chave) };
      atualizar();
      return;
    }
    agenda = { estado: "carregando", ocupados: [] };
    atualizar();
    fetch(AGENDA_URL + "?sala=" + encodeURIComponent(slug(salaAtual.nome)) + "&data=" + dataISO(diaEscolhido))
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (json) { cacheAgenda[chave] = { estado: "ok", ocupados: (json.ocupados || []).map(Number) }; })
      .catch(function () { cacheAgenda[chave] = { estado: "erro", ocupados: [] }; })
      .then(function () {
        if (chave !== chaveAgenda()) return; // o dia ou a sala mudou durante a consulta
        agenda = cacheAgenda[chave];
        atualizar();
      });
  }

  function ocupado(h) { return agenda.ocupados.indexOf(h) !== -1; }

  function textoAgenda() {
    if (!diaEscolhido) return "";
    if (agenda.estado === "carregando") return "Consultando a agenda…";
    if (agenda.estado === "demo") return '<span class="selo-demo">DEMONSTRAÇÃO</span>Horários ocupados fictícios, para mostrar como a agenda aparece.';
    if (agenda.estado === "ok") return "Horários conforme a agenda do Mariah. A confirmação final é feita pelo WhatsApp.";
    return "A disponibilidade é confirmada pela nossa equipe no WhatsApp.";
  }

  /* ------------------------------------------------------------------
     Horários e duração
     ------------------------------------------------------------------ */
  function duracaoMaxima() {
    if (inicio === null || !diaEscolhido) return 1;
    var max = fechamento(diaEscolhido) - inicio;
    for (var h = inicio; h < inicio + max; h++) {
      if (ocupado(h)) { max = h - inicio; break; }
    }
    var m = modalidade();
    if (m === "pacote5") max = Math.min(max, 5);
    if (m === "pacote10") max = Math.min(max, 10);
    return Math.max(1, max);
  }

  function desenharHorarios() {
    var caixa = el("r-horarios");
    caixa.innerHTML = "";
    if (!diaEscolhido) {
      caixa.innerHTML = '<p class="r-vazio">Escolha um dia para ver os horários.</p>';
      return;
    }
    var fecha = fechamento(diaEscolhido);
    for (var h = ABRE; h < fecha; h++) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = hora(h);
      var oc = ocupado(h);
      b.disabled = oc || agenda.estado === "carregando";
      if (oc) b.classList.add("ocupado");
      b.setAttribute("aria-label", hora(h) + (oc ? ", ocupado" : ""));
      b.setAttribute("aria-pressed", inicio !== null && h >= inicio && h < inicio + duracao ? "true" : "false");
      if (h === inicio) b.classList.add("inicio");
      (function (hh) {
        b.addEventListener("click", function () {
          inicio = hh;
          duracao = Math.min(duracao, duracaoMaxima());
          el("r-erro").textContent = "";
          atualizar();
        });
      })(h);
      caixa.appendChild(b);
    }
  }

  el("dur-menos").addEventListener("click", function () { duracao = Math.max(1, duracao - 1); atualizar(); });
  el("dur-mais").addEventListener("click", function () { duracao = Math.min(duracaoMaxima(), duracao + 1); atualizar(); });
  el("qtd-menos").addEventListener("click", function () { qtdFixo = Math.max(1, qtdFixo - 1); atualizar(); });
  el("qtd-mais").addEventListener("click", function () { qtdFixo = Math.min(5, qtdFixo + 1); atualizar(); });

  form.querySelectorAll('input[name="modalidade"]').forEach(function (r) {
    r.addEventListener("change", function () {
      if (diaEscolhido && diaEscolhido.getDay() === 6 && sabadoBloqueado(modalidade())) diaEscolhido = null;
      duracao = Math.min(duracao, duracaoMaxima());
      el("r-erro").textContent = "";
      desenharCalendario();
      atualizar();
    });
  });
  form.querySelectorAll('input[name="periodo-fixo"], #r-primeira').forEach(function (r) {
    r.addEventListener("change", atualizar);
  });

  /* ------------------------------------------------------------------
     Valor total
     ------------------------------------------------------------------ */
  function calcular() {
    var m = modalidade();
    var periodoFixo = form.querySelector('input[name="periodo-fixo"]:checked');
    var r = { linhas: [], total: null, totalTexto: "", totalRotulo: "Total", quando: "", obs: "", dica: "", sinal: false };
    var dia = diaEscolhido ? dataLonga(diaEscolhido) : "";
    var faixa = inicio !== null ? hora(inicio) + " às " + hora(inicio + duracao) : "";

    if (m === "hora") {
      r.quando = dia && faixa ? dia + " · " + faixa : "Escolha o dia e o horário";
      r.linhas.push([horas(duracao) + " × " + reais(PRECO.hora), reais(duracao * PRECO.hora)]);
      r.total = duracao * PRECO.hora;
      r.sinal = true;
      if (duracao >= 8) r.dica = "Para o dia inteiro, a diária sai por " + reais(PRECO.diaria) + ".";
      else if (duracao >= 5) r.dica = "No pacote de 5 horas, você paga " + reais(PRECO.pacote5) + " (" + reais(PRECO.pacote5 / 5) + " por hora).";
    } else if (m === "pacote5" || m === "pacote10") {
      var n = m === "pacote5" ? 5 : 10;
      r.quando = dia && faixa ? "1º uso: " + dia + " · " + faixa : "Escolha o dia e o horário do primeiro uso";
      r.linhas.push(["Pacote de " + n + " horas", reais(PRECO[m])]);
      if (faixa) r.linhas.push(["Usadas neste dia", horas(duracao)]);
      r.total = PRECO[m];
      r.sinal = true;
      r.obs = "Equivale a " + reais(PRECO[m] / n) + " por hora. As horas restantes ficam para os próximos atendimentos.";
    } else if (m === "diaria") {
      r.quando = dia ? dia + " · 8h às 17h" : "Escolha o dia";
      r.linhas.push(["Diária, das 8h às 17h", reais(PRECO.diaria)]);
      r.total = PRECO.diaria;
      r.sinal = true;
    } else if (m === "fixo") {
      var semana = diaEscolhido ? "Toda " + NOMES_DIA[diaEscolhido.getDay()] : "";
      r.quando = semana && periodoFixo ? semana + ", " + (periodoFixo.value === "manhã" ? "de manhã" : "à tarde") + " · a partir de " + diaEscolhido.getDate() + " de " + NOMES_MES[diaEscolhido.getMonth()]
        : "Escolha o dia de início e o período";
      r.linhas.push(["1 período por semana", reais(PRECO.fixo)]);
      if (qtdFixo > 1) r.linhas.push([(qtdFixo - 1) + (qtdFixo === 2 ? " período adicional" : " períodos adicionais") + " × " + reais(PRECO.fixoAdicional), reais((qtdFixo - 1) * PRECO.fixoAdicional)]);
      r.total = PRECO.fixo + (qtdFixo - 1) * PRECO.fixoAdicional;
      r.totalRotulo = "Total por mês";
      if (qtdFixo > 1) r.obs = "Os dias dos períodos adicionais são combinados pelo WhatsApp.";
    } else {
      r.quando = dia ? "A partir de " + diaEscolhido.getDate() + " de " + NOMES_MES[diaEscolhido.getMonth()] : "Sala exclusiva, com uso ilimitado";
      r.totalTexto = "R$ 1.700 a R$ 2.500";
      r.totalRotulo = "Por mês";
      r.obs = "O valor depende do tamanho e do mobiliário da sala. Contrato com fiador ou caução.";
    }
    if (r.total !== null) r.totalTexto = reais(r.total);
    return r;
  }

  function desenharResumo() {
    var c = calcular();
    el("rs-sala").textContent = salaAtual ? salaAtual.nome : "";
    el("rs-quando").textContent = c.quando;
    el("rs-total-rot").textContent = c.totalRotulo;
    el("rs-total").textContent = c.totalTexto;
    el("rs-obs").textContent = c.obs;
    el("rs-dica").textContent = c.dica;

    function linhas(alvo, lista) {
      alvo.innerHTML = "";
      lista.forEach(function (l) {
        var div = document.createElement("div");
        var dt = document.createElement("dt");
        var dd = document.createElement("dd");
        dt.textContent = l[0];
        dd.textContent = l[1];
        div.appendChild(dt);
        div.appendChild(dd);
        alvo.appendChild(div);
      });
    }
    linhas(el("rs-linhas"), c.linhas);
    var primeira = el("r-primeira").checked;
    linhas(el("rs-sinal"), c.sinal && primeira ? [
      ["Sinal para confirmar (50%)", reais(c.total / 2)],
      ["Restante, no dia do uso", reais(c.total / 2)]
    ] : []);
  }

  /* ------------------------------------------------------------------
     Atualiza tudo o que depende das escolhas
     ------------------------------------------------------------------ */
  function atualizar() {
    var m = modalidade();
    var sala = modo === "sala";
    el("r-bloco-horas").hidden = !(sala && porHoras(m));
    el("r-bloco-diaria").hidden = !(sala && m === "diaria");
    el("r-bloco-fixo").hidden = !(sala && m === "fixo");
    el("r-leg-dia").textContent = sala && m === "fixo" ? "Dia da semana e início" :
      sala && m === "mensal" ? "A partir de quando (opcional)" : "Escolha o dia";
    el("cal-escolha").innerHTML = textoDiaEscolhido();

    if (inicio !== null && diaEscolhido && (inicio >= fechamento(diaEscolhido) || ocupado(inicio))) inicio = null;
    if (inicio === null) duracao = 1;
    duracao = Math.min(duracao, duracaoMaxima());

    desenharHorarios();
    el("dur-valor").textContent = horas(duracao);
    el("dur-menos").disabled = inicio === null || duracao <= 1;
    el("dur-mais").disabled = inicio === null || duracao >= duracaoMaxima();
    el("r-agenda").innerHTML = textoAgenda();

    var diariaOcupada = m === "diaria" && agenda.ocupados.length > 0;
    el("r-agenda-diaria").innerHTML = diariaOcupada
      ? "Este dia já tem horários reservados. Escolha outra data ou reserve por hora."
      : textoAgenda();

    // Período fixo aos sábados: só manhã
    var sabado = diaEscolhido && diaEscolhido.getDay() === 6;
    form.querySelectorAll('input[name="periodo-fixo"], input[name="periodo"]').forEach(function (r) {
      var bloquear = sabado && r.value !== "manhã";
      r.disabled = bloquear;
      if (bloquear && r.checked) r.checked = false;
    });

    el("qtd-valor").textContent = qtdFixo;
    el("qtd-menos").disabled = qtdFixo <= 1;
    el("qtd-mais").disabled = qtdFixo >= 5;

    if (sala) desenharResumo();
  }

  function reiniciarReserva() {
    diaEscolhido = null;
    inicio = null;
    duracao = 1;
    qtdFixo = 1;
    agenda = { estado: "sem-agenda", ocupados: [] };
    mesVisivel = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    form.querySelector('input[name="modalidade"][value="hora"]').checked = true;
    form.querySelectorAll('input[name="periodo"], input[name="periodo-fixo"]').forEach(function (r) { r.checked = false; r.disabled = false; });
    el("r-erro").textContent = "";
    desenharCalendario();
    atualizar();
  }

  /* ------------------------------------------------------------------
     Envio: monta a mensagem em campos fixos, um por linha (fácil de ler
     para a equipe e para o agente de WhatsApp) e abre o WhatsApp
     ------------------------------------------------------------------ */
  var NOME_MODALIDADE = {
    hora: "por hora", pacote5: "pacote de 5 horas", pacote10: "pacote de 10 horas",
    diaria: "diária", fixo: "período fixo semanal", mensal: "mensal"
  };

  function juntar(lista) { return lista.join(", ").replace(/, ([^,]*)$/, " e $1"); }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var m = modalidade();
    var nome = el("r-nome").value.trim();
    var prof = el("r-prof").value.trim();
    var periodo = form.querySelector('input[name="periodo"]:checked');
    var periodoFixo = form.querySelector('input[name="periodo-fixo"]:checked');

    var faltando = [];
    if (modo === "visita") {
      if (!diaEscolhido) faltando.push("o dia");
      if (!periodo) faltando.push("o período");
    } else {
      if (!diaEscolhido && m !== "mensal") faltando.push("o dia");
      if (porHoras(m) && diaEscolhido && inicio === null) faltando.push("o horário");
      if (m === "fixo" && !periodoFixo) faltando.push("o período");
    }
    if (!nome) faltando.push("o seu nome");
    if (faltando.length) {
      el("r-erro").textContent = "Falta escolher " + juntar(faltando) + ".";
      return;
    }
    if (modo === "sala" && m === "diaria" && agenda.ocupados.length) {
      el("r-erro").textContent = "Este dia já tem horários reservados. Escolha outra data.";
      return;
    }
    el("r-erro").textContent = "";

    var linhas = [];
    if (modo === "visita") {
      linhas.push("Olá! Gostaria de agendar uma visita ao espaço.");
      linhas.push("Data: " + dataCurta(diaEscolhido) + " (" + NOMES_DIA[diaEscolhido.getDay()] + ")");
      linhas.push("Período: " + periodo.value);
      linhas.push("Sala de interesse: " + el("r-interesse").value.toLowerCase());
    } else {
      var c = calcular();
      linhas.push("Olá! Gostaria de solicitar uma reserva.");
      linhas.push("Sala: " + salaAtual.nome);
      linhas.push("Modalidade: " + NOME_MODALIDADE[m]);
      if (diaEscolhido) {
        linhas.push((m === "fixo" || m === "mensal" ? "Início: " : "Data: ") +
          dataCurta(diaEscolhido) + " (" + NOMES_DIA[diaEscolhido.getDay()] + ")");
      }
      if (porHoras(m)) linhas.push("Horário: " + hora(inicio) + " às " + hora(inicio + duracao) + " (" + horas(duracao) + ")");
      if (m === "diaria") linhas.push("Horário: 8h às 17h");
      if (m === "fixo") {
        linhas.push("Período: toda " + NOMES_DIA[diaEscolhido.getDay()] + ", " + periodoFixo.value);
        linhas.push("Períodos por semana: " + qtdFixo);
      }
      linhas.push("Valor: " + c.totalTexto + (m === "fixo" || m === "mensal" ? " por mês" : ""));
    }
    linhas.push("Nome: " + nome);
    if (prof) linhas.push("Profissão: " + prof);
    if (modo === "sala") linhas.push("Primeira reserva: " + (el("r-primeira").checked ? "sim" : "não"));

    var url = WHATSAPP + encodeURIComponent(linhas.join("\n"));
    // Com "noopener" o window.open sempre devolve null; por isso o opener é cortado à mão.
    var aba = window.open(url, "_blank");
    if (aba) aba.opener = null;
    else window.location.href = url; // pop-up bloqueado: abre na mesma aba
  });
})();
