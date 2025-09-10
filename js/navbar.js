// navbar.js - JavaScript для навбара

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Navbar JS loaded");

  // Добавляем hover эффекты для ссылок навбара
  const navLinks = document.querySelectorAll(".navbar-nav a");
  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      link.style.transform = "translateY(-1px)";
    });

    link.addEventListener("mouseleave", () => {
      link.style.transform = "translateY(0)";
    });
  });

  // Добавляем hover эффекты для кнопок
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      if (button.classList.contains("btn-signup")) {
        button.style.boxShadow = "0 4px 20px rgba(61, 115, 235, 0.4)";
      }
    });

    button.addEventListener("mouseleave", () => {
      if (button.classList.contains("btn-signup")) {
        button.style.boxShadow = "";
      }
    });
  });

  // Определяем активную страницу
  setActivePage();
});

function setActivePage() {
  const currentPage = window.location.pathname
    .split("/")
    .pop()
    .replace(".html", "");
  const navLinks = document.querySelectorAll(".navbar-nav a");

  // Подсветка активной страницы (можно расширить логику)
  if (currentPage === "registration") {
    const signUpBtn = document.querySelector(".btn-signup");
    if (signUpBtn) {
      signUpBtn.style.opacity = "0.8";
    }
  }

  if (currentPage === "login") {
    const loginBtn = document.querySelector(".btn-login");
    if (loginBtn) {
      loginBtn.style.opacity = "0.8";
    }
  }
}
