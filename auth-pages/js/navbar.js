(function () {
  "use strict";

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
      this.mobileToggle.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleMobileMenu();
      });

      document.addEventListener("click", (e) => {
        if (this.isMenuOpen && !this.navbar.contains(e.target)) {
          this.closeMobileMenu();
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isMenuOpen) {
          this.closeMobileMenu();
        }
      });

      window.addEventListener("resize", () => {
        this.handleResize();
      });

      this.mobileMenu.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => {
          this.closeMobileMenu();
        });
      });

      this.mobileMenu.querySelectorAll(".btn").forEach((button) => {
        button.addEventListener("click", () => {
          this.closeMobileMenu();
        });
      });
    }

    setupAccessibility() {
      const focusableElements = this.mobileMenu.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length > 0) {
        this.firstFocusableElement = focusableElements[0];
        this.lastFocusableElement =
          focusableElements[focusableElements.length - 1];
      }

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
      this.isMenuOpen = true;

      this.navbar.classList.add("menu-open");
      this.mobileMenu.classList.add("active");
      this.mobileToggle.classList.add("active");

      this.mobileToggle.setAttribute("aria-expanded", "true");
      this.mobileMenu.setAttribute("aria-hidden", "false");

      document.body.style.overflow = "hidden";

      setTimeout(() => {
        if (this.firstFocusableElement) {
          this.firstFocusableElement.focus();
        }
      }, 100);

      this.animateHamburgerIcon(true);
    }

    closeMobileMenu() {
      this.isMenuOpen = false;

      this.navbar.classList.remove("menu-open");
      this.mobileMenu.classList.remove("active");
      this.mobileToggle.classList.remove("active");

      this.mobileToggle.setAttribute("aria-expanded", "false");
      this.mobileMenu.setAttribute("aria-hidden", "true");

      document.body.style.overflow = "";

      this.mobileToggle.focus();

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
      if (window.innerWidth > 600 && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    }

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

  document.addEventListener("DOMContentLoaded", () => {
    window.modernNavbar = new ModernNavbar();
  });

  if (typeof module !== "undefined" && module.exports) {
    module.exports = ModernNavbar;
  }

  if (typeof window.NeutysApp !== "undefined") {
    window.NeutysApp.navbar = window.modernNavbar;
  }
})();
