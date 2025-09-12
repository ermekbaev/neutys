(function () {
  "use strict";

  let navbar = null;
  let mobileToggle = null;
  let mobileMenu = null;
  let loginForm = null;
  let isMenuOpen = false;

  document.addEventListener("DOMContentLoaded", function () {
    initializeElements();
    setupEventListeners();
    setupFormValidation();
    setupAccessibility();

    console.log("Login page initialized");
  });

  function initializeElements() {
    navbar = document.querySelector(".navbar");
    mobileToggle = document.querySelector(".mobile-menu-toggle");
    mobileMenu = document.querySelector(".mobile-menu");
    loginForm = document.querySelector(".login-form");

    if (!navbar || !mobileToggle || !mobileMenu) {
      console.warn("Some navbar elements not found");
    }
  }

  function setupEventListeners() {
    if (mobileToggle) {
      mobileToggle.addEventListener("click", toggleMobileMenu);
    }

    document.addEventListener("click", function (e) {
      if (isMenuOpen && !navbar.contains(e.target)) {
        closeMobileMenu();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isMenuOpen) {
        closeMobileMenu();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 600 && isMenuOpen) {
        closeMobileMenu();
      }
    });

    if (mobileMenu) {
      const mobileLinks = mobileMenu.querySelectorAll(".nav-link");
      mobileLinks.forEach((link) => {
        link.addEventListener("click", function () {
          if (window.innerWidth <= 600) {
            closeMobileMenu();
          }
        });
      });
    }

    const mobileButtons = document.querySelectorAll(
      ".mobile-auth-buttons button"
    );
    mobileButtons.forEach((button) => {
      button.addEventListener("click", function () {
        closeMobileMenu();
      });
    });
  }

  function toggleMobileMenu() {
    if (isMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    if (!navbar || !mobileMenu || !mobileToggle) return;

    navbar.classList.add("menu-open");
    mobileMenu.classList.add("mobile-menu--open");
    mobileToggle.classList.add("active");

    document.body.style.overflow = "hidden";

    isMenuOpen = true;

    const firstLink = mobileMenu.querySelector(".nav-link");
    if (firstLink) {
      firstLink.focus();
    }

    animateHamburgerIcon(true);
  }

  function closeMobileMenu() {
    if (!navbar || !mobileMenu || !mobileToggle) return;

    navbar.classList.remove("menu-open");
    mobileMenu.classList.remove("mobile-menu--open");
    mobileToggle.classList.remove("active");

    document.body.style.overflow = "";

    isMenuOpen = false;

    animateHamburgerIcon(false);

    mobileToggle.focus();
  }

  function animateHamburgerIcon(isOpen) {
    const lines = mobileToggle.querySelectorAll("svg line");

    if (isOpen) {
      if (lines[0])
        lines[0].style.transform = "rotate(45deg) translate(5px, 5px)";
      if (lines[1]) lines[1].style.opacity = "0";
      if (lines[2])
        lines[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
    } else {
      if (lines[0]) lines[0].style.transform = "";
      if (lines[1]) lines[1].style.opacity = "";
      if (lines[2]) lines[2].style.transform = "";
    }
  }

  function setupFormValidation() {
    if (!loginForm) return;

    const emailInput = loginForm.querySelector("#email");
    const passwordInput = loginForm.querySelector("#password");
    const verificationInput = loginForm.querySelector("#verification");
    const submitButton = loginForm.querySelector(".signin-btn");

    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (validateForm()) {
        handleFormSubmit();
      }
    });

    if (emailInput) {
      emailInput.addEventListener("blur", function () {
        validateEmail(this);
      });
    }

    if (passwordInput) {
      passwordInput.addEventListener("blur", function () {
        validatePassword(this);
      });
    }

    if (verificationInput) {
      verificationInput.addEventListener("blur", function () {
        validateVerification(this);
      });
    }
  }

  function validateForm() {
    const emailInput = loginForm.querySelector("#email");
    const passwordInput = loginForm.querySelector("#password");
    const verificationInput = loginForm.querySelector("#verification");

    let isValid = true;

    if (emailInput && !validateEmail(emailInput)) {
      isValid = false;
    }

    if (passwordInput && !validatePassword(passwordInput)) {
      isValid = false;
    }

    if (verificationInput && !validateVerification(verificationInput)) {
      isValid = false;
    }

    return isValid;
  }

  function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(input.value);

    toggleInputError(input, !isValid, "Please enter a valid email address");
    return isValid;
  }

  function validatePassword(input) {
    const isValid = input.value.length >= 6;

    toggleInputError(
      input,
      !isValid,
      "Password must be at least 6 characters long"
    );
    return isValid;
  }

  function validateVerification(input) {
    const isValid = input.value.trim() !== "";

    toggleInputError(input, !isValid, "Please enter the verification code");
    return isValid;
  }

  function toggleInputError(input, hasError, message) {
    const formGroup = input.closest(".form-group");
    let errorElement = formGroup.querySelector(".error-message");

    if (hasError) {
      if (!errorElement) {
        errorElement = document.createElement("div");
        errorElement.className = "error-message";
        errorElement.style.color = "#dc2626";
        errorElement.style.fontSize = "12px";
        errorElement.style.marginTop = "4px";
        formGroup.appendChild(errorElement);
      }
      errorElement.textContent = message;
      input.style.borderColor = "#dc2626";
    } else {
      if (errorElement) {
        errorElement.remove();
      }
      input.style.borderColor = "";
    }
  }

  function handleFormSubmit() {
    const submitButton = loginForm.querySelector(".signin-btn");
    const originalText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = "Signing In...";

    setTimeout(function () {
      console.log("Form submitted successfully");

      submitButton.disabled = false;
      submitButton.textContent = originalText;

      showNotification("Login successful!", "success");

      // window.location.href = '/dashboard';
    }, 2000);
  }

  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      background: type === "success" ? "#10b981" : "#6366f1",
      color: "white",
      padding: "12px 16px",
      borderRadius: "8px",
      zIndex: "1000",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transform: "translateX(400px)",
      transition: "transform 0.3s ease",
    });

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    const closeButton = notification.querySelector(".notification-close");
    closeButton.addEventListener("click", () => {
      removeNotification(notification);
    });

    setTimeout(() => {
      removeNotification(notification);
    }, 5000);
  }

  function removeNotification(notification) {
    notification.style.transform = "translateX(400px)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  function setupAccessibility() {
    if (mobileToggle) {
      mobileToggle.setAttribute("aria-expanded", "false");
      mobileToggle.setAttribute("aria-controls", "mobile-menu");
    }

    if (mobileMenu) {
      mobileMenu.setAttribute("id", "mobile-menu");
      mobileMenu.setAttribute("aria-hidden", "true");
    }

    const originalOpenMenu = openMobileMenu;
    const originalCloseMenu = closeMobileMenu;

    openMobileMenu = function () {
      originalOpenMenu();
      if (mobileToggle) mobileToggle.setAttribute("aria-expanded", "true");
      if (mobileMenu) mobileMenu.setAttribute("aria-hidden", "false");
    };

    closeMobileMenu = function () {
      originalCloseMenu();
      if (mobileToggle) mobileToggle.setAttribute("aria-expanded", "false");
      if (mobileMenu) mobileMenu.setAttribute("aria-hidden", "true");
    };

    if (mobileMenu) {
      const focusableElements = mobileMenu.querySelectorAll("a, button");

      mobileMenu.addEventListener("keydown", function (e) {
        if (e.key === "Tab") {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const googleBtn = document.querySelector(".google-btn");
    if (googleBtn) {
      googleBtn.addEventListener("click", function () {
        showNotification("Google authentication not implemented yet", "info");
      });
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    const forgotPasswordLink = document.querySelector(".forgot-password");
    if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener("click", function (e) {
        e.preventDefault();
        showNotification(
          "Password reset functionality will be added soon",
          "info"
        );
      });
    }
  });

  window.LoginPage = {
    toggleMobileMenu,
    showNotification,
  };
})();
