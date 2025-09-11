// Tabs module - handles tab navigation and content switching

(function () {
  "use strict";

  const TabsModule = {
    // Configuration
    config: {
      activeClass: "tab-item--active",
      contentClass: "tab-content",
      tabItemSelector: ".tab-item",
      tabContentSelector: ".tab-content",
      animationDuration: 300,
    },

    // State
    currentTab: null,
    tabs: [],
    contents: [],

    // Initialize the tabs module
    init: function () {
      this.bindEvents();
      this.setupTabs();
      this.setInitialTab();

      console.log("Tabs module initialized");
    },

    // Bind event listeners
    bindEvents: function () {
      // Handle tab clicks
      document.addEventListener("click", (e) => {
        const tabItem = e.target.closest(this.config.tabItemSelector);
        if (tabItem && !tabItem.classList.contains("tab-item--delete")) {
          e.preventDefault();
          this.switchTab(tabItem);
        }
      });

      // Handle keyboard navigation
      document.addEventListener("keydown", (e) => {
        if (e.target.matches(this.config.tabItemSelector)) {
          this.handleKeyNavigation(e);
        }
      });

      // Handle browser back/forward
      window.addEventListener("popstate", (e) => {
        if (e.state && e.state.tab) {
          this.switchToTabById(e.state.tab);
        }
      });
    },

    // Setup tabs array and initial state
    setupTabs: function () {
      this.tabs = Array.from(
        document.querySelectorAll(this.config.tabItemSelector)
      );
      this.contents = Array.from(
        document.querySelectorAll(this.config.tabContentSelector)
      );

      // Add ARIA attributes for accessibility
      this.tabs.forEach((tab, index) => {
        const tabId = tab.dataset.tab || `tab-${index}`;
        const contentId = `content-${tabId}`;

        tab.setAttribute("role", "tab");
        tab.setAttribute("aria-controls", contentId);
        tab.setAttribute("tabindex", index === 0 ? "0" : "-1");
        tab.dataset.tab = tabId;

        // Find corresponding content
        const content = this.findContentForTab(tabId);
        if (content) {
          content.setAttribute("role", "tabpanel");
          content.setAttribute("aria-labelledby", tabId);
          content.id = contentId;
        }
      });
    },

    // Find content element for a tab
    findContentForTab: function (tabId) {
      return this.contents.find(
        (content) =>
          content.dataset.tab === tabId || content.id === `content-${tabId}`
      );
    },

    // Set the initial active tab
    setInitialTab: function () {
      // Check URL hash first
      const hash = window.location.hash.substring(1);
      let initialTab = null;

      if (hash) {
        initialTab = this.tabs.find((tab) => tab.dataset.tab === hash);
      }

      // If no hash or hash not found, use the active tab or first tab
      if (!initialTab) {
        initialTab =
          this.tabs.find((tab) =>
            tab.classList.contains(this.config.activeClass)
          ) || this.tabs[0];
      }

      if (initialTab) {
        this.switchTab(initialTab, false);
      }
    },

    // Switch to a specific tab
    switchTab: function (targetTab, updateHistory = true) {
      if (!targetTab || targetTab === this.currentTab) return;

      const tabId = targetTab.dataset.tab;
      const targetContent = this.findContentForTab(tabId);

      // Remove active state from all tabs
      this.tabs.forEach((tab) => {
        tab.classList.remove(this.config.activeClass);
        tab.setAttribute("aria-selected", "false");
        tab.setAttribute("tabindex", "-1");
      });

      // Hide all content
      this.contents.forEach((content) => {
        content.style.display = "none";
        content.setAttribute("aria-hidden", "true");
      });

      // Activate target tab
      targetTab.classList.add(this.config.activeClass);
      targetTab.setAttribute("aria-selected", "true");
      targetTab.setAttribute("tabindex", "0");

      // Show target content with animation
      if (targetContent) {
        this.showContent(targetContent);
      }

      // Update state
      this.currentTab = targetTab;

      // Update URL and history
      if (updateHistory) {
        this.updateHistory(tabId);
      }

      // Trigger custom event
      this.triggerTabChange(targetTab, targetContent);

      // Focus management
      this.manageFocus(targetTab);
    },

    // Switch to tab by ID
    switchToTabById: function (tabId) {
      const tab = this.tabs.find((t) => t.dataset.tab === tabId);
      if (tab) {
        this.switchTab(tab, false);
      }
    },

    // Show content with animation
    showContent: function (content) {
      content.style.display = "block";
      content.setAttribute("aria-hidden", "false");

      // Add fade-in animation
      content.style.opacity = "0";
      content.style.transform = "translateY(10px)";

      // Use requestAnimationFrame for smooth animation
      requestAnimationFrame(() => {
        content.style.transition = `opacity ${this.config.animationDuration}ms ease, transform ${this.config.animationDuration}ms ease`;
        content.style.opacity = "1";
        content.style.transform = "translateY(0)";

        // Clean up after animation
        setTimeout(() => {
          content.style.transition = "";
          content.style.transform = "";
        }, this.config.animationDuration);
      });
    },

    // Handle keyboard navigation
    handleKeyNavigation: function (e) {
      const currentIndex = this.tabs.indexOf(e.target);
      let targetIndex = currentIndex;

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          targetIndex =
            currentIndex > 0 ? currentIndex - 1 : this.tabs.length - 1;
          break;
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          targetIndex =
            currentIndex < this.tabs.length - 1 ? currentIndex + 1 : 0;
          break;
        case "Home":
          e.preventDefault();
          targetIndex = 0;
          break;
        case "End":
          e.preventDefault();
          targetIndex = this.tabs.length - 1;
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          this.switchTab(e.target);
          return;
        default:
          return;
      }

      // Focus and switch to target tab
      if (this.tabs[targetIndex]) {
        this.tabs[targetIndex].focus();
        this.switchTab(this.tabs[targetIndex]);
      }
    },

    // Update browser history
    updateHistory: function (tabId) {
      const url = new URL(window.location);
      url.hash = tabId;

      history.pushState(
        { tab: tabId },
        `Settings - ${this.getTabTitle(tabId)}`,
        url.toString()
      );
    },

    // Get tab title for history
    getTabTitle: function (tabId) {
      const tab = this.tabs.find((t) => t.dataset.tab === tabId);
      return tab ? tab.textContent.trim() : "Settings";
    },

    // Manage focus for accessibility
    manageFocus: function (targetTab) {
      // Ensure the tab is focusable
      targetTab.focus();

      // Scroll into view if needed
      targetTab.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    },

    // Trigger custom tab change event
    triggerTabChange: function (tab, content) {
      const event = new CustomEvent("tabChange", {
        detail: {
          tab: tab,
          content: content,
          tabId: tab.dataset.tab,
          tabTitle: tab.textContent.trim(),
        },
        bubbles: true,
      });

      tab.dispatchEvent(event);
    },

    // Add a new tab dynamically
    addTab: function (tabConfig) {
      const { id, title, content, position = "end" } = tabConfig;

      // Create tab element
      const tabElement = document.createElement("a");
      tabElement.href = "#";
      tabElement.className = "tab-item";
      tabElement.dataset.tab = id;
      tabElement.textContent = title;
      tabElement.setAttribute("role", "tab");
      tabElement.setAttribute("aria-controls", `content-${id}`);
      tabElement.setAttribute("tabindex", "-1");

      // Create content element
      const contentElement = document.createElement("div");
      contentElement.className = "tab-content";
      contentElement.dataset.tab = id;
      contentElement.id = `content-${id}`;
      contentElement.innerHTML = content;
      contentElement.setAttribute("role", "tabpanel");
      contentElement.setAttribute("aria-labelledby", id);
      contentElement.style.display = "none";
      contentElement.setAttribute("aria-hidden", "true");

      // Insert elements
      const tabsContainer =
        document.querySelector(".tabs-group") ||
        document.querySelector(".tabs-sidebar");
      const contentContainer =
        document.querySelector(".main-section") || document.body;

      if (position === "end") {
        tabsContainer.appendChild(tabElement);
        contentContainer.appendChild(contentElement);
      } else if (position === "start") {
        tabsContainer.insertBefore(tabElement, tabsContainer.firstChild);
        contentContainer.insertBefore(
          contentElement,
          contentContainer.firstChild
        );
      }

      // Update arrays
      this.tabs.push(tabElement);
      this.contents.push(contentElement);

      return { tab: tabElement, content: contentElement };
    },

    // Remove a tab
    removeTab: function (tabId) {
      const tabIndex = this.tabs.findIndex((tab) => tab.dataset.tab === tabId);
      const contentIndex = this.contents.findIndex(
        (content) => content.dataset.tab === tabId
      );

      if (tabIndex !== -1) {
        const tab = this.tabs[tabIndex];
        const content = this.contents[contentIndex];

        // If removing active tab, switch to another tab
        if (tab.classList.contains(this.config.activeClass)) {
          const nextTab = this.tabs[tabIndex + 1] || this.tabs[tabIndex - 1];
          if (nextTab) {
            this.switchTab(nextTab);
          }
        }

        // Remove elements
        tab.remove();
        if (content) content.remove();

        // Update arrays
        this.tabs.splice(tabIndex, 1);
        if (contentIndex !== -1) {
          this.contents.splice(contentIndex, 1);
        }
      }
    },

    // Get current active tab
    getCurrentTab: function () {
      return this.currentTab;
    },

    // Get all tabs
    getAllTabs: function () {
      return this.tabs;
    },

    // Check if a tab exists
    hasTab: function (tabId) {
      return this.tabs.some((tab) => tab.dataset.tab === tabId);
    },

    // Disable a tab
    disableTab: function (tabId) {
      const tab = this.tabs.find((t) => t.dataset.tab === tabId);
      if (tab) {
        tab.classList.add("tab-item--disabled");
        tab.setAttribute("aria-disabled", "true");
        tab.setAttribute("tabindex", "-1");
      }
    },

    // Enable a tab
    enableTab: function (tabId) {
      const tab = this.tabs.find((t) => t.dataset.tab === tabId);
      if (tab) {
        tab.classList.remove("tab-item--disabled");
        tab.setAttribute("aria-disabled", "false");
        if (tab.classList.contains(this.config.activeClass)) {
          tab.setAttribute("tabindex", "0");
        }
      }
    },

    // Refresh tabs (useful after dynamic content changes)
    refresh: function () {
      this.setupTabs();
      this.setInitialTab();
    },
  };

  // Register module with main app
  if (window.NeutysApp) {
    window.NeutysApp.modules.tabs = TabsModule;
  }

  // Auto-initialize if main app is not present
  if (!window.NeutysApp) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => TabsModule.init());
    } else {
      TabsModule.init();
    }
  }

  // Export for external use
  window.TabsModule = TabsModule;
})();
