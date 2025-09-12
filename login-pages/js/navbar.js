// navbar.js - Отдельный файл для навбара
// Можно использовать на всех страницах сайта

(function () {
  "use strict";

  // Современный навбар - JavaScript функциональность
  class ModernNavbar {
    constructor() {
      this.navbar = document.querySelector(".navbar");
      this.mobileToggle = document.querySelector(".mobile-menu-toggle");
      this.mobileMenu = document.querySelector(".mobile-menu");
      this.isMenuOpen = false;

      this.init();
    }

    init() {
      if (!this.navbar || !this.mobileToggle || !this.mobileMenu) {
        console.warn("Navbar elements not found");
        return;
      }

      this.setupEventListeners();
      this.setupAccessibility();
      this.handleResize();

      console.log("Modern navbar initialized");
    }

    setupEventListeners() {
      // Мобильное меню toggle
      this.mobileToggle.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleMobileMenu();
      });

      // Закрытие по клику вне меню
      document.addEventListener("click", (e) => {
        if (this.isMenuOpen && !this.navbar.contains(e.target)) {
          this.closeMobileMenu();
        }
      });

      // Закрытие по Escape
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isMenuOpen) {
          this.closeMobileMenu();
        }
      });

      // Закрытие при изменении размера окна
      window.addEventListener("resize", () => {
        this.handleResize();
      });

      // Закрытие меню при клике по ссылкам в мобильном меню
      this.mobileMenu.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => {
          this.closeMobileMenu();
        });
      });

      // Закрытие меню при клике по кнопкам в мобильном меню
      this.mobileMenu.querySelectorAll(".btn").forEach((button) => {
        button.addEventListener("click", () => {
          this.closeMobileMenu();
        });
      });
    }

    setupAccessibility() {
      // Управление фокусом в мобильном меню
      const focusableElements = this.mobileMenu.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length > 0) {
        this.firstFocusableElement = focusableElements[0];
        this.lastFocusableElement =
          focusableElements[focusableElements.length - 1];
      }

      // Trap focus в открытом мобильном меню
      this.mobileMenu.addEventListener("keydown", (e) => {
        if (!this.isMenuOpen) return;

        if (e.key === "Tab") {
          if (e.shiftKey) {
            if (document.activeElement === this.firstFocusableElement) {
              e.preventDefault();
              this.lastFocusableElement.focus();
            }
          } else {
            if (document.activeElement === this.lastFocusableElement) {
              e.preventDefault();
              this.firstFocusableElement.focus();
            }
          }
        }
      });
    }

    toggleMobileMenu() {
      if (this.isMenuOpen) {
        this.closeMobileMenu();
      } else {
        this.openMobileMenu();
      }
    }

    openMobileMenu() {
      // Обновляем состояние
      this.isMenuOpen = true;

      // Обновляем классы
      this.navbar.classList.add("menu-open");
      this.mobileMenu.classList.add("active");
      this.mobileToggle.classList.add("active");

      // Обновляем ARIA атрибуты
      this.mobileToggle.setAttribute("aria-expanded", "true");
      this.mobileMenu.setAttribute("aria-hidden", "false");

      // Блокируем скролл страницы
      document.body.style.overflow = "hidden";

      // Фокусируемся на первом элементе меню для accessibility
      setTimeout(() => {
        if (this.firstFocusableElement) {
          this.firstFocusableElement.focus();
        }
      }, 100);

      // Анимация иконки гамбургера
      this.animateHamburgerIcon(true);
    }

    closeMobileMenu() {
      // Обновляем состояние
      this.isMenuOpen = false;

      // Обновляем классы
      this.navbar.classList.remove("menu-open");
      this.mobileMenu.classList.remove("active");
      this.mobileToggle.classList.remove("active");

      // Обновляем ARIA атрибуты
      this.mobileToggle.setAttribute("aria-expanded", "false");
      this.mobileMenu.setAttribute("aria-hidden", "true");

      // Восстанавливаем скролл страницы
      document.body.style.overflow = "";

      // Возвращаем фокус на кнопку toggle
      this.mobileToggle.focus();

      // Анимация иконки гамбургера
      this.animateHamburgerIcon(false);
    }

    animateHamburgerIcon(isOpen) {
      const lines = this.mobileToggle.querySelectorAll("svg line");

      if (isOpen) {
        if (lines[0])
          lines[0].style.transform = "rotate(45deg) translate(5px, 5px)";
        if (lines[1]) lines[1].style.opacity = "0";
        if (lines[2])
          lines[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
      } else {
        if (lines[0]) lines[0].style.transform = "";
        if (lines[1]) lines[1].style.opacity = "1";
        if (lines[2]) lines[2].style.transform = "";
      }
    }

    handleResize() {
      // Закрываем мобильное меню при переходе на desktop
      if (window.innerWidth > 600 && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    }

    // Публичные методы для внешнего использования
    open() {
      this.openMobileMenu();
    }

    close() {
      this.closeMobileMenu();
    }

    toggle() {
      this.toggleMobileMenu();
    }

    isOpen() {
      return this.isMenuOpen;
    }
  }

  // Инициализация при загрузке DOM
  document.addEventListener("DOMContentLoaded", () => {
    window.modernNavbar = new ModernNavbar();
  });

  // Экспорт для модульных систем (если нужно)
  if (typeof module !== "undefined" && module.exports) {
    module.exports = ModernNavbar;
  }

  // Добавляем к глобальному объекту если он существует
  if (typeof window.NeutysApp !== "undefined") {
    window.NeutysApp.navbar = window.modernNavbar;
  }
})();
