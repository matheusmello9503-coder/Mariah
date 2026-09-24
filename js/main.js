// Mariah Espaço Comercial — main.js
// Só melhorias progressivas: nenhum conteúdo depende deste arquivo para aparecer.

(function () {
  "use strict";

  // Fecha o menu mobile (<details>) ao clicar em um link ou fora dele.
  var navMobile = document.querySelector(".nav-mobile");
  if (!navMobile) return;

  var links = navMobile.querySelectorAll("a");
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      navMobile.removeAttribute("open");
    });
  });

  document.addEventListener("click", function (event) {
    if (navMobile.hasAttribute("open") && !navMobile.contains(event.target)) {
      navMobile.removeAttribute("open");
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      navMobile.removeAttribute("open");
    }
  });
})();
