// Forms module - handles form validation, submission, and interactions

(function () {
  "use strict";

  // Register module with main app
  if (window.NeutysApp) {
    window.NeutysApp.modules.forms = FormsModule;
  }

  // Auto-initialize if main app is not present
  if (!window.NeutysApp) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => FormsModule.init());
    } else {
      FormsModule.init();
    }
  }

  // Export for external use
  window.FormsModule = FormsModule;
})();
