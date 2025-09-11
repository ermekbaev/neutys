// Utility functions and helpers

(function () {
  "use strict";

  const Utils = {
    // DOM utilities
    dom: {
      // Get element by selector with optional context
      $(selector, context = document) {
        return context.querySelector(selector);
      },

      // Get all elements by selector with optional context
      $(selector, context = document) {
        return Array.from(context.querySelectorAll(selector));
      },

      // Create element with attributes and content
      create(tag, attributes = {}, content = "") {
        const element = document.createElement(tag);

        Object.entries(attributes).forEach(([key, value]) => {
          if (key === "class") {
            element.className = value;
          } else if (key === "data") {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
              element.dataset[dataKey] = dataValue;
            });
          } else {
            element.setAttribute(key, value);
          }
        });

        if (content) {
          if (typeof content === "string") {
            element.innerHTML = content;
          } else {
            element.appendChild(content);
          }
        }

        return element;
      },

      // Check if element is visible
      isVisible(element) {
        return !!(
          element.offsetWidth ||
          element.offsetHeight ||
          element.getClientRects().length
        );
      },

      // Get element position relative to viewport
      getPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
          top: rect.top + window.pageYOffset,
          left: rect.left + window.pageXOffset,
          width: rect.width,
          height: rect.height,
        };
      },

      // Smooth scroll to element
      scrollTo(element, options = {}) {
        const defaultOptions = {
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        };

        const scrollOptions = { ...defaultOptions, ...options };

        if (typeof element === "string") {
          element = this.$(element);
        }

        if (element) {
          element.scrollIntoView(scrollOptions);
        }
      },

      // Add event listener with automatic cleanup
      on(element, event, handler, options = {}) {
        if (typeof element === "string") {
          element = this.$(element);
        }

        if (element) {
          element.addEventListener(event, handler, options);

          // Return cleanup function
          return () => element.removeEventListener(event, handler, options);
        }
      },

      // Delegate event handling
      delegate(parent, selector, event, handler) {
        if (typeof parent === "string") {
          parent = this.$(parent);
        }

        if (parent) {
          parent.addEventListener(event, (e) => {
            const target = e.target.closest(selector);
            if (target) {
              handler.call(target, e);
            }
          });
        }
      },
    },

    // String utilities
    string: {
      // Capitalize first letter
      capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      },

      // Convert to camelCase
      toCamelCase(str) {
        return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      },

      // Convert to kebab-case
      toKebabCase(str) {
        return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      },

      // Truncate string with ellipsis
      truncate(str, length, ending = "...") {
        if (str.length <= length) return str;
        return str.substring(0, length - ending.length) + ending;
      },

      // Remove HTML tags
      stripHTML(str) {
        const div = document.createElement("div");
        div.innerHTML = str;
        return div.textContent || div.innerText || "";
      },

      // Escape HTML
      escapeHTML(str) {
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
      },

      // Generate random string
      random(
        length = 8,
        chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      ) {
        let result = "";
        for (let i = 0; i < length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      },
    },

    // Array utilities
    array: {
      // Remove duplicates from array
      unique(arr) {
        return [...new Set(arr)];
      },

      // Chunk array into smaller arrays
      chunk(arr, size) {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
          chunks.push(arr.slice(i, i + size));
        }
        return chunks;
      },

      // Shuffle array
      shuffle(arr) {
        const newArr = [...arr];
        for (let i = newArr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
      },

      // Group array by key
      groupBy(arr, key) {
        return arr.reduce((groups, item) => {
          const group = typeof key === "function" ? key(item) : item[key];
          groups[group] = groups[group] || [];
          groups[group].push(item);
          return groups;
        }, {});
      },
    },

    // Object utilities
    object: {
      // Deep clone object
      clone(obj) {
        if (obj === null || typeof obj !== "object") return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map((item) => this.clone(item));
        if (typeof obj === "object") {
          const copy = {};
          Object.keys(obj).forEach((key) => {
            copy[key] = this.clone(obj[key]);
          });
          return copy;
        }
      },

      // Deep merge objects
      merge(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (this.isObject(target) && this.isObject(source)) {
          for (const key in source) {
            if (this.isObject(source[key])) {
              if (!target[key]) Object.assign(target, { [key]: {} });
              this.merge(target[key], source[key]);
            } else {
              Object.assign(target, { [key]: source[key] });
            }
          }
        }

        return this.merge(target, ...sources);
      },

      // Check if value is object
      isObject(item) {
        return item && typeof item === "object" && !Array.isArray(item);
      },

      // Get nested property safely
      get(obj, path, defaultValue = undefined) {
        const keys = path.split(".");
        let result = obj;

        for (const key of keys) {
          if (result == null || typeof result !== "object") {
            return defaultValue;
          }
          result = result[key];
        }

        return result !== undefined ? result : defaultValue;
      },

      // Set nested property
      set(obj, path, value) {
        const keys = path.split(".");
        const lastKey = keys.pop();
        let current = obj;

        for (const key of keys) {
          if (current[key] === undefined || current[key] === null) {
            current[key] = {};
          }
          current = current[key];
        }

        current[lastKey] = value;
        return obj;
      },
    },

    // Date utilities
    date: {
      // Format date
      format(date, format = "YYYY-MM-DD") {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        const seconds = String(d.getSeconds()).padStart(2, "0");

        return format
          .replace("YYYY", year)
          .replace("MM", month)
          .replace("DD", day)
          .replace("HH", hours)
          .replace("mm", minutes)
          .replace("ss", seconds);
      },

      // Get relative time (e.g., "2 hours ago")
      relative(date) {
        const now = new Date();
        const past = new Date(date);
        const diffMs = now - past;
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffSecs < 60) return "just now";
        if (diffMins < 60)
          return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
        if (diffHours < 24)
          return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
        if (diffDays < 7)
          return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;

        return this.format(date, "MMM DD, YYYY");
      },

      // Add days to date
      addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      },

      // Check if date is today
      isToday(date) {
        const today = new Date();
        const checkDate = new Date(date);
        return today.toDateString() === checkDate.toDateString();
      },
    },

    // Number utilities
    number: {
      // Format number with commas
      format(num, decimals = 0) {
        return num.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
      },

      // Format as currency
      currency(amount, currency = "USD") {
        return new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: currency,
        }).format(amount);
      },

      // Format as percentage
      percentage(value, decimals = 1) {
        return `${(value * 100).toFixed(decimals)}%`;
      },

      // Clamp number between min and max
      clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
      },

      // Generate random number between min and max
      random(min = 0, max = 1) {
        return Math.random() * (max - min) + min;
      },

      // Round to specified decimal places
      round(value, decimals = 0) {
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
      },
    },

    // URL utilities
    url: {
      // Get URL parameters
      getParams(url = window.location.href) {
        const params = new URLSearchParams(new URL(url).search);
        const result = {};
        for (const [key, value] of params) {
          result[key] = value;
        }
        return result;
      },

      // Set URL parameter
      setParam(key, value, url = window.location.href) {
        const urlObj = new URL(url);
        urlObj.searchParams.set(key, value);
        return urlObj.toString();
      },

      // Remove URL parameter
      removeParam(key, url = window.location.href) {
        const urlObj = new URL(url);
        urlObj.searchParams.delete(key);
        return urlObj.toString();
      },

      // Build query string from object
      buildQuery(params) {
        return new URLSearchParams(params).toString();
      },
    },

    // Local storage utilities
    storage: {
      // Set item with optional expiration
      set(key, value, expirationHours = null) {
        const data = {
          value: value,
          timestamp: Date.now(),
          expiration: expirationHours
            ? Date.now() + expirationHours * 60 * 60 * 1000
            : null,
        };

        try {
          localStorage.setItem(key, JSON.stringify(data));
          return true;
        } catch (e) {
          console.warn("LocalStorage is not available:", e);
          return false;
        }
      },

      // Get item with expiration check
      get(key, defaultValue = null) {
        try {
          const item = localStorage.getItem(key);
          if (!item) return defaultValue;

          const data = JSON.parse(item);

          // Check expiration
          if (data.expiration && Date.now() > data.expiration) {
            this.remove(key);
            return defaultValue;
          }

          return data.value;
        } catch (e) {
          console.warn("Error reading from localStorage:", e);
          return defaultValue;
        }
      },

      // Remove item
      remove(key) {
        try {
          localStorage.removeItem(key);
          return true;
        } catch (e) {
          console.warn("Error removing from localStorage:", e);
          return false;
        }
      },

      // Clear all items
      clear() {
        try {
          localStorage.clear();
          return true;
        } catch (e) {
          console.warn("Error clearing localStorage:", e);
          return false;
        }
      },

      // Get all keys
      keys() {
        try {
          return Object.keys(localStorage);
        } catch (e) {
          console.warn("Error getting localStorage keys:", e);
          return [];
        }
      },
    },

    // Performance utilities
    performance: {
      // Debounce function
      debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
          const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
          };
          const callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) func.apply(this, args);
        };
      },

      // Throttle function
      throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
          if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
          }
        };
      },

      // Measure execution time
      measure(func, name = "Function") {
        const start = performance.now();
        const result = func();
        const end = performance.now();
        console.log(`${name} took ${end - start} milliseconds`);
        return result;
      },

      // Request animation frame with fallback
      raf(callback) {
        if (window.requestAnimationFrame) {
          return window.requestAnimationFrame(callback);
        } else {
          return setTimeout(callback, 16); // ~60fps fallback
        }
      },
    },

    // Validation utilities
    validate: {
      // Email validation
      email(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
      },

      // URL validation
      url(url) {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      },

      // Phone number validation (basic)
      phone(phone) {
        const re = /^[\+]?[1-9][\d]{0,15}$/;
        return re.test(phone.replace(/[\s\-\(\)]/g, ""));
      },

      // Credit card validation (Luhn algorithm)
      creditCard(number) {
        const digits = number.replace(/\D/g, "");
        let sum = 0;
        let isEven = false;

        for (let i = digits.length - 1; i >= 0; i--) {
          let digit = parseInt(digits[i]);

          if (isEven) {
            digit *= 2;
            if (digit > 9) {
              digit -= 9;
            }
          }

          sum += digit;
          isEven = !isEven;
        }

        return sum % 10 === 0;
      },

      // Password strength
      passwordStrength(password) {
        let score = 0;
        const checks = {
          length: password.length >= 8,
          lowercase: /[a-z]/.test(password),
          uppercase: /[A-Z]/.test(password),
          numbers: /\d/.test(password),
          special: /[^A-Za-z0-9]/.test(password),
        };

        Object.values(checks).forEach((check) => {
          if (check) score++;
        });

        return {
          score,
          strength: score < 3 ? "weak" : score < 5 ? "medium" : "strong",
          checks,
        };
      },
    },

    // Cookie utilities
    cookie: {
      // Set cookie
      set(name, value, days = 7, path = "/") {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=${path}`;
      },

      // Get cookie
      get(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(";");
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === " ") c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) === 0)
            return c.substring(nameEQ.length, c.length);
        }
        return null;
      },

      // Remove cookie
      remove(name, path = "/") {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=${path}`;
      },
    },

    // Device detection
    device: {
      // Check if mobile
      isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      },

      // Check if tablet
      isTablet() {
        return (
          /iPad|Android|Tablet/i.test(navigator.userAgent) && !this.isMobile()
        );
      },

      // Check if desktop
      isDesktop() {
        return !this.isMobile() && !this.isTablet();
      },

      // Get screen size category
      getScreenSize() {
        const width = window.innerWidth;
        if (width < 768) return "mobile";
        if (width < 1024) return "tablet";
        return "desktop";
      },

      // Check if touch device
      isTouch() {
        return "ontouchstart" in window || navigator.maxTouchPoints > 0;
      },
    },

    // API utilities
    api: {
      // Simple fetch wrapper
      async request(url, options = {}) {
        const defaultOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };

        const config = { ...defaultOptions, ...options };

        if (config.body && typeof config.body === "object") {
          config.body = JSON.stringify(config.body);
        }

        try {
          const response = await fetch(url, config);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return await response.json();
          }

          return await response.text();
        } catch (error) {
          console.error("API request failed:", error);
          throw error;
        }
      },

      // GET request
      get(url, headers = {}) {
        return this.request(url, { method: "GET", headers });
      },

      // POST request
      post(url, data, headers = {}) {
        return this.request(url, { method: "POST", body: data, headers });
      },

      // PUT request
      put(url, data, headers = {}) {
        return this.request(url, { method: "PUT", body: data, headers });
      },

      // DELETE request
      delete(url, headers = {}) {
        return this.request(url, { method: "DELETE", headers });
      },
    },
  };

  // Register with main app if available
  if (window.NeutysApp) {
    window.NeutysApp.utils = Utils;
  }

  // Export globally
  window.Utils = Utils;
})();
