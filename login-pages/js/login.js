// Login page JavaScript functionality
(function () {
  "use strict";

  // DOM элементы
  let navbar = null;
  let mobileToggle = null;
  let mobileMenu = null;
  let loginForm = null;
  let isMenuOpen = false;

  // Инициализация при загрузке DOM
  document.addEventListener("DOMContentLoaded", function () {
    initializeElements();
    setupEventListeners();
    setupFormValidation();
    setupAccessibility();

    console.log("Login page initialized");
  });

  // Инициализация элементов
  function initializeElements() {
    navbar = document.querySelector(".navbar");
    mobileToggle = document.querySelector(".mobile-menu-toggle");
    mobileMenu = document.querySelector(".mobile-menu");
    loginForm = document.querySelector(".login-form");

    if (!navbar || !mobileToggle || !mobileMenu) {
      console.warn("Some navbar elements not found");
    }
  }

  // Установка обработчиков событий
  function setupEventListeners() {
    // Мобильное меню
    if (mobileToggle) {
      mobileToggle.addEventListener("click", toggleMobileMenu);
    }

    // Закрытие меню при клике вне его
    document.addEventListener("click", function (e) {
      if (isMenuOpen && !navbar.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Обработка клавиатуры
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isMenuOpen) {
        closeMobileMenu();
      }
    });

    // Закрытие меню при изменении размера окна
    window.addEventListener("resize", function () {
      if (window.innerWidth > 600 && isMenuOpen) {
        closeMobileMenu();
      }
    });

    // Обработчики ссылок в мобильном меню
    if (mobileMenu) {
      const mobileLinks = mobileMenu.querySelectorAll(".nav-link");
      mobileLinks.forEach((link) => {
        link.addEventListener("click", function () {
          // Закрываем меню при переходе по ссылке на мобильных
          if (window.innerWidth <= 600) {
            closeMobileMenu();
          }
        });
      });
    }

    // Обработчики кнопок в мобильном меню
    const mobileButtons = document.querySelectorAll(
      ".mobile-auth-buttons button"
    );
    mobileButtons.forEach((button) => {
      button.addEventListener("click", function () {
        closeMobileMenu();
      });
    });
  }

  // Переключение мобильного меню
  function toggleMobileMenu() {
    if (isMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  // Открытие мобильного меню
  function openMobileMenu() {
    if (!navbar || !mobileMenu || !mobileToggle) return;

    navbar.classList.add("menu-open");
    mobileMenu.classList.add("mobile-menu--open");
    mobileToggle.classList.add("active");

    // Блокируем скролл страницы
    document.body.style.overflow = "hidden";

    isMenuOpen = true;

    // Фокус на первую ссылку для доступности
    const firstLink = mobileMenu.querySelector(".nav-link");
    if (firstLink) {
      firstLink.focus();
    }

    // Анимация иконки гамбургера
    animateHamburgerIcon(true);
  }

  // Закрытие мобильного меню
  function closeMobileMenu() {
    if (!navbar || !mobileMenu || !mobileToggle) return;

    navbar.classList.remove("menu-open");
    mobileMenu.classList.remove("mobile-menu--open");
    mobileToggle.classList.remove("active");

    // Восстанавливаем скролл страницы
    document.body.style.overflow = "";

    isMenuOpen = false;

    // Анимация иконки гамбургера
    animateHamburgerIcon(false);

    // Возвращаем фокус на кнопку меню
    mobileToggle.focus();
  }

  // Анимация иконки гамбургера
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

  // Валидация формы
  function setupFormValidation() {
    if (!loginForm) return;

    const emailInput = loginForm.querySelector("#email");
    const passwordInput = loginForm.querySelector("#password");
    const verificationInput = loginForm.querySelector("#verification");
    const submitButton = loginForm.querySelector(".signin-btn");

    // Обработка отправки формы
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (validateForm()) {
        handleFormSubmit();
      }
    });

    // Валидация в реальном времени
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

  // Валидация формы
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

  // Валидация email
  function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(input.value);

    toggleInputError(input, !isValid, "Please enter a valid email address");
    return isValid;
  }

  // Валидация пароля
  function validatePassword(input) {
    const isValid = input.value.length >= 6;

    toggleInputError(
      input,
      !isValid,
      "Password must be at least 6 characters long"
    );
    return isValid;
  }

  // Валидация проверочного кода
  function validateVerification(input) {
    const isValid = input.value.trim() !== "";

    toggleInputError(input, !isValid, "Please enter the verification code");
    return isValid;
  }

  // Показать/скрыть ошибку поля
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

  // Обработка отправки формы
  function handleFormSubmit() {
    const submitButton = loginForm.querySelector(".signin-btn");
    const originalText = submitButton.textContent;

    // Показываем индикатор загрузки
    submitButton.disabled = true;
    submitButton.textContent = "Signing In...";

    // Симуляция отправки данных
    setTimeout(function () {
      // Здесь должна быть реальная отправка данных на сервер
      console.log("Form submitted successfully");

      // Восстанавливаем кнопку
      submitButton.disabled = false;
      submitButton.textContent = originalText;

      // Показываем уведомление об успехе
      showNotification("Login successful!", "success");

      // Здесь можно добавить редирект
      // window.location.href = '/dashboard';
    }, 2000);
  }

  // Показать уведомление
  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

    // Стили для уведомления
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

    // Анимация появления
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Обработчик закрытия
    const closeButton = notification.querySelector(".notification-close");
    closeButton.addEventListener("click", () => {
      removeNotification(notification);
    });

    // Автоматическое удаление через 5 секунд
    setTimeout(() => {
      removeNotification(notification);
    }, 5000);
  }

  // Удаление уведомления
  function removeNotification(notification) {
    notification.style.transform = "translateX(400px)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  // Настройка доступности
  function setupAccessibility() {
    // Добавляем ARIA атрибуты для мобильного меню
    if (mobileToggle) {
      mobileToggle.setAttribute("aria-expanded", "false");
      mobileToggle.setAttribute("aria-controls", "mobile-menu");
    }

    if (mobileMenu) {
      mobileMenu.setAttribute("id", "mobile-menu");
      mobileMenu.setAttribute("aria-hidden", "true");
    }

    // Обновляем ARIA атрибуты при открытии/закрытии меню
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

    // Управление фокусом в мобильном меню
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

  // Google авторизация (заглушка)
  document.addEventListener("DOMContentLoaded", function () {
    const googleBtn = document.querySelector(".google-btn");
    if (googleBtn) {
      googleBtn.addEventListener("click", function () {
        showNotification("Google authentication not implemented yet", "info");
      });
    }
  });

  // Обработка "Forgot Password"
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

  // Экспорт для использования в других скриптах
  window.LoginPage = {
    toggleMobileMenu,
    showNotification,
  };
})();
