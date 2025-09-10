// navbar.js - Модуль для переиспользования навбара

class ModularNavbar {
  constructor(options = {}) {
    this.containerId = options.containerId || "navbar-container";
    this.navbarPath = options.navbarPath || "./components/navbar/navbar.html";
    this.init();
  }

  async init() {
    try {
      await this.loadNavbar();
      this.bindEvents();
      console.log("Navbar successfully loaded");
    } catch (error) {
      console.error("Error loading navbar:", error);
    }
  }

  async loadNavbar() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      throw new Error(`Container with id "${this.containerId}" not found`);
    }

    // Загружаем HTML навбара
    const response = await fetch(this.navbarPath);
    if (!response.ok) {
      throw new Error(`Failed to load navbar: ${response.status}`);
    }

    const navbarHTML = await response.text();
    container.innerHTML = navbarHTML;
  }

  bindEvents() {
    // Добавляем обработчики событий для навбара
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    // Обработчик для активной страницы
    this.setActiveLink();

    // Обработчик для плавной прокрутки (если нужно)
    this.initSmoothScroll();
  }

  setActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(".navbar-nav a");

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (
        href &&
        (currentPath.includes(href.substring(1)) ||
          (currentPath === "/" && href === "#home"))
      ) {
        link.classList.add("active");
      }
    });
  }

  initSmoothScroll() {
    const navLinks = document.querySelectorAll('.navbar-nav a[href^="#"]');

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  // Статический метод для быстрого создания навбара
  static async create(containerId = "navbar-container") {
    return new ModularNavbar({ containerId });
  }

  // Метод для обновления активной ссылки (полезно для SPA)
  updateActiveLink(activeHref) {
    const navLinks = document.querySelectorAll(".navbar-nav a");

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === activeHref) {
        link.classList.add("active");
      }
    });
  }
}

// Автоинициализация при загрузке DOM
document.addEventListener("DOMContentLoaded", () => {
  const navbarContainer = document.getElementById("navbar-container");
  if (navbarContainer) {
    ModularNavbar.create("navbar-container");
  }
});

// Экспорт для использования в модулях
if (typeof module !== "undefined" && module.exports) {
  module.exports = ModularNavbar;
}
