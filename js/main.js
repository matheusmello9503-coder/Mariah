// Mariah Espaço Comercial — main.js
// Só melhorias progressivas: nenhum conteúdo depende deste arquivo para aparecer.
// Sem JavaScript, "Reservar" e "Agendar visita" abrem o WhatsApp direto.

(function () {
  "use strict";

  var WHATSAPP = "https://wa.me/556798537650?text=";
  var DIAS_A_FRENTE = 60; // até quantos dias à frente o calendário aceita

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
    el("r-intro").textContent = "Escolha o dia e o período. A mensagem chega pronta no WhatsApp da Mariah.";
    el("r-enviar").textContent = "Solicitar reserva pelo WhatsApp";
    el("r-nota").textContent = "A reserva é confirmada pela nossa equipe no WhatsApp, conforme a disponibilidade da sala.";
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
    // "Reservar" desce direto até o calendário.
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
     Calendário
     ------------------------------------------------------------------ */
  var hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  var limite = new Date(hoje);
  limite.setDate(limite.getDate() + DIAS_A_FRENTE);

  var mesVisivel = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  var diaEscolhido = null;

  var NOMES_DIA = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
  var NOMES_MES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

  function doisDigitos(n) { return (n < 10 ? "0" : "") + n; }
  function dataCurta(d) { return doisDigitos(d.getDate()) + "/" + doisDigitos(d.getMonth() + 1) + "/" + d.getFullYear(); }
  function mesmoDia(a, b) { return a && b && a.getTime() === b.getTime(); }

  function desenharCalendario() {
    var ano = mesVisivel.getFullYear(), mes = mesVisivel.getMonth();
    var nomeMes = NOMES_MES[mes];
    el("cal-mes").textContent = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1) + " de " + ano;
    el("cal-ant").disabled = ano === hoje.getFullYear() && mes === hoje.getMonth();
    el("cal-prox").disabled = new Date(ano, mes + 1, 1) > limite;

    var dias = el("cal-dias");
    dias.innerHTML = "";
    var inicio = new Date(ano, mes, 1).getDay();
    for (var v = 0; v < inicio; v++) dias.appendChild(document.createElement("span"));

    var total = new Date(ano, mes + 1, 0).getDate();
    for (var d = 1; d <= total; d++) {
      var data = new Date(ano, mes, d);
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = d;
      var semana = data.getDay();
      var fechado = semana === 0;
      b.disabled = data < hoje || data > limite || fechado;
      b.setAttribute("aria-label", d + " de " + NOMES_MES[mes] + ", " + NOMES_DIA[semana] + (fechado ? ", fechado" : ""));
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
    var sabado = data.getDay() === 6;
    el("cal-escolha").innerHTML = "Dia escolhido: <strong>" + NOMES_DIA[data.getDay()] + ", " +
      data.getDate() + " de " + NOMES_MES[data.getMonth()] + "</strong>" +
      (sabado ? ". Aos sábados, só pela manhã e com agendamento." : ".");

    // Sábado: só manhã
    form.querySelectorAll('input[name="periodo"]').forEach(function (r) {
      var bloquear = sabado && r.value !== "manhã";
      r.disabled = bloquear;
      if (bloquear && r.checked) r.checked = false;
    });
    el("r-erro").textContent = "";
    desenharCalendario();
  }

  el("cal-ant").addEventListener("click", function () {
    mesVisivel = new Date(mesVisivel.getFullYear(), mesVisivel.getMonth() - 1, 1);
    desenharCalendario();
  });
  el("cal-prox").addEventListener("click", function () {
    mesVisivel = new Date(mesVisivel.getFullYear(), mesVisivel.getMonth() + 1, 1);
    desenharCalendario();
  });

  function reiniciarReserva() {
    diaEscolhido = null;
    mesVisivel = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    el("cal-escolha").textContent = "Nenhum dia selecionado.";
    form.querySelectorAll('input[name="periodo"]').forEach(function (r) { r.checked = false; r.disabled = false; });
    el("r-erro").textContent = "";
    desenharCalendario();
  }

  /* ------------------------------------------------------------------
     Envio: monta a mensagem em campos fixos (fácil de ler para a equipe
     e, no futuro, para o agente de WhatsApp) e abre o WhatsApp
     ------------------------------------------------------------------ */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var periodo = form.querySelector('input[name="periodo"]:checked');
    var nome = el("r-nome").value.trim();
    var prof = el("r-prof").value.trim();

    var faltando = [];
    if (!diaEscolhido) faltando.push("o dia");
    if (!periodo) faltando.push("o período");
    if (!nome) faltando.push("o seu nome");
    if (faltando.length) {
      el("r-erro").textContent = "Falta escolher " + faltando.join(", ").replace(/, ([^,]*)$/, " e $1") + ".";
      return;
    }
    el("r-erro").textContent = "";

    var linhas = [];
    if (modo === "sala") {
      linhas.push("Olá! Gostaria de solicitar uma reserva.");
      linhas.push("Sala: " + salaAtual.nome);
    } else {
      linhas.push("Olá! Gostaria de agendar uma visita ao espaço.");
    }
    linhas.push("Data: " + dataCurta(diaEscolhido) + " (" + NOMES_DIA[diaEscolhido.getDay()] + ")");
    linhas.push("Período: " + periodo.value);
    if (modo === "sala") linhas.push("Modalidade: " + el("r-modalidade").value.toLowerCase());
    else linhas.push("Sala de interesse: " + el("r-interesse").value.toLowerCase());
    linhas.push("Nome: " + nome);
    if (prof) linhas.push("Profissão: " + prof);

    var url = WHATSAPP + encodeURIComponent(linhas.join("\n"));
    // Com "noopener" o window.open sempre devolve null; por isso o opener é cortado à mão.
    var aba = window.open(url, "_blank");
    if (aba) aba.opener = null;
    else window.location.href = url; // pop-up bloqueado: abre na mesma aba
  });
})();
