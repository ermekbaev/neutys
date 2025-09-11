// Main JavaScript - initialization and global functionality

(function () {
  "use strict";

  // Global app object
  window.NeutysApp = {
    config: {
      debug: false,
      apiUrl: "/api",
      version: "1.0.0",
    },

    modules: {},

    // Initialize the application
    init: function () {
      this.setupEventListeners();
      this.initializeModules();
      this.setupMobileMenu();
      this.setupToggles();
      this.setupNotifications();

      if (this.config.debug) {
        console.log("Neutys App initialized");
      }
    },

    // Setup global event listeners
    setupEventListeners: function () {
      // Handle clicks outside dropdowns to close them
      document.addEventListener("click", this.handleOutsideClick.bind(this));

      // Handle keyboard navigation
      document.addEventListener("keydown", this.handleKeyDown.bind(this));

      // Handle window resize for responsive behavior
      window.addEventListener("resize", this.handleResize.bind(this));

      // Handle focus management for accessibility
      document.addEventListener("focusin", this.handleFocusIn.bind(this));
    },

    // Initialize all modules
    initializeModules: function () {
      // Initialize tabs module if it exists
      if (this.modules.tabs) {
        this.modules.tabs.init();
      }

      // Initialize forms module if it exists
      if (this.modules.forms) {
        this.modules.forms.init();
      }
    },

    // Setup mobile menu functionality
    setupMobileMenu: function () {
      const mobileToggle = document.querySelector(".mobile-menu-toggle");
      const sidebar = document.querySelector(".sidebar");
      const overlay = document.querySelector(".mobile-overlay");

      if (!mobileToggle || !sidebar) return;

      // Create overlay if it doesn't exist
      if (!overlay) {
        const newOverlay = document.createElement("div");
        newOverlay.className = "mobile-overlay";
        document.body.appendChild(newOverlay);
      }

      // Toggle mobile menu
      mobileToggle.addEventListener("click", () => {
        this.toggleMobileMenu();
      });

      // Close menu when clicking overlay
      document.addEventListener("click", (e) => {
        if (e.target.classList.contains("mobile-overlay")) {
          this.closeMobileMenu();
        }
      });

      // Close menu on escape key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && sidebar.classList.contains("sidebar--open")) {
          this.closeMobileMenu();
        }
      });
    },

    // Toggle mobile menu
    toggleMobileMenu: function () {
      const sidebar = document.querySelector(".sidebar");
      const overlay = document.querySelector(".mobile-overlay");

      if (sidebar && overlay) {
        sidebar.classList.toggle("sidebar--open");
        overlay.classList.toggle("mobile-overlay--active");
        document.body.style.overflow = sidebar.classList.contains(
          "sidebar--open"
        )
          ? "hidden"
          : "";
      }
    },

    // Close mobile menu
    closeMobileMenu: function () {
      const sidebar = document.querySelector(".sidebar");
      const overlay = document.querySelector(".mobile-overlay");

      if (sidebar && overlay) {
        sidebar.classList.remove("sidebar--open");
        overlay.classList.remove("mobile-overlay--active");
        document.body.style.overflow = "";
      }
    },

    // Setup toggle switches
    setupToggles: function () {
      const toggles = document.querySelectorAll(".toggle");

      toggles.forEach((toggle) => {
        toggle.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleToggleClick(toggle);
        });

        // Keyboard support
        toggle.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.handleToggleClick(toggle);
          }
        });

        // Make toggles focusable
        if (!toggle.hasAttribute("tabindex")) {
          toggle.setAttribute("tabindex", "0");
        }
      });
    },

    // Handle toggle switch clicks
    handleToggleClick: function (toggle) {
      if (toggle.disabled) return;

      const isActive = toggle.classList.contains("toggle--active");
      toggle.classList.toggle("toggle--active");

      // Trigger custom event
      const event = new CustomEvent("toggleChange", {
        detail: {
          element: toggle,
          active: !isActive,
          name: toggle.dataset.name || null,
        },
      });
      toggle.dispatchEvent(event);

      // Add ripple effect
      this.addRippleEffect(toggle);
    },

    // Add ripple effect to buttons
    addRippleEffect: function (element) {
      const ripple = document.createElement("span");
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = event.clientX - rect.left - size / 2 + "px";
      ripple.style.top = event.clientY - rect.top - size / 2 + "px";
      ripple.classList.add("ripple");

      element.appendChild(ripple);

      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);
    },

    // Setup notification system
    setupNotifications: function () {
      // Add notification badge if there are unread notifications
      const notificationBtn = document.querySelector(".notification-btn");
      if (notificationBtn) {
        // Check for notifications (this would typically come from an API)
        const hasNotifications = this.checkForNotifications();
        if (hasNotifications) {
          notificationBtn.classList.add("notification-btn--has-notifications");
        }
      }
    },

    // Check for notifications (mock function)
    checkForNotifications: function () {
      // This would typically make an API call
      return Math.random() > 0.5; // Random for demo
    },

    // Handle clicks outside elements
    handleOutsideClick: function (e) {
      // Close dropdowns when clicking outside
      const dropdowns = document.querySelectorAll(".dropdown--open");
      dropdowns.forEach((dropdown) => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove("dropdown--open");
        }
      });
    },

    // Handle keyboard navigation
    handleKeyDown: function (e) {
      // Tab navigation improvements
      if (e.key === "Tab") {
        this.handleTabNavigation(e);
      }

      // Escape key handling
      if (e.key === "Escape") {
        this.handleEscapeKey(e);
      }
    },

    // Handle tab navigation
    handleTabNavigation: function (e) {
      // Ensure focus is visible
      const activeElement = document.activeElement;
      if (activeElement) {
        activeElement.classList.add("focus-visible");
      }
    },

    // Handle escape key
    handleEscapeKey: function (e) {
      // Close modals, dropdowns, etc.
      const openModals = document.querySelectorAll(".modal--open");
      const openDropdowns = document.querySelectorAll(".dropdown--open");

      if (openModals.length > 0) {
        openModals[openModals.length - 1].classList.remove("modal--open");
      } else if (openDropdowns.length > 0) {
        openDropdowns.forEach((dropdown) =>
          dropdown.classList.remove("dropdown--open")
        );
      }
    },

    // Handle window resize
    handleResize: function () {
      // Close mobile menu on desktop
      if (window.innerWidth >= 1024) {
        this.closeMobileMenu();
      }

      // Update layout calculations if needed
      this.updateLayoutCalculations();
    },

    // Handle focus events for accessibility
    handleFocusIn: function (e) {
      // Add focus-visible class for keyboard navigation
      if (e.target.matches("button, input, select, textarea, [tabindex]")) {
        e.target.classList.add("focus-visible");
      }
    },

    // Update layout calculations
    updateLayoutCalculations: function () {
      // Recalculate any dynamic layouts
      const elements = document.querySelectorAll("[data-dynamic-height]");
      elements.forEach((element) => {
        // Update heights based on content
        element.style.height = "auto";
        element.style.height = element.scrollHeight + "px";
      });
    },

    // Show toast notification
    showToast: function (message, type = "info", duration = 3000) {
      const toast = document.createElement("div");
      toast.className = `toast toast--${type}`;
      toast.innerHTML = `
                <div class="toast__content">
                    <span class="toast__message">${message}</span>
                    <button class="toast__close" aria-label="Close">×</button>
                </div>
            `;

      // Add to page
      let toastContainer = document.querySelector(".toast-container");
      if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.className = "toast-container";
        document.body.appendChild(toastContainer);
      }

      toastContainer.appendChild(toast);

      // Animate in
      setTimeout(() => toast.classList.add("toast--visible"), 10);

      // Auto remove
      setTimeout(() => this.removeToast(toast), duration);

      // Manual close
      toast.querySelector(".toast__close").addEventListener("click", () => {
        this.removeToast(toast);
      });
    },

    // Remove toast notification
    removeToast: function (toast) {
      toast.classList.remove("toast--visible");
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    },

    // Utility function to show loading state
    showLoading: function (element, text = "Loading...") {
      if (element) {
        element.classList.add("loading");
        element.setAttribute("data-original-text", element.textContent);
        element.textContent = text;
        element.disabled = true;
      }
    },

    // Utility function to hide loading state
    hideLoading: function (element) {
      if (element) {
        element.classList.remove("loading");
        const originalText = element.getAttribute("data-original-text");
        if (originalText) {
          element.textContent = originalText;
          element.removeAttribute("data-original-text");
        }
        element.disabled = false;
      }
    },

    // Debounce function for performance
    debounce: function (func, wait, immediate) {
      let timeout;
      return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },

    // Throttle function for performance
    throttle: function (func, limit) {
      let inThrottle;
      return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    },
  };

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      window.NeutysApp.init();
    });
  } else {
    window.NeutysApp.init();
  }

  // CSS for toast notifications (injected dynamically)
  const toastStyles = `
        .toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            pointer-events: none;
        }
        
        .toast {
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            margin-bottom: 10px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            pointer-events: auto;
            max-width: 400px;
        }
        
        .toast--visible {
            opacity: 1;
            transform: translateX(0);
        }
        
        .toast--info { border-left: 4px solid #3B82F6; }
        .toast--success { border-left: 4px solid #10B981; }
        .toast--warning { border-left: 4px solid #F59E0B; }
        .toast--error { border-left: 4px solid #DC2626; }
        
        .toast__content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
        }
        
        .toast__message {
            flex: 1;
            font-size: 14px;
            color: #1F2937;
        }
        
        .toast__close {
            background: none;
            border: none;
            font-size: 18px;
            color: #6B7280;
            cursor: pointer;
            margin-left: 12px;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            pointer-events: none;
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;

  // Inject styles
  const styleSheet = document.createElement("style");
  styleSheet.textContent = toastStyles;
  document.head.appendChild(styleSheet);
})();
