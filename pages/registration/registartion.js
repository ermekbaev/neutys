// registration.js - Логика страницы регистрации

class RegistrationPage {
  constructor() {
    this.form = null;
    this.inputs = {};
    this.submitButton = null;
    this.init();
  }

  init() {
    // Ждем загрузки DOM
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.form = document.getElementById("registrationForm");
    this.submitButton = this.form?.querySelector(".btn-register");

    // Получаем все поля формы
    this.inputs = {
      fullName: document.getElementById("fullName"),
      email: document.getElementById("email"),
      password: document.getElementById("password"),
      confirmPassword: document.getElementById("confirmPassword"),
    };

    this.bindEvents();
    this.createErrorMessages();

    console.log("✅ Registration page initialized");
  }

  bindEvents() {
    if (!this.form) return;

    // Обработчик отправки формы
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    // Валидация в реальном времени
    Object.values(this.inputs).forEach((input) => {
      if (input) {
        input.addEventListener("blur", () => this.validateField(input));
        input.addEventListener("input", () => this.clearFieldError(input));
      }
    });

    // Специальная валидация для подтверждения пароля
    if (this.inputs.confirmPassword) {
      this.inputs.confirmPassword.addEventListener("input", () => {
        this.validatePasswordMatch();
      });
    }
  }

  createErrorMessages() {
    // Создаем элементы для сообщений об ошибках
    Object.entries(this.inputs).forEach(([key, input]) => {
      if (input && !input.parentNode.querySelector(".error-message")) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "error-message";
        errorDiv.id = `${key}Error`;
        input.parentNode.appendChild(errorDiv);
      }
    });
  }

  validateField(input) {
    const value = input.value.trim();
    const fieldName = input.name;
    let isValid = true;
    let errorMessage = "";

    switch (fieldName) {
      case "fullName":
        if (!value) {
          errorMessage = "Full name is required";
          isValid = false;
        } else if (value.length < 2) {
          errorMessage = "Full name must be at least 2 characters";
          isValid = false;
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          errorMessage = "Email is required";
          isValid = false;
        } else if (!emailRegex.test(value)) {
          errorMessage = "Please enter a valid email address";
          isValid = false;
        }
        break;

      case "password":
        if (!value) {
          errorMessage = "Password is required";
          isValid = false;
        } else if (value.length < 8) {
          errorMessage = "Password must be at least 8 characters";
          isValid = false;
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          errorMessage =
            "Password must contain uppercase, lowercase and number";
          isValid = false;
        }
        break;

      case "confirmPassword":
        if (!value) {
          errorMessage = "Please confirm your password";
          isValid = false;
        } else if (value !== this.inputs.password.value) {
          errorMessage = "Passwords do not match";
          isValid = false;
        }
        break;
    }

    this.setFieldState(input, isValid, errorMessage);
    return isValid;
  }

  validatePasswordMatch() {
    const password = this.inputs.password.value;
    const confirmPassword = this.inputs.confirmPassword.value;

    if (confirmPassword && password !== confirmPassword) {
      this.setFieldState(
        this.inputs.confirmPassword,
        false,
        "Passwords do not match"
      );
    } else if (confirmPassword) {
      this.setFieldState(this.inputs.confirmPassword, true);
    }
  }

  setFieldState(input, isValid, errorMessage = "") {
    const errorElement = document.getElementById(`${input.name}Error`);

    // Удаляем предыдущие классы
    input.classList.remove("error", "success");

    if (isValid) {
      input.classList.add("success");
      if (errorElement) {
        errorElement.textContent = "";
        errorElement.classList.remove("show");
      }
    } else {
      input.classList.add("error");
      if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.classList.add("show");
      }
    }
  }

  clearFieldError(input) {
    input.classList.remove("error");
    const errorElement = document.getElementById(`${input.name}Error`);
    if (errorElement) {
      errorElement.classList.remove("show");
    }
  }

  validateForm() {
    let isFormValid = true;

    Object.values(this.inputs).forEach((input) => {
      if (input && !this.validateField(input)) {
        isFormValid = false;
      }
    });

    return isFormValid;
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Валидируем всю форму
    if (!this.validateForm()) {
      return;
    }

    // Показываем состояние загрузки
    this.setLoadingState(true);

    try {
      // Собираем данные формы
      const formData = {
        fullName: this.inputs.fullName.value.trim(),
        email: this.inputs.email.value.trim(),
        password: this.inputs.password.value,
      };

      // Имитация отправки на сервер
      await this.submitRegistration(formData);

      // Успешная регистрация
      this.handleRegistrationSuccess();
    } catch (error) {
      console.error("Registration error:", error);
      this.handleRegistrationError(error.message);
    } finally {
      this.setLoadingState(false);
    }
  }

  async submitRegistration(formData) {
    // Имитация API запроса
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Имитируем различные сценарии
        const random = Math.random();

        if (random > 0.8) {
          reject(new Error("Email already exists"));
        } else if (random > 0.9) {
          reject(new Error("Server error. Please try again."));
        } else {
          resolve({ success: true, userId: "12345" });
        }
      }, 2000);
    });
  }

  setLoadingState(isLoading) {
    if (this.submitButton) {
      this.submitButton.disabled = isLoading;
      this.submitButton.classList.toggle("loading", isLoading);
      this.submitButton.textContent = isLoading ? "" : "Create Account";
    }

    // Блокируем/разблокируем поля
    Object.values(this.inputs).forEach((input) => {
      if (input) {
        input.disabled = isLoading;
      }
    });
  }

  handleRegistrationSuccess() {
    // Показываем сообщение об успехе
    alert("🎉 Registration successful! Welcome aboard!");

    // Можно перенаправить на страницу входа или дашборд
    // window.location.href = '/dashboard';

    // Или очистить форму
    this.form.reset();
    Object.values(this.inputs).forEach((input) => {
      if (input) {
        input.classList.remove("success", "error");
      }
    });
  }

  handleRegistrationError(errorMessage) {
    // Показываем общую ошибку
    alert(`❌ Registration failed: ${errorMessage}`);

    // Фокусируем первое поле для повторного ввода
    if (this.inputs.fullName) {
      this.inputs.fullName.focus();
    }
  }
}

// Инициализация страницы регистрации
new RegistrationPage();
