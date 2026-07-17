const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const categoryMeta = {
  design: { icon: "pen-tool", label: "Graphics & Design", theme: "theme-design" },
  tech: { icon: "code-2", label: "Programming & Tech", theme: "theme-tech" },
  marketing: { icon: "megaphone", label: "Digital Marketing", theme: "theme-marketing" },
  video: { icon: "clapperboard", label: "Video & Animation", theme: "theme-video" },
  writing: { icon: "file-pen-line", label: "Writing & Translation", theme: "theme-writing" },
  business: { icon: "briefcase-business", label: "Business", theme: "theme-business" },
  ai: { icon: "bot", label: "AI Services", theme: "theme-ai" },
};

const demoServices = [
  serviceStub("brand-kit", "design", "I will design a crisp logo and mini brand kit for your launch", "Maya S.", 95, 2, 4.98, 312),
  serviceStub("shopify-fix", "tech", "I will fix Shopify layout bugs and speed issues in 24 hours", "Jon B.", 80, 1, 4.91, 188),
  serviceStub("seo-plan", "marketing", "I will create a practical SEO action plan for your website", "Rhea M.", 120, 3, 4.96, 244),
  serviceStub("caption-repair", "video", "I will clean captions and deliver polished SRT files", "Lena P.", 55, 1, 4.89, 157),
  serviceStub("landing-copy", "writing", "I will write conversion-focused landing page copy", "Omar R.", 140, 2, 4.97, 391),
  serviceStub("ai-agent", "ai", "I will prototype AI agents for your help center", "Theo N.", 220, 5, 4.94, 126),
];

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
      console.log('Unregistered rogue service worker from sem 5');
    }
  });
}
const state = {
  user: null,
  authMode: "signup",
  category: "all",
  query: "",
  sort: "recommended",
  saved: new Set(),
  selectedService: null,
  dashboard: null,
  wallet: null,
  appPage: "overview",
  apiAvailable: true,
  financeChartType: "line",
  notifications: [
    {
      id: "welcome",
      icon: "info",
      type: "info",
      text: "Welcome to FreelanceHub! Explore handpicked escrow-backed services.",
      time: new Date(),
      read: false
    }
  ],
  notificationTimer: null,
  upiTimer: null,
};

const selectors = {
  body: document.body,
  menuButton: document.querySelector("#menuButton"),
  navButtons: document.querySelectorAll("[data-scroll-target]"),
  searchForm: document.querySelector("#heroSearch"),
  searchInput: document.querySelector("#searchInput"),
  trendButtons: document.querySelectorAll("[data-query]"),
  categoryButtons: document.querySelectorAll("[data-category]"),
  categoryRail: document.querySelector("#categoryRail"),
  categoryPrev: document.querySelector("#categoryPrev"),
  categoryNext: document.querySelector("#categoryNext"),
  sortButtons: document.querySelectorAll("[data-sort]"),
  serviceGrid: document.querySelector("#serviceGrid"),
  joinButton: document.querySelector("#joinButton"),
  signinButton: document.querySelector("#signinButton"),
  dashboardButton: document.querySelector("#dashboardButton"),
  logoutButton: document.querySelector("#logoutButton"),
  workspaceNav: document.querySelector("#workspaceNav"),
  appNavButtons: document.querySelectorAll("[data-app-page-nav]"),
  appPages: document.querySelectorAll("[data-app-page]"),
  userMenuWrap: document.querySelector("#userMenuWrap"),
  userMenuButton: document.querySelector("#userMenuButton"),
  userMenu: document.querySelector("#userMenu"),
  userInitials: document.querySelector("#userInitials"),
  userMenuName: document.querySelector("#userMenuName"),
  userMenuEmail: document.querySelector("#userMenuEmail"),
  menuLogoutButton: document.querySelector("#menuLogoutButton"),
  joinDialog: document.querySelector("#joinDialog"),
  authForm: document.querySelector("#authForm"),
  authTabs: document.querySelectorAll("[data-auth-mode]"),
  authEyebrow: document.querySelector("#authEyebrow"),
  authTitle: document.querySelector("#authTitle"),
  authSubmit: document.querySelector("#authSubmit"),
  signupOnlyFields: document.querySelectorAll("[data-signup-only]"),
  roleDialog: document.querySelector("#roleDialog"),
  roleChoices: document.querySelectorAll("[data-role-choice]"),
  onboardingDialog: document.querySelector("#onboardingDialog"),
  onboardingForm: document.querySelector("#onboardingForm"),
  onboardingEyebrow: document.querySelector("#onboardingEyebrow"),
  onboardingTitle: document.querySelector("#onboardingTitle"),
  onboardingStepper: document.querySelector("#onboardingStepper"),
  onboardingBody: document.querySelector("#onboardingBody"),
  onboardingActions: document.querySelector("#onboardingActions"),
  orderDialog: document.querySelector("#orderDialog"),
  orderForm: document.querySelector("#orderForm"),
  orderTitle: document.querySelector("#orderTitle"),
  orderPrice: document.querySelector("#orderPrice"),
  sellerButton: document.querySelector("#sellerButton"),
  proButton: document.querySelector("#proButton"),
  dashboardSection: document.querySelector("#dashboard"),
  dashboardRoleButtons: document.querySelectorAll("[data-dashboard-role]"),
  dashboardRoleLabel: document.querySelector("#dashboardRoleLabel"),
  dashboardGreeting: document.querySelector("#dashboardGreeting"),
  dashboardSubcopy: document.querySelector("#dashboardSubcopy"),
  dashboardProgress: document.querySelector("#dashboardProgress"),
  dashboardProgressBar: document.querySelector("#dashboardProgressBar"),
  dashboardWidgets: document.querySelector("#dashboardWidgets"),
  dashboardNextSteps: document.querySelector("#dashboardNextSteps"),
  dashboardFunds: document.querySelector("#dashboardFunds"),
  dashboardActive: document.querySelector("#dashboardActive"),
  dashboardReview: document.querySelector("#dashboardReview"),
  dashboardMessages: document.querySelector("#dashboardMessages"),
  orderList: document.querySelector("#orderList"),
  sellerTools: document.querySelector("#sellerTools"),
  serviceForm: document.querySelector("#serviceForm"),
  connectPayoutsButton: document.querySelector("#connectPayoutsButton"),
  refreshDashboard: document.querySelector("#refreshDashboard"),
  walletPage: document.querySelector("#walletPage"),
  walletBalance: document.querySelector("#walletBalance"),
  walletBalanceCopy: document.querySelector("#walletBalanceCopy"),
  walletProviderLabel: document.querySelector("#walletProviderLabel"),
  walletCredits: document.querySelector("#walletCredits"),
  walletTransactions: document.querySelector("#walletTransactions"),
  walletAmount: document.querySelector("#walletAmount"),
  walletPhone: document.querySelector("#walletPhone"),
  walletPhoneField: document.querySelector("#walletPhoneField"),
  walletTopupButton: document.querySelector("#walletTopupButton"),
  walletPresetButtons: document.querySelectorAll("[data-wallet-amount]"),
  walletDemoNote: document.querySelector("#walletDemoNote"),
  financeIncoming: document.querySelector("#financeIncoming"),
  financeIncomingCopy: document.querySelector("#financeIncomingCopy"),
  financeOutgoing: document.querySelector("#financeOutgoing"),
  financeProtected: document.querySelector("#financeProtected"),
  financeCompleted: document.querySelector("#financeCompleted"),
  financeChart: document.querySelector("#financeChart"),
  financeRing: document.querySelector("#financeRing"),
  financeRingValue: document.querySelector("#financeRingValue"),
  financeSummaryCopy: document.querySelector("#financeSummaryCopy"),
  financeWalletBalance: document.querySelector("#financeWalletBalance"),
  financeVolume: document.querySelector("#financeVolume"),
  chartLineBtn: document.querySelector("#chartLineBtn"),
  chartPieBtn: document.querySelector("#chartPieBtn"),
  toast: document.querySelector("#toast"),
  
  themeToggle: document.querySelector("#themeToggle"),
  googleAuthButton: document.querySelector("#googleAuthButton"),
  
  paymentDialog: document.querySelector("#paymentDialog"),
  paymentForm: document.querySelector("#paymentForm"),
  paymentTitle: document.querySelector("#paymentTitle"),
  paymentGatewayAmount: document.querySelector("#paymentGatewayAmount"),
  paymentLoader: document.querySelector("#paymentLoader"),
  paymentMethods: document.querySelector("#paymentMethods"),
  paymentCardForm: document.querySelector("#paymentCardForm"),
  confirmPaymentBtn: document.querySelector("#confirmPaymentBtn"),
  
  floatingWallet: document.querySelector("#floatingWallet"),
  floatingWalletToggle: document.querySelector("#floatingWalletToggle"),
  floatingWalletBalance: document.querySelector("#floatingWalletBalance"),
  
  dashboardActivityPanel: document.querySelector("#dashboardActivityPanel"),
  activityTimeline: document.querySelector("#activityTimeline"),
  dashboardEmailPanel: document.querySelector("#dashboardEmailPanel"),
  emailLogList: document.querySelector("#emailLogList"),
  
  // Notification system selectors
  notificationWrap: document.querySelector("#notificationWrap"),
  notificationButton: document.querySelector("#notificationButton"),
  notificationBadge: document.querySelector("#notificationBadge"),
  notificationPanel: document.querySelector("#notificationPanel"),
  notificationList: document.querySelector("#notificationList"),
  clearNotificationsButton: document.querySelector("#clearNotificationsButton"),

  // Dedicated Payment Gateway Page selectors
  gatewayPage: document.querySelector("#gatewayPage"),
  cancelGatewayButton: document.querySelector("#cancelGatewayButton"),
  gatewayItemTitle: document.querySelector("#gatewayItemTitle"),
  gatewayItemPrice: document.querySelector("#gatewayItemPrice"),
  gatewayTotalAmount: document.querySelector("#gatewayTotalAmount"),
  gatewayPayCardButton: document.querySelector("#gatewayPayCardButton"),
  gatewayPayUpiButton: document.querySelector("#gatewayPayUpiButton"),
  gatewayCardNo: document.querySelector("#gatewayCardNo"),
  gatewayCardName: document.querySelector("#gatewayCardName"),
  gatewayCardExpiry: document.querySelector("#gatewayCardExpiry"),
  gatewayCardCvv: document.querySelector("#gatewayCardCvv"),
  gatewayUpiVpa: document.querySelector("#gatewayUpiVpa"),
  gatewayCardPanel: document.querySelector("#gatewayCardPanel"),
  gatewayUpiPanel: document.querySelector("#gatewayUpiPanel"),
  gatewayProcessing: document.querySelector("#gatewayProcessing"),
  gatewayProcessingText: document.querySelector("#gatewayProcessingText"),
  gatewayProgressBarInner: document.querySelector("#gatewayProgressBarInner"),
  gatewayReceiptPanel: document.querySelector("#gatewayReceiptPanel"),
  receiptDate: document.querySelector("#receiptDate"),
  receiptTxId: document.querySelector("#receiptTxId"),
  receiptUser: document.querySelector("#receiptUser"),
  receiptAmount: document.querySelector("#receiptAmount"),
  receiptPrintButton: document.querySelector("#receiptPrintButton"),
  receiptCloseButton: document.querySelector("#receiptCloseButton"),
  upiTimerMinutes: document.querySelector("#upiTimerMinutes"),
  upiQrCodeContainer: document.querySelector("#upiQrCodeContainer"),
  upiQrSpinner: document.querySelector("#upiQrSpinner"),
  
  // Interactive credit card preview selectors
  cardFlipInner: document.querySelector("#cardFlipInner"),
  previewNumber: document.querySelector("#previewNumber"),
  previewHolder: document.querySelector("#previewHolder"),
  previewExpiry: document.querySelector("#previewExpiry"),
  previewCvv: document.querySelector("#previewCvv"),
};

async function init() {
  initTheme();
  bindEvents();
  initGoogleAuth();
  setAuthMode("signup");
  
  initLogoNav();
  initNotificationToggle();
  initInteractiveCard();
  renderNotifications();
  
  await Promise.allSettled([loadCurrentUser(), loadServices()]);
  handleCheckoutReturn();
  refreshIcons();
}

function initTheme() {
  const isDark = localStorage.getItem("theme") === "dark" || 
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const iconElement = selectors.themeToggle.querySelector("i, svg");
  if (isDark) {
    document.documentElement.setAttribute("data-theme", "dark");
    if (iconElement) iconElement.outerHTML = '<i data-lucide="sun"></i>';
  } else {
    if (iconElement) iconElement.outerHTML = '<i data-lucide="moon"></i>';
  }
}

function toggleTheme() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const iconElement = selectors.themeToggle.querySelector("i, svg");
  if (isDark) {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
    if (iconElement) iconElement.outerHTML = '<i data-lucide="moon"></i>';
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    if (iconElement) iconElement.outerHTML = '<i data-lucide="sun"></i>';
  }
  lucide.createIcons();
  // Re-render canvas charts so they pick up the new color scheme
  if (state.dashboard?.finance) {
    renderFinance(state.dashboard.finance);
  }
}

function bindEvents() {
  selectors.themeToggle.addEventListener("click", toggleTheme);
  selectors.menuButton.addEventListener("click", () => {
    selectors.body.classList.toggle("menu-open");
    const open = selectors.body.classList.contains("menu-open");
    selectors.menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  selectors.navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(`#${button.dataset.scrollTarget}`);
      selectors.body.classList.remove("menu-open");
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  selectors.searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.query = selectors.searchInput.value.trim();
    loadServices();
    document.querySelector("#services")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  selectors.searchInput.addEventListener("input", debounce(() => {
    state.query = selectors.searchInput.value.trim();
    loadServices();
  }, 220));

  selectors.trendButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectors.searchInput.value = button.dataset.query;
      state.query = button.dataset.query;
      state.category = "all";
      updateCategoryButtons();
      loadServices();
      document.querySelector("#services")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  selectors.categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.category = button.dataset.category;
      updateCategoryButtons();
      loadServices();
    });
  });

  selectors.sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.sort = button.dataset.sort;
      selectors.sortButtons.forEach((item) => item.classList.toggle("active", item.dataset.sort === state.sort));
      loadServices();
    });
  });

  selectors.categoryPrev.addEventListener("click", () => scrollCategories(-1));
  selectors.categoryNext.addEventListener("click", () => scrollCategories(1));
  selectors.joinButton.addEventListener("click", () => openAuthDialog("signup"));
  selectors.signinButton.addEventListener("click", () => openAuthDialog("login"));
  selectors.dashboardButton.addEventListener("click", () => openDashboard());
  selectors.logoutButton.addEventListener("click", logout);
  selectors.menuLogoutButton.addEventListener("click", logout);
  selectors.userMenuButton.addEventListener("click", toggleUserMenu);
  selectors.appNavButtons.forEach((button) => {
    button.addEventListener("click", () => openAppPage(button.dataset.appPageNav));
  });
  selectors.sellerButton.addEventListener("click", startSelling);
  selectors.proButton.addEventListener("click", () => {
    state.category = "all";
    state.sort = "recommended";
    updateCategoryButtons();
    loadServices();
    document.querySelector("#services")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  selectors.authTabs.forEach((button) => {
    button.addEventListener("click", () => setAuthMode(button.dataset.authMode));
  });
  selectors.authForm.addEventListener("submit", submitAuthForm);
  selectors.roleChoices.forEach((button) => {
    button.addEventListener("click", () => chooseRole(button.dataset.roleChoice));
  });
  selectors.onboardingForm.addEventListener("submit", submitOnboarding);
  selectors.onboardingBody.addEventListener("click", (event) => {
    if (event.target.closest("#profileAssistButton")) {
      generateProfileDraft();
    }
  });
  selectors.orderForm.addEventListener("submit", submitOrderForm);

  selectors.dashboardRoleButtons.forEach((button) => {
    button.addEventListener("click", () => switchDashboardRole(button.dataset.dashboardRole));
  });
  selectors.refreshDashboard.addEventListener("click", loadDashboard);
  selectors.dashboardNextSteps.addEventListener("click", (event) => {
    const button = event.target.closest("[data-dashboard-action]");
    if (button) handleDashboardAction(button.dataset.dashboardAction);
  });
  selectors.serviceForm.addEventListener("submit", submitServiceForm);
  selectors.connectPayoutsButton.addEventListener("click", connectPayouts);
  selectors.walletPresetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectors.walletAmount.value = button.dataset.walletAmount;
      selectors.walletPresetButtons.forEach((item) => item.classList.toggle("active", item === button));
    });
  });
  selectors.walletTopupButton.addEventListener("click", addWalletFunds);
  
  if (selectors.chartLineBtn) {
    selectors.chartLineBtn.addEventListener("click", () => {
      state.financeChartType = "line";
      updateChartToggleUI();
      if (state.dashboard && state.dashboard.finance) {
        renderFinance(state.dashboard.finance);
      }
    });
  }
  if (selectors.chartPieBtn) {
    selectors.chartPieBtn.addEventListener("click", () => {
      state.financeChartType = "pie";
      updateChartToggleUI();
      if (state.dashboard && state.dashboard.finance) {
        renderFinance(state.dashboard.finance);
      }
    });
  }
  
  if (selectors.floatingWalletToggle) {
    selectors.floatingWalletToggle.addEventListener("click", () => {
      selectors.floatingWallet.classList.toggle("open");
    });
  }
  
  // Close float menu when clicking outside
  document.addEventListener("click", (e) => {
    if (selectors.floatingWallet && selectors.floatingWallet.classList.contains("open") && !selectors.floatingWallet.contains(e.target)) {
      selectors.floatingWallet.classList.remove("open");
    }
  });
  
  if (selectors.paymentMethods) {
    selectors.paymentMethods.querySelectorAll('.payment-method-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectors.paymentMethods.classList.add('hidden');
        selectors.paymentCardForm.classList.remove('hidden');
      });
    });
  }
}

function initGoogleAuth() {
  if (window.google?.accounts?.id) {
    window.google.accounts.id.initialize({
      client_id: "678943507030-1i0os5s8s3o900jhaq6i9q6vf952jtd7.apps.googleusercontent.com",
      callback: handleGoogleCallback,
    });
    window.google.accounts.id.renderButton(
      selectors.googleAuthButton,
      { theme: "outline", size: "small", shape: "rectangular", width: 240 }
    );
  }
}

async function handleGoogleCallback(response) {
  try {
    const payload = await api("/auth/google", {
      method: "POST",
      body: JSON.stringify({ token: response.credential, role: "client" }),
    });
    state.user = payload.user;
    selectors.joinDialog.close();
    updateAuthUI();
    await loadDashboard();
    openDashboard();
    maybeStartOnboarding();
    showToast(payload.isNew ? "Account created via Google." : "Logged in via Google.");
  } catch (error) {
    showToast(error.message);
  }
}

async function api(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : null;
  if (!response.ok) {
    throw new Error(payload?.error?.message || "Request failed.");
  }
  return payload;
}

async function loadCurrentUser() {
  try {
    const payload = await api("/auth/me");
    state.user = payload.user;
    updateAuthUI();
    await loadDashboard();
    maybeStartOnboarding();
  } catch {
    state.user = null;
    updateAuthUI();
  }
}

async function loadServices() {
  const params = new URLSearchParams({
    q: state.query,
    category: state.category,
    sort: state.sort === "fast" ? "fast" : state.sort === "budget" ? "price" : "recommended",
  });

  try {
    const payload = await api(`/services?${params.toString()}`);
    let services = payload.services.map(normalizeService);
    if (state.sort === "budget") {
      services = services.filter((service) => service.price < 100);
    }
    state.apiAvailable = true;
    renderServices(services);
  } catch (error) {
    state.apiAvailable = false;
    renderServices(filterDemoServices());
  }
}

function renderServices(services) {
  if (!services.length) {
    selectors.serviceGrid.innerHTML = `
      <div class="empty-state">
        No services matched that search. Try a broader keyword like design, website, captions, AI, or data.
      </div>
    `;
    return;
  }

  selectors.serviceGrid.innerHTML = services.map(renderServiceCard).join("");
  selectors.serviceGrid.querySelectorAll(".save-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const id = button.dataset.saveId;
      if (state.saved.has(id)) {
        state.saved.delete(id);
        showToast("Removed from saved services.");
      } else {
        state.saved.add(id);
        showToast("Saved service.");
      }
      loadServices();
    });
  });

  selectors.serviceGrid.querySelectorAll(".service-card").forEach((card) => {
    const open = () => startOrder(card.dataset.serviceId, services);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      open();
    });
  });
  refreshIcons();
}

function renderServiceCard(service) {
  const saved = state.saved.has(service.id);
  const category = categoryMeta[service.category] || categoryMeta.design;
  const deliveryLabel = service.deliveryDays === 1 ? "24h delivery" : `${service.deliveryDays} day delivery`;
  return `
    <article class="service-card" data-service-id="${service.id}" tabindex="0" aria-label="${escapeHtml(service.title)}">
      <div class="service-body">
        <div class="specialist-card-top">
          <span class="avatar">${escapeHtml(getInitials(service.sellerName))}</span>
          <div class="specialist-card-tools">
            <span class="specialist-availability" title="Available"><i data-lucide="circle-check"></i></span>
            <button class="save-button ${saved ? "saved" : ""}" type="button" data-save-id="${service.id}" aria-label="${saved ? "Unsave service" : "Save service"}" title="${saved ? "Unsave" : "Save"}">
              <i data-lucide="heart"></i>
            </button>
          </div>
        </div>
        <div class="specialist-heading">
          <h3 class="seller-name">${escapeHtml(service.sellerName)}</h3>
          <span class="seller-level"><i data-lucide="badge-check"></i>${escapeHtml(service.level)}</span>
        </div>
        <div class="specialist-tags" aria-label="Service details">
          <span><i data-lucide="star"></i>${service.rating.toFixed(2)}</span>
          <span><i data-lucide="layers-3"></i>${escapeHtml(category.label)}</span>
          <span><i data-lucide="clock-3"></i>${deliveryLabel}</span>
        </div>
        <div class="specialist-service">
          <span>${escapeHtml(category.label)}</span>
          <strong class="service-title">${escapeHtml(service.title)}</strong>
        </div>
        <div class="specialist-card-bottom">
          <div class="price-row">
            <span>Starting at</span>
            <strong>${currency.format(service.price)}</strong>
          </div>
          <span class="service-open-action">See details <i data-lucide="arrow-up-right"></i></span>
        </div>
      </div>
    </article>
  `;
}

function startOrder(serviceId, renderedServices) {
  const service = renderedServices.find((item) => item.id === serviceId);
  if (!service) return;

  if (!state.user) {
    openAuthDialog("signup");
    showToast("Create an account or sign in to start checkout.");
    return;
  }

  if (!state.user.roles.includes("client")) {
    showToast("Switch to a client-enabled account to buy services.");
    return;
  }

  state.selectedService = service;
  selectors.orderTitle.textContent = service.title;
  selectors.orderPrice.textContent = `${currency.format(service.price)} protected checkout. Funds release after approval.`;
  selectors.orderForm.reset();
  selectors.orderDialog.showModal();
  refreshIcons();
}

async function submitOrderForm(event) {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault();
  if (!state.selectedService) return;

  const formData = new FormData(selectors.orderForm);
  const serviceId = state.selectedService.id;
  const requirements = formData.get("requirements");
  const price = state.selectedService.price;
  
  selectors.orderDialog.close();
  
  openGatewayPage({
    type: "service_purchase",
    title: state.selectedService.title,
    amount: price,
    fee: 0,
    total: price,
    checkoutAction: async () => {
      const payload = await api("/orders/checkout", {
        method: "POST",
        body: JSON.stringify({
          serviceId,
          requirements,
        }),
      });
      return payload;
    }
  });
}

function openAuthDialog(mode) {
  setAuthMode(mode);
  selectors.authForm.reset();
  selectors.joinDialog.showModal();
  initGoogleAuth();
  refreshIcons();
}

function setAuthMode(mode) {
  state.authMode = mode;
  const isSignup = mode === "signup";
  selectors.authTabs.forEach((button) => button.classList.toggle("active", button.dataset.authMode === mode));
  selectors.authEyebrow.textContent = isSignup ? "Create your account" : "Welcome back";
  selectors.authTitle.textContent = isSignup ? "Join FreelanceHub" : "Log in";
  selectors.authSubmit.textContent = isSignup ? "Create account" : "Log in";
  selectors.signupOnlyFields.forEach((field) => field.classList.toggle("hidden", !isSignup));
  selectors.authForm.elements.name.required = isSignup;
}

async function submitAuthForm(event) {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault();

  const formData = new FormData(selectors.authForm);
  const endpoint = state.authMode === "signup" ? "/auth/signup" : "/auth/login";
  const payload =
    state.authMode === "signup"
      ? {
          name: formData.get("name"),
          email: formData.get("email"),
          password: formData.get("password"),
        }
      : {
          email: formData.get("email"),
          password: formData.get("password"),
        };

  try {
    const result = await api(endpoint, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    state.user = result.user;
    selectors.joinDialog.close();
    updateAuthUI();
    await loadDashboard();
    openDashboard();
    maybeStartOnboarding();
    showToast(state.authMode === "signup" ? "Account created." : "Logged in.");
  } catch (error) {
    showToast(error.message);
  }
}

function onboardingNeed() {
  if (!state.user) return null;
  const onboarding = state.user.onboarding || {};
  if (!onboarding.roleChoiceComplete) return "role";
  if (state.user.activeRole === "freelancer" && !onboarding.freelancerComplete) return "freelancer";
  if (state.user.activeRole === "client" && !onboarding.clientComplete) return "client";
  return null;
}

function maybeStartOnboarding() {
  const next = onboardingNeed();
  if (next === "role") {
    if (!selectors.roleDialog.open) selectors.roleDialog.showModal();
    refreshIcons();
    return;
  }
  if (next) openOnboarding(next);
}

async function chooseRole(role) {
  try {
    const payload = await api("/onboarding/role", {
      method: "POST",
      body: JSON.stringify({ role }),
    });
    state.user = payload.user;
    selectors.roleDialog.close();
    updateAuthUI();
    await loadDashboard();
    openOnboarding(state.user.activeRole);
  } catch (error) {
    showToast(error.message);
  }
}

function openOnboarding(role) {
  if (!state.user) return;
  renderOnboarding(role);
  if (!selectors.onboardingDialog.open) selectors.onboardingDialog.showModal();
  refreshIcons();
}

function renderOnboarding(role) {
  const profile = state.user.profile || {};
  const selected = (value, option) => (value === option ? "selected" : "");

  if (role === "client") {
    selectors.onboardingEyebrow.textContent = "Client setup";
    selectors.onboardingTitle.textContent = "What kind of help are you looking for?";
    selectors.onboardingStepper.innerHTML = `<span class="active">1. Your focus</span><span>2. Start exploring</span>`;
    selectors.onboardingBody.innerHTML = `
      <div class="onboarding-copy"><p>Give your workspace a little context. It helps us shape a more useful starting point without slowing you down.</p></div>
      <label>
        <span>What do you want to get done first?</span>
        <textarea name="clientFocus" required minlength="12" maxlength="240" placeholder="For example: launch a cleaner website, create product videos, improve my store...">${escapeHtml(state.user.onboarding?.clientFocus || "")}</textarea>
      </label>
      <label>
        <span>Where are you based? <small>Optional</small></span>
        <input name="country" maxlength="80" value="${escapeHtml(profile.country || "")}" placeholder="City or country" />
      </label>
    `;
    selectors.onboardingActions.innerHTML = `<button class="join-button" type="submit" value="default"><span>Start exploring</span><i data-lucide="arrow-right"></i></button>`;
    return;
  }

  selectors.onboardingEyebrow.textContent = "Freelancer setup";
  selectors.onboardingTitle.textContent = "Make your first impression feel like you.";
  selectors.onboardingStepper.innerHTML = `<span class="active">1. Your craft</span><span class="active">2. Profile co-pilot</span><span>3. Publish</span>`;
  selectors.onboardingBody.innerHTML = `
    <div class="onboarding-copy"><p>Tell us what you are good at in your own words. The profile co-pilot will turn it into an editable starting point, never a made-up persona.</p></div>
    <div class="onboarding-fields">
      <label>
        <span>Your specialty</span>
        <input name="specialty" required maxlength="80" value="${escapeHtml(profile.specialty || "")}" placeholder="For example: Shopify storefronts, brand identity, short-form editing" />
      </label>
      <label>
        <span>Experience level</span>
        <select name="experienceLevel" required>
          <option value="student" ${selected(profile.experienceLevel, "student")}>Student / learning</option>
          <option value="emerging" ${selected(profile.experienceLevel, "emerging")}>Emerging freelancer</option>
          <option value="experienced" ${selected(profile.experienceLevel, "experienced")}>Experienced independent</option>
          <option value="specialist" ${selected(profile.experienceLevel, "specialist")}>Specialist / consultant</option>
        </select>
      </label>
      <label>
        <span>Availability</span>
        <select name="availability" required>
          <option value="5-10 hours a week" ${selected(profile.availability, "5-10 hours a week")}>5-10 hours a week</option>
          <option value="10-20 hours a week" ${selected(profile.availability, "10-20 hours a week")}>10-20 hours a week</option>
          <option value="20+ hours a week" ${selected(profile.availability, "20+ hours a week")}>20+ hours a week</option>
          <option value="Project based" ${selected(profile.availability, "Project based")}>Project based</option>
        </select>
      </label>
      <label>
        <span>Clients you want to help</span>
        <input name="targetClient" required maxlength="120" value="${escapeHtml(profile.targetClient || "")}" placeholder="For example: founders, local businesses, D2C brands" />
      </label>
    </div>
    <label>
      <span>What can you help with?</span>
      <textarea name="summary" required minlength="24" maxlength="500" placeholder="Describe the work you enjoy, the problems you solve, and how you like to work.">${escapeHtml(profile.bio || "")}</textarea>
    </label>
    <label>
      <span>Skills</span>
      <input name="skills" required value="${escapeHtml((profile.skills || []).join(", "))}" placeholder="Shopify, UX writing, Figma, video editing" />
    </label>
    <div class="profile-copilot">
      <div><i data-lucide="wand-sparkles"></i><span><strong>Profile co-pilot</strong><small>Creates an editable headline, bio, skills, and first-service direction from your answers.</small></span></div>
      <button class="ghost-button" id="profileAssistButton" type="button"><i data-lucide="sparkles"></i> Create my draft</button>
    </div>
    <div class="profile-draft" id="profileDraft">
      <label>
        <span>Profile headline</span>
        <input name="headline" required maxlength="120" value="${escapeHtml(profile.headline || "")}" placeholder="Your clear, client-facing specialty" />
      </label>
      <label>
        <span>About you</span>
        <textarea name="bio" required minlength="40" maxlength="1200" placeholder="A concise, credible introduction for clients.">${escapeHtml(profile.bio || "")}</textarea>
      </label>
      <p class="draft-note" id="profileDraftNote">You can edit every word before saving.</p>
    </div>
    <label>
      <span>Where are you based? <small>Optional</small></span>
      <input name="country" maxlength="80" value="${escapeHtml(profile.country || "")}" placeholder="City or country" />
    </label>
  `;
  selectors.onboardingActions.innerHTML = `<button class="join-button" type="submit" value="default"><span>Finish my profile</span><i data-lucide="arrow-right"></i></button>`;
}

async function generateProfileDraft() {
  const formData = new FormData(selectors.onboardingForm);
  const button = selectors.onboardingBody.querySelector("#profileAssistButton");
  const draftNote = selectors.onboardingBody.querySelector("#profileDraftNote");
  if (!button) return;

  button.disabled = true;
  button.innerHTML = `<i data-lucide="loader-circle"></i> Shaping your draft`;
  refreshIcons();

  try {
    const payload = await api("/onboarding/profile-assist", {
      method: "POST",
      body: JSON.stringify({
        specialty: formData.get("specialty"),
        skills: formData.get("skills"),
        targetClient: formData.get("targetClient"),
        experienceLevel: formData.get("experienceLevel"),
        availability: formData.get("availability"),
        summary: formData.get("summary"),
      }),
    });
    const { draft } = payload;
    selectors.onboardingForm.elements.headline.value = draft.headline;
    selectors.onboardingForm.elements.bio.value = draft.bio;
    selectors.onboardingForm.elements.skills.value = draft.skills.join(", ");
    draftNote.textContent = draft.source === "ai" ? "AI draft ready. Edit every word so it stays unmistakably yours." : "Starter draft ready. Add an OpenAI API key later to enable model-generated wording.";
    showToast("Your profile draft is ready to refine.");
  } catch (error) {
    showToast(error.message);
  } finally {
    button.disabled = false;
    button.innerHTML = `<i data-lucide="sparkles"></i> Refresh my draft`;
    refreshIcons();
  }
}

async function submitOnboarding(event) {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault();
  if (!state.user) return;

  const formData = new FormData(selectors.onboardingForm);
  const role = state.user.activeRole;
  const payload = role === "client"
    ? {
        role,
        clientFocus: formData.get("clientFocus"),
        country: formData.get("country"),
      }
    : {
        role,
        specialty: formData.get("specialty"),
        experienceLevel: formData.get("experienceLevel"),
        availability: formData.get("availability"),
        targetClient: formData.get("targetClient"),
        country: formData.get("country"),
        headline: formData.get("headline"),
        bio: formData.get("bio"),
        skills: String(formData.get("skills") || "").split(",").map((skill) => skill.trim()).filter(Boolean).slice(0, 6),
      };

  try {
    const result = await api("/onboarding/complete", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    state.user = result.user;
    selectors.onboardingDialog.close();
    updateAuthUI();
    await loadDashboard();
    openDashboard();
    showToast(role === "freelancer" ? "Your freelancer profile is ready." : "Your workspace is ready.");
  } catch (error) {
    showToast(error.message);
  }
}

async function logout() {
  try {
    await api("/auth/logout", { method: "POST" });
  } catch {
    // Local UI reset is still safe if the cookie was already gone.
  }
  state.user = null;
  state.dashboard = null;
  state.wallet = null;
  updateAuthUI();
  selectors.body.classList.remove("app-mode");
  selectors.appPages.forEach((page) => page.classList.remove("active"));
  selectors.dashboardSection.classList.add("hidden");
  selectors.walletPage.classList.add("hidden");
  document.querySelector("#financePage")?.classList.add("hidden");
  showToast("Logged out.");
}

async function startSelling() {
  if (!state.user) {
    openAuthDialog("signup");
    return;
  }

  try {
    if (!state.user.roles.includes("freelancer")) {
      await chooseRole(state.user.roles.includes("client") ? "both" : "freelancer");
      return;
    }
    await switchDashboardRole("freelancer");
    maybeStartOnboarding();
  } catch (error) {
    showToast(error.message);
  }
}

function updateAuthUI() {
  const loggedIn = Boolean(state.user);
  selectors.dashboardButton.classList.toggle("hidden", true);
  selectors.logoutButton.classList.toggle("hidden", true);
  selectors.signinButton.classList.toggle("hidden", loggedIn);
  selectors.joinButton.classList.toggle("hidden", loggedIn);
  selectors.workspaceNav.classList.toggle("hidden", !loggedIn);
  selectors.userMenuWrap.classList.toggle("hidden", !loggedIn);
  if (loggedIn) {
    selectors.userInitials.textContent = getInitials(state.user.name || "FH");
    selectors.userMenuName.textContent = String(state.user.name || "Account").trim().split(/\s+/)[0];
    selectors.userMenuEmail.textContent = state.user.email || "";
  } else {
    selectors.userMenu.classList.add("hidden");
    selectors.userMenuButton.setAttribute("aria-expanded", "false");
  }
  selectors.dashboardRoleButtons.forEach((button) => {
    button.disabled = loggedIn && !state.user.roles.includes(button.dataset.dashboardRole);
    button.classList.toggle("active", loggedIn && state.user.activeRole === button.dataset.dashboardRole);
  });
}

async function openDashboard() {
  if (!state.user) {
    openAuthDialog("login");
    return;
  }
  selectors.dashboardSection.classList.remove("hidden");
  await loadDashboard();
  maybeStartOnboarding();
  openAppPage("overview", { scroll: true, skipLoad: true });
}

async function openAppPage(page, { scroll = true, skipLoad = false } = {}) {
  if (!state.user) {
    openAuthDialog("login");
    return;
  }
  const allowedPages = ["overview", "marketplace", "wallet", "finance", "gateway"];
  const nextPage = allowedPages.includes(page) ? page : "overview";
  state.appPage = nextPage;
  selectors.body.classList.add("app-mode");
  selectors.dashboardSection.classList.remove("hidden");
  selectors.walletPage.classList.remove("hidden");
  document.querySelector("#financePage")?.classList.remove("hidden");
  selectors.gatewayPage?.classList.remove("hidden");
  selectors.appPages.forEach((item) => item.classList.toggle("active", item.dataset.appPage === nextPage));
  selectors.appNavButtons.forEach((button) => button.classList.toggle("active", button.dataset.appPageNav === nextPage));
  selectors.userMenu.classList.add("hidden");
  selectors.userMenuButton.setAttribute("aria-expanded", "false");

  if (!skipLoad && nextPage === "overview") await loadDashboard();
  if (nextPage === "wallet") await loadWallet();
  if (nextPage === "finance") {
    if (!state.dashboard) await loadDashboard();
    else renderFinance(state.dashboard.finance || {});
  }
  if (scroll) document.querySelector(`[data-app-page="${nextPage}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function toggleUserMenu() {
  if (!state.user) return;
  const willOpen = selectors.userMenu.classList.contains("hidden");
  selectors.userMenu.classList.toggle("hidden", !willOpen);
  selectors.userMenuButton.setAttribute("aria-expanded", String(willOpen));
}

async function switchDashboardRole(role) {
  if (!state.user) return;
  try {
    const payload = await api("/auth/role", {
      method: "PATCH",
      body: JSON.stringify({ activeRole: role }),
    });
    state.user = payload.user;
    updateAuthUI();
    await loadDashboard();
    maybeStartOnboarding();
  } catch (error) {
    showToast(error.message);
  }
}

async function loadDashboard() {
  if (!state.user) return;
  try {
    const payload = await api("/dashboard");
    state.dashboard = payload;
    state.user = payload.user;
    updateAuthUI();
    renderDashboard(payload);
    renderFinance(payload.finance || {});
    
    if (payload.emailLog && payload.emailLog.length > 0) {
      payload.emailLog.forEach(email => {
        const textStr = `Email Sent: [${email.subject}] to ${email.to}`;
        const exists = state.notifications.some(n => n.text === textStr);
        if (!exists) {
          state.notifications.unshift({
            id: "email_" + email.createdAt + "_" + Math.floor(Math.random() * 1000),
            icon: "mail",
            type: "info",
            text: textStr,
            time: new Date(email.createdAt),
            read: true
          });
        }
      });
      renderNotifications();
    }
  } catch (error) {
    showToast(error.message);
  }
}

async function loadWallet() {
  if (!state.user) return;
  try {
    const payload = await api("/payments/wallet");
    state.wallet = payload.wallet;
    renderWallet(payload.wallet);
  } catch (error) {
    showToast(error.message);
  }
}

function renderWallet(wallet) {
  const balance = Number(wallet.balance || 0);
  const isDemo = wallet.provider === "demo";
  selectors.walletBalance.textContent = currency.format(balance);
  if (selectors.floatingWalletBalance) {
    selectors.floatingWalletBalance.textContent = currency.format(balance);
    selectors.floatingWallet.classList.remove("hidden");
  }
  selectors.walletCredits.textContent = `${currency.format(wallet.credits || 0)} added`;
  selectors.walletProviderLabel.textContent = isDemo ? "Demo payments" : `${String(wallet.provider || "payment").toUpperCase()} payments`;
  selectors.walletBalanceCopy.textContent = isDemo
    ? "Demo funds are ready to use in your presentation ledger."
    : "Add funds securely, then track every wallet movement here.";
  selectors.walletTopupButton.innerHTML = `<i data-lucide="${isDemo ? "plus-circle" : "lock-keyhole"}"></i>${isDemo ? "Add demo funds" : "Continue to payment"}`;
  selectors.walletDemoNote.innerHTML = isDemo
    ? `<i data-lucide="sparkles"></i> Funds are credited instantly to this presentation ledger.`
    : `<i data-lucide="shield-check"></i> Funds are credited after the payment provider confirms the transaction.`;
  selectors.walletPhoneField.classList.toggle("hidden", isDemo);
  selectors.walletPhone.value = wallet.phone || "";

  if (!wallet.transactions?.length) {
    selectors.walletTransactions.innerHTML = `<div class="wallet-empty"><span><i data-lucide="wallet-minimal"></i></span><div><strong>Your ledger is clear.</strong><p>Add demo funds to see a real stored transaction here.</p></div></div>`;
  } else {
    selectors.walletTransactions.innerHTML = wallet.transactions.map(renderWalletTransaction).join("");
  }
  refreshIcons();
}

function renderWalletTransaction(transaction) {
  const succeeded = transaction.status === "succeeded";
  const createdAt = transaction.completedAt || transaction.createdAt;
  return `
    <article class="wallet-transaction ${succeeded ? "is-succeeded" : ""}">
      <span class="wallet-transaction-icon"><i data-lucide="${transaction.direction === "credit" ? "arrow-down-left" : "arrow-up-right"}"></i></span>
      <div><strong>${escapeHtml(transaction.description || "Wallet transaction")}</strong><small>${createdAt ? new Date(createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "Just now"} / ${escapeHtml(transaction.status)}</small></div>
      <strong class="wallet-transaction-amount ${transaction.direction === "credit" ? "credit" : "debit"}">${transaction.direction === "credit" ? "+" : "-"}${currency.format(transaction.amount || 0)}</strong>
    </article>
  `;
}

async function addWalletFunds() {
  const amount = Number(selectors.walletAmount.value);
  if (!Number.isFinite(amount) || amount < 50) {
    showToast("Enter an amount of at least ₹50.");
    return;
  }
  
  openGatewayPage({
    type: "wallet_topup",
    title: "Wallet Credit Top-Up",
    amount: amount,
    fee: 0,
    total: amount,
    checkoutAction: async () => {
      const payload = await api("/payments/wallet/top-up", {
        method: "POST",
        body: JSON.stringify({ amount, phone: selectors.walletPhone.value.trim() }),
      });
      return payload;
    }
  });
}

function updateChartToggleUI() {
  if (selectors.chartLineBtn && selectors.chartPieBtn) {
    const isLine = state.financeChartType !== "pie";
    selectors.chartLineBtn.classList.toggle("active", isLine);
    selectors.chartPieBtn.classList.toggle("active", !isLine);
  }
}

function renderFinance(finance) {
  const incoming = Number(finance.incoming || 0);
  const outgoing = Number(finance.outgoing || 0);
  const protectedFunds = Number(finance.protectedFunds || 0);
  const completed = Number(finance.completedValue || 0);
  
  updateChartToggleUI();
  
  selectors.financeIncoming.textContent = currency.format(incoming);
  selectors.financeOutgoing.textContent = currency.format(outgoing);
  selectors.financeProtected.textContent = currency.format(protectedFunds);
  selectors.financeCompleted.textContent = currency.format(completed);
  selectors.financeIncomingCopy.textContent = state.user?.activeRole === "freelancer" ? "Completed earnings" : "Wallet credits";
  selectors.financeWalletBalance.textContent = currency.format(finance.walletBalance || 0);
  selectors.financeVolume.textContent = currency.format(completed || protectedFunds || 0);
  const monthly = Array.isArray(finance.monthly) ? finance.monthly : [];
  
  const canvas = document.getElementById('financeChartCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const displayWidth = rect.width || canvas.clientWidth || 400;
    const displayHeight = rect.height || canvas.clientHeight || 210;
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    canvas.style.width = displayWidth + 'px';
    canvas.style.height = displayHeight + 'px';
    ctx.scale(dpr, dpr);
    const width = displayWidth;
    const height = displayHeight;
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute("data-theme") === "dark";

      if (state.financeChartType === "pie") {
      const total = incoming + outgoing;
      const centerX = width / 2;
      const centerY = height / 2 - 12;
      const radius = Math.min(width, height) / 2 - 35;
      const innerRadius = radius * 0.55;

      if (total === 0) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';
        ctx.lineWidth = 15;
        ctx.stroke();
        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '13px sans-serif';
        ctx.fillText('No transaction data', centerX, centerY);
      } else {
        const incomingAngle = (incoming / total) * 2 * Math.PI;
        const outgoingAngle = (outgoing / total) * 2 * Math.PI;
        let startAngle = -Math.PI / 2;

        if (incoming > 0) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, startAngle, startAngle + incomingAngle);
          ctx.arc(centerX, centerY, innerRadius, startAngle + incomingAngle, startAngle, true);
          ctx.closePath();
          ctx.fillStyle = '#2d805e';
          ctx.fill();
          startAngle += incomingAngle;
        }
        if (outgoing > 0) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, startAngle, startAngle + outgoingAngle);
          ctx.arc(centerX, centerY, innerRadius, startAngle + outgoingAngle, startAngle, true);
          ctx.closePath();
          ctx.fillStyle = '#e05355';
          ctx.fill();
        }

        ctx.fillStyle = isDark ? '#ffffff' : '#17201c';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 15px Georgia, serif';
        ctx.fillText(currency.format(total), centerX, centerY - 8);
        ctx.font = '10px sans-serif';
        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.6)' : '#555';
        ctx.fillText('Total Volume', centerX, centerY + 12);

        let currentStart = -Math.PI / 2;
        if (incoming > 0) {
          const midAngle = currentStart + incomingAngle / 2;
          const textX = centerX + ((radius + innerRadius) / 2) * Math.cos(midAngle);
          const textY = centerY + ((radius + innerRadius) / 2) * Math.sin(midAngle);
          if (incoming / total > 0.12) {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(Math.round((incoming / total) * 100) + '%', textX, textY);
          }
          currentStart += incomingAngle;
        }
        if (outgoing > 0) {
          const midAngle = currentStart + outgoingAngle / 2;
          const textX = centerX + ((radius + innerRadius) / 2) * Math.cos(midAngle);
          const textY = centerY + ((radius + innerRadius) / 2) * Math.sin(midAngle);
          if (outgoing / total > 0.12) {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(Math.round((outgoing / total) * 100) + '%', textX, textY);
          }
        }

        // ── Pie legend ──
        const legendY = height - 8;
        let legendX = width / 2 - 80;
        if (incoming > 0) {
          ctx.fillStyle = '#2d805e';
          ctx.fillRect(legendX, legendY - 7, 10, 10);
          ctx.fillStyle = isDark ? '#ccc' : '#333';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText('Inflow: ' + currency.format(incoming), legendX + 15, legendY);
          legendX += 110;
        }
        if (outgoing > 0) {
          ctx.fillStyle = '#e05355';
          ctx.fillRect(legendX, legendY - 7, 10, 10);
          ctx.fillStyle = isDark ? '#ccc' : '#333';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText('Outflow: ' + currency.format(outgoing), legendX + 15, legendY);
        }
      }
    } else {
      if (monthly.length) {
        const maximum = Math.max(1, ...monthly.flatMap(m => [Number(m.incoming || 0), Number(m.outgoing || 0)]));
        const paddingLeft = 55;
        const paddingRight = 20;
        const paddingTop = 20;
        const paddingBottom = 30;
        const chartWidth = width - paddingLeft - paddingRight;
        const chartHeight = height - paddingTop - paddingBottom;

        // Draw horizontal grid lines
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)';
        ctx.lineWidth = 1;
        for (let j = 0; j <= 3; j++) {
          const y = paddingTop + (chartHeight / 3) * j;
          ctx.beginPath();
          ctx.moveTo(paddingLeft, y);
          ctx.lineTo(width - paddingRight, y);
          ctx.stroke();
          
          // Y-axis value labels
          ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.4)' : '#888888';
          ctx.textAlign = 'right';
          ctx.font = '9px sans-serif';
          const val = Math.round(maximum - (maximum / 3) * j);
          ctx.fillText(currency.format(val), paddingLeft - 8, y + 3);
        }

        // Draw axes
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(paddingLeft, paddingTop);
        ctx.lineTo(paddingLeft, height - paddingBottom);
        ctx.lineTo(width - paddingRight, height - paddingBottom);
        ctx.stroke();

        const pointCount = monthly.length;
        const stepX = chartWidth / (pointCount - 1);

        // Gradients
        let inflowGrad = ctx.createLinearGradient(0, paddingTop, 0, height - paddingBottom);
        inflowGrad.addColorStop(0, 'rgba(45, 128, 94, 0.2)');
        inflowGrad.addColorStop(1, 'rgba(45, 128, 94, 0.0)');

        let outflowGrad = ctx.createLinearGradient(0, paddingTop, 0, height - paddingBottom);
        outflowGrad.addColorStop(0, 'rgba(224, 83, 85, 0.2)');
        outflowGrad.addColorStop(1, 'rgba(224, 83, 85, 0.0)');

        // Draw Inflow Area
        ctx.beginPath();
        monthly.forEach((m, i) => {
          const x = paddingLeft + i * stepX;
          const y = paddingTop + chartHeight - (Number(m.incoming || 0) / maximum) * chartHeight;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.lineTo(paddingLeft + (pointCount - 1) * stepX, height - paddingBottom);
        ctx.lineTo(paddingLeft, height - paddingBottom);
        ctx.closePath();
        ctx.fillStyle = inflowGrad;
        ctx.fill();

        // Draw Inflow Line
        ctx.beginPath();
        monthly.forEach((m, i) => {
          const x = paddingLeft + i * stepX;
          const y = paddingTop + chartHeight - (Number(m.incoming || 0) / maximum) * chartHeight;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#2d805e';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Draw Outflow Area
        ctx.beginPath();
        monthly.forEach((m, i) => {
          const x = paddingLeft + i * stepX;
          const y = paddingTop + chartHeight - (Number(m.outgoing || 0) / maximum) * chartHeight;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.lineTo(paddingLeft + (pointCount - 1) * stepX, height - paddingBottom);
        ctx.lineTo(paddingLeft, height - paddingBottom);
        ctx.closePath();
        ctx.fillStyle = outflowGrad;
        ctx.fill();

        // Draw Outflow Line
        ctx.beginPath();
        monthly.forEach((m, i) => {
          const x = paddingLeft + i * stepX;
          const y = paddingTop + chartHeight - (Number(m.outgoing || 0) / maximum) * chartHeight;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#e05355';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Draw points for inflow + value labels
        const labelThresholdBytes = currency.format(maximum).length * 5;
        monthly.forEach((m, i) => {
          const x = paddingLeft + i * stepX;
          const val = Number(m.incoming || 0);
          const y = paddingTop + chartHeight - (val / maximum) * chartHeight;
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          ctx.fillStyle = '#2d805e';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          if (val > 0) {
            ctx.fillStyle = isDark ? '#8fdaa0' : '#2d805e';
            ctx.textAlign = 'center';
            ctx.font = 'bold 8px sans-serif';
            ctx.fillText(currency.format(val), x, y - 9);
          }
        });

        // Draw points for outflow + value labels
        monthly.forEach((m, i) => {
          const x = paddingLeft + i * stepX;
          const val = Number(m.outgoing || 0);
          const y = paddingTop + chartHeight - (val / maximum) * chartHeight;
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          ctx.fillStyle = '#e05355';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          if (val > 0) {
            ctx.fillStyle = isDark ? '#f99' : '#e05355';
            ctx.textAlign = 'center';
            ctx.font = 'bold 8px sans-serif';
            ctx.fillText(currency.format(val), x, y + 14);
          }
        });

        // Month labels
        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.6)' : '#555';
        ctx.textAlign = 'center';
        ctx.font = '10px sans-serif';
        monthly.forEach((m, i) => {
          const x = paddingLeft + i * stepX;
          ctx.fillText(m.label || '', x, height - paddingBottom + 16);
        });

        // ── Line chart legend ──
        const lineLegendY = height - 2;
        let lineLegendX = width / 2 - 90;
        ctx.fillStyle = '#2d805e';
        ctx.fillRect(lineLegendX, lineLegendY - 7, 10, 10);
        ctx.fillStyle = isDark ? '#ccc' : '#333';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('Inflow', lineLegendX + 15, lineLegendY);
        lineLegendX += 75;
        ctx.fillStyle = '#e05355';
        ctx.fillRect(lineLegendX, lineLegendY - 7, 10, 10);
        ctx.fillStyle = isDark ? '#ccc' : '#333';
        ctx.fillText('Outflow', lineLegendX + 15, lineLegendY);
      } else {
        // Clear canvas if no data
        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.4)' : '#aaa';
        ctx.textAlign = 'center';
        ctx.font = '12px sans-serif';
        ctx.fillText('Your movement will appear here as wallet and project activity grows.', width / 2, height / 2);
      }
    }
  }
  // Update chart legend HTML with real values
  const legendEl = document.querySelector('.chart-legend');
  if (legendEl) {
    legendEl.innerHTML = '<i style="background:#2d805e;display:inline-block;width:10px;height:10px;border-radius:2px;margin:0 4px 0 0;vertical-align:middle"></i> Inflow ' + currency.format(incoming) + ' <i style="background:#e05355;display:inline-block;width:10px;height:10px;border-radius:2px;margin:0 4px 0 0;vertical-align:middle"></i> Outflow ' + currency.format(outgoing);
  }

  const health = incoming + outgoing ? Math.min(100, Math.round((incoming / (incoming + outgoing)) * 100)) : 0;
  selectors.financeRing.style.setProperty("--finance-progress", `${health}%`);
  selectors.financeRingValue.textContent = `${health}%`;
  selectors.financeSummaryCopy.textContent = health
    ? "Your inflow is being tracked alongside protected project commitments."
    : "Fund a project or add wallet credit to start building your financial history.";
}

function renderDashboard(payload) {
  selectors.dashboardFunds.textContent = currency.format(payload.stats.protectedFunds || 0);
  selectors.dashboardActive.textContent = payload.stats.activeOrders || 0;
  selectors.dashboardReview.textContent = payload.stats.pendingReview || 0;
  selectors.dashboardMessages.textContent = payload.stats.unreadMessages || 0;
  selectors.sellerTools.classList.toggle("hidden", payload.role !== "freelancer");
  selectors.dashboardSection.dataset.role = payload.role;

  const firstName = String(payload.user.name || "there").trim().split(/\s+/)[0];
  const isFreelancer = payload.role === "freelancer";
  selectors.dashboardRoleLabel.textContent = isFreelancer ? "Freelancer workspace" : "Client workspace";
  selectors.dashboardGreeting.textContent = `Welcome back, ${firstName}.`;
  selectors.dashboardSubcopy.textContent = payload.journey?.greeting || "Everything important is gathered here: your next move, active work, and protected payments.";
  const progress = Math.max(0, Math.min(100, payload.journey?.profileCompletion || 0));
  selectors.dashboardProgress.textContent = `${progress}%`;
  selectors.dashboardProgressBar.style.width = `${progress}%`;
  
  if (isFreelancer) {
    selectors.dashboardWidgets.innerHTML = `
      <div class="data-widget-card">
        <div class="widget-header"><span>Service Impressions</span><i data-lucide="eye"></i></div>
        <div class="widget-value">${payload.stats.serviceImpressions || 0}</div>
        <div class="widget-footer"><span class="badge">+12%</span> active listings</div>
      </div>
      <div class="data-widget-card">
        <div class="widget-header"><span>Response Rate</span><i data-lucide="zap"></i></div>
        <div class="widget-value">${payload.stats.responseRate || 100}%</div>
        <div class="widget-footer">Typically replies in < 1hr</div>
      </div>
      <div class="data-widget-card">
        <div class="widget-header"><span>Delivery Rate</span><i data-lucide="check-circle"></i></div>
        <div class="widget-value">${payload.stats.deliveryRate || 100}%</div>
        <div class="widget-footer">On time delivery score</div>
      </div>
    `;
  } else {
    selectors.dashboardWidgets.innerHTML = `
      <div class="data-widget-card">
        <div class="widget-header"><span>Total Spend</span><i data-lucide="wallet"></i></div>
        <div class="widget-value">${currency.format(payload.stats.earningsOrSpend || 0)}</div>
        <div class="widget-footer">Across ${payload.stats.totalOrders || 0} completed orders</div>
      </div>
      <div class="data-widget-card">
        <div class="widget-header"><span>Escrow Security</span><i data-lucide="shield-check"></i></div>
        <div class="widget-value">${payload.stats.securityIndex || 100}%</div>
        <div class="widget-footer"><span class="badge">SECURE</span> Full coverage on active funds</div>
      </div>
      <div class="data-widget-card">
        <div class="widget-header"><span>Avg Project Value</span><i data-lucide="trending-up"></i></div>
        <div class="widget-value">${currency.format(payload.stats.averageValue || 0)}</div>
        <div class="widget-footer">Based on order history</div>
      </div>
    `;
  }
  
  renderDashboardNextSteps(payload.journey?.nextSteps || []);

  if (!payload.orders.length) {
    selectors.orderList.innerHTML = `<div class="empty-state">No orders yet. ${payload.role === "client" ? "Pick a service above to start checkout." : "Publish a service to receive funded orders."}</div>`;
  } else {
    selectors.orderList.innerHTML = payload.orders.map((order) => renderOrder(order, payload.role)).join("");
    selectors.orderList.querySelectorAll("[data-order-action]").forEach((button) => {
      button.addEventListener("click", () => handleOrderAction(button.dataset.orderAction, button.dataset.orderId));
    });
  }

  if (payload.recentActivity && payload.recentActivity.length > 0) {
    selectors.dashboardActivityPanel.classList.remove("hidden");
    selectors.activityTimeline.innerHTML = payload.recentActivity.map(item => `
      <div class="activity-item">
        <h4>${escapeHtml(item.title)}</h4>
        <span>${new Date(item.date).toLocaleString()}</span>
      </div>
    `).join("");
  } else {
    selectors.dashboardActivityPanel.classList.add("hidden");
  }

  if (payload.emailLog && payload.emailLog.length > 0) {
    selectors.dashboardEmailPanel.classList.remove("hidden");
    selectors.emailLogList.innerHTML = payload.emailLog.map(item => `
      <div class="email-log-item">
        <div class="email-log-item-header">
          <span>To: ${escapeHtml(item.to)}</span>
          <span>${new Date(item.createdAt).toLocaleString()}</span>
        </div>
        <div class="email-log-item-subject">${escapeHtml(item.subject)}</div>
      </div>
    `).join("");
  } else {
    selectors.dashboardEmailPanel.classList.add("hidden");
  }
  
  if (selectors.floatingWalletBalance) {
    selectors.floatingWalletBalance.textContent = currency.format(payload.finance?.walletBalance || 0);
    selectors.floatingWallet.classList.remove("hidden");
  }
  refreshIcons();
}

function renderDashboardNextSteps(steps) {
  if (!steps.length) {
    selectors.dashboardNextSteps.innerHTML = `
      <div class="dashboard-complete">
        <span><i data-lucide="party-popper"></i></span>
        <div><strong>Your workspace is in a good place.</strong><p>Keep an eye on active work and messages as they arrive.</p></div>
      </div>
    `;
    refreshIcons();
    return;
  }

  selectors.dashboardNextSteps.innerHTML = steps
    .map((step, index) => `
      <button class="dashboard-next-item dashboard-next-item-${index + 1}" type="button" data-dashboard-action="${safeToken(step.id, "browse-services")}">
        <span class="dashboard-next-icon"><i data-lucide="${safeToken(step.icon, "sparkles")}"></i></span>
        <span><strong>${escapeHtml(step.title)}</strong><small>${escapeHtml(step.description)}</small></span>
        <i data-lucide="arrow-up-right"></i>
      </button>
    `)
    .join("");
  refreshIcons();
}

function handleDashboardAction(action) {
  if (action === "finish-client-onboarding" || action === "finish-freelancer-profile") {
    openOnboarding(state.user?.activeRole || "client");
    return;
  }
  if (action === "browse-services") {
    openAppPage("marketplace");
    return;
  }
  if (action === "publish-service") {
    selectors.sellerTools.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => selectors.serviceForm.elements.title.focus(), 400);
    return;
  }
  if (action === "setup-payouts") {
    connectPayouts();
    return;
  }
  if (action === "review-messages") {
    selectors.orderList.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function renderOrder(order, role) {
  const otherParty = role === "freelancer" ? order.client?.name : order.freelancer?.name;
  return `
    <article class="order-item">
      <div class="order-top">
        <h4>${escapeHtml(order.title)}</h4>
        <span class="status-pill status-${order.status}">${formatStatus(order.status)}</span>
      </div>
      <p class="order-meta">${currency.format(order.amount)} / ${escapeHtml(otherParty || "FreelanceHub user")} / due ${order.dueAt ? new Date(order.dueAt).toLocaleDateString() : "after funding"}</p>
      <div class="order-actions">
        ${renderOrderActions(order, role)}
      </div>
    </article>
  `;
}

function renderOrderActions(order, role) {
  const actions = [];
  if (role === "client") {
    if (["submitted", "disputed"].includes(order.status)) {
      actions.push(actionButton(order, "release", "Release funds", "primary"));
    }
    if (order.status === "submitted") {
      actions.push(actionButton(order, "revision", "Request revision"));
    }
    if (["funded", "in_progress", "submitted", "revision_requested"].includes(order.status)) {
      actions.push(actionButton(order, "dispute", "Open dispute", "danger"));
    }
  }
  if (role === "freelancer") {
    if (["funded", "in_progress", "revision_requested"].includes(order.status)) {
      actions.push(actionButton(order, "submit", "Submit work", "primary"));
    }
    if (["funded", "in_progress", "submitted", "revision_requested"].includes(order.status)) {
      actions.push(actionButton(order, "dispute", "Open dispute", "danger"));
    }
  }
  actions.push(actionButton(order, "message", "Message"));
  return actions.join("");
}

function actionButton(order, action, label, variant = "") {
  return `<button class="mini-button ${variant}" type="button" data-order-action="${action}" data-order-id="${order._id}">${label}</button>`;
}

async function handleOrderAction(action, orderId) {
  try {
    if (action === "release") {
      if (!window.confirm("Release protected funds to the freelancer?")) return;
      await api(`/orders/${orderId}/release`, { method: "POST" });
      showToast("Funds released.");
    }

    if (action === "submit") {
      const deliveryNotes = window.prompt("Add delivery notes or a delivery link:");
      if (!deliveryNotes) return;
      await api(`/orders/${orderId}/submit`, {
        method: "POST",
        body: JSON.stringify({ deliveryNotes }),
      });
      showToast("Work submitted.");
    }

    if (action === "revision") {
      const message = window.prompt("What needs to be revised?");
      if (!message) return;
      await api(`/orders/${orderId}/revision`, {
        method: "POST",
        body: JSON.stringify({ message }),
      });
      showToast("Revision requested.");
    }

    if (action === "dispute") {
      const reason = window.prompt("Describe the dispute reason:");
      if (!reason) return;
      await api(`/orders/${orderId}/dispute`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      });
      showToast("Dispute opened.");
    }

    if (action === "message") {
      const body = window.prompt("Message:");
      if (!body) return;
      await api(`/orders/${orderId}/messages`, {
        method: "POST",
        body: JSON.stringify({ body }),
      });
      showToast("Message sent.");
    }

    await loadDashboard();
  } catch (error) {
    showToast(error.message);
  }
}

async function submitServiceForm(event) {
  event.preventDefault();
  const formData = new FormData(selectors.serviceForm);
  const category = formData.get("category");
  const meta = categoryMeta[category] || categoryMeta.design;
  const tags = String(formData.get("tags") || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  try {
    await api("/services", {
      method: "POST",
      body: JSON.stringify({
        title: formData.get("title"),
        category,
        description: formData.get("description"),
        price: Number(formData.get("price")),
        deliveryDays: Number(formData.get("deliveryDays")),
        revisions: Number(formData.get("revisions")),
        tags,
        icon: meta.icon,
        coverTheme: meta.theme,
      }),
    });
    selectors.serviceForm.reset();
    showToast("Service published.");
    await Promise.all([loadServices(), loadDashboard()]);
  } catch (error) {
    showToast(error.message);
  }
}

async function connectPayouts() {
  showToast("Demo payouts are recorded when a client releases an order.");
}

function handleCheckoutReturn() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("checkout") === "success" || params.get("checkout") === "return") {
    showToast("Payment return received. The payment webhook will confirm the order shortly.");
    if (state.user) openDashboard();
  }
  if (params.get("checkout") === "cancelled") {
    showToast("Checkout cancelled. No payment was captured.");
  }
  if (params.has("connect")) {
    showToast("Payout status updated. Refreshing dashboard.");
    if (state.user) loadDashboard();
  }
}

function normalizeService(service) {
  const meta = categoryMeta[service.category] || categoryMeta.design;
  return {
    id: service._id || service.id,
    title: service.title,
    category: service.category,
    sellerName: service.seller?.name || service.sellerName || "FreelanceHub seller",
    level: "Marketplace seller",
    rating: Number(service.ratingAverage || service.rating || 0) || 5,
    reviews: Number(service.ratingCount || service.reviews || 0),
    price: Number(service.price || 0),
    deliveryDays: Number(service.deliveryDays || 1),
    icon: safeToken(service.icon || meta.icon, meta.icon),
    theme: safeToken(service.coverTheme || service.theme || meta.theme, meta.theme),
  };
}

function filterDemoServices() {
  const query = state.query.toLowerCase();
  return demoServices
    .filter((service) => {
      const categoryMatch = state.category === "all" || service.category === state.category;
      const searchText = `${service.title} ${service.sellerName} ${service.category}`.toLowerCase();
      const queryMatch = !query || query.split(/\s+/).every((token) => searchText.includes(token.replace(/s$/, "")));
      return categoryMatch && queryMatch;
    })
    .filter((service) => (state.sort === "budget" ? service.price < 100 : true))
    .sort((a, b) => {
      if (state.sort === "fast") return a.deliveryDays - b.deliveryDays;
      if (state.sort === "budget") return a.price - b.price;
      return b.rating - a.rating;
    });
}

function serviceStub(id, category, title, sellerName, price, deliveryDays, rating, reviews) {
  const meta = categoryMeta[category];
  return {
    id,
    category,
    title,
    sellerName,
    level: "Demo seller",
    price,
    deliveryDays,
    rating,
    reviews,
    icon: meta.icon,
    theme: meta.theme,
  };
}

function updateCategoryButtons() {
  selectors.categoryButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.category === state.category);
  });
}

function scrollCategories(direction) {
  const amount = Math.max(220, selectors.categoryRail.clientWidth * 0.55);
  selectors.categoryRail.scrollBy({ left: amount * direction, behavior: "smooth" });
}

function formatStatus(status) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getInitials(name) {
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeToken(value, fallback) {
  const token = String(value || "");
  return /^[a-z0-9-]+$/i.test(token) ? token : fallback;
}

function debounce(callback, wait) {
  let timer;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => callback(...args), wait);
  };
}

function showToast(message) {
  selectors.toast.textContent = message;
  selectors.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    selectors.toast.classList.remove("show");
  }, 3200);

  let type = "info";
  if (message.toLowerCase().includes("success") || message.toLowerCase().includes("added") || message.toLowerCase().includes("complete") || message.toLowerCase().includes("release") || message.toLowerCase().includes("publish") || message.toLowerCase().includes("sent")) {
    type = "success";
  } else if (message.toLowerCase().includes("fail") || message.toLowerCase().includes("error") || message.toLowerCase().includes("insufficient")) {
    type = "warning";
  }
  addNotification(type, message);
}

function addNotification(type, text) {
  const id = "notif_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  const icon = type === "success" ? "check-circle" : type === "warning" ? "alert-triangle" : "info";
  state.notifications.unshift({
    id,
    icon,
    type,
    text,
    time: new Date(),
    read: false
  });
  if (state.notifications.length > 30) state.notifications.pop();
  renderNotifications();
}

function renderNotifications() {
  const badge = selectors.notificationBadge;
  const list = selectors.notificationList;
  if (!badge || !list) return;

  const unreadCount = state.notifications.filter(n => !n.read).length;
  if (unreadCount > 0) {
    badge.textContent = unreadCount;
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }

  if (state.notifications.length === 0) {
    list.innerHTML = `<div class="notification-empty">No notifications yet</div>`;
    return;
  }

  list.innerHTML = state.notifications.map(n => `
    <div class="notification-item ${n.read ? 'read' : 'unread'}" data-notif-id="${n.id}">
      <span class="notification-item-icon ${n.type || 'info'}">
        <i data-lucide="${n.icon}"></i>
      </span>
      <div class="notification-item-content">
        <p>${escapeHtml(n.text)}</p>
        <small>${formatTime(n.time)}</small>
      </div>
    </div>
  `).join("");

  list.querySelectorAll(".notification-item").forEach(item => {
    item.addEventListener("click", () => {
      const id = item.dataset.notifId;
      const notif = state.notifications.find(n => n.id === id);
      if (notif) {
        notif.read = true;
        renderNotifications();
      }
    });
  });

  refreshIcons();
}

function formatTime(date) {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${mins}`;
}

function initNotificationToggle() {
  const btn = selectors.notificationButton;
  const panel = selectors.notificationPanel;
  if (!btn || !panel) return;

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = !panel.classList.contains("hidden");
    if (open) {
      panel.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
    } else {
      panel.classList.remove("hidden");
      btn.setAttribute("aria-expanded", "true");
      state.notifications.forEach(n => n.read = true);
      renderNotifications();
    }
  });

  const clearBtn = selectors.clearNotificationsButton;
  if (clearBtn) {
    clearBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      state.notifications = [];
      renderNotifications();
    });
  }

  document.addEventListener("click", (e) => {
    if (panel && !panel.classList.contains("hidden") && !selectors.notificationWrap.contains(e.target)) {
      panel.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
    }
  });
}

function initLogoNav() {
  const logo = document.querySelector(".brand");
  if (logo) {
    logo.addEventListener("click", (e) => {
      e.preventDefault();
      selectors.body.classList.remove("app-mode");
      selectors.appPages.forEach((item) => item.classList.remove("active"));
      selectors.appNavButtons.forEach((btn) => btn.classList.remove("active"));
      selectors.dashboardSection.classList.add("hidden");
      selectors.walletPage.classList.add("hidden");
      document.querySelector("#financePage")?.classList.add("hidden");
      selectors.gatewayPage?.classList.add("hidden");
      document.querySelector("#home")?.scrollIntoView({ behavior: "smooth" });
    });
  }
}

function initInteractiveCard() {
  const card = document.querySelector(".flip-card");
  if (!card) return;

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - (rect.width / 2);
    const y = e.clientY - rect.top - (rect.height / 2);
    const rotateX = -(y / (rect.height / 2)) * 12;
    const rotateY = (x / (rect.width / 2)) * 12;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg)";
  });

  const cardNoInput = document.querySelector("#gatewayCardNo");
  const cardNameInput = document.querySelector("#gatewayCardName");
  const cardExpiryInput = document.querySelector("#gatewayCardExpiry");
  const cardCvvInput = document.querySelector("#gatewayCardCvv");

  const previewNo = selectors.previewNumber;
  const previewHolder = selectors.previewHolder;
  const previewExp = selectors.previewExpiry;
  const previewCv = selectors.previewCvv;

  if (cardNoInput) {
    cardNoInput.addEventListener("input", (e) => {
      let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      let parts = [];
      for (let i = 0, len = val.length; i < len; i += 4) {
        parts.push(val.substring(i, i + 4));
      }
      e.target.value = parts.join(' ').substring(0, 19);
      if (previewNo) previewNo.textContent = e.target.value || "•••• •••• •••• ••••";
    });
  }

  if (cardNameInput) {
    cardNameInput.addEventListener("input", (e) => {
      if (previewHolder) previewHolder.textContent = e.target.value.toUpperCase() || "YOUR NAME";
    });
  }

  if (cardExpiryInput) {
    cardExpiryInput.addEventListener("input", (e) => {
      let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      if (val.length >= 2) {
        e.target.value = val.substring(0, 2) + '/' + val.substring(2, 4);
      } else {
        e.target.value = val;
      }
      if (previewExp) previewExp.textContent = e.target.value || "MM/YY";
    });
  }

  if (cardCvvInput) {
    cardCvvInput.addEventListener("input", (e) => {
      let val = e.target.value.replace(/[^0-9]/gi, '');
      e.target.value = val;
      if (previewCv) previewCv.textContent = "•".repeat(val.length) || "•••";
    });

    cardCvvInput.addEventListener("focus", () => {
      card.classList.add("flipped");
    });

    cardCvvInput.addEventListener("blur", () => {
      card.classList.remove("flipped");
    });
  }
}

function openGatewayPage(checkoutDetails) {
  openAppPage("gateway", { scroll: true, skipLoad: true });

  if (selectors.gatewayItemTitle) selectors.gatewayItemTitle.textContent = checkoutDetails.title;
  if (selectors.gatewayItemPrice) selectors.gatewayItemPrice.textContent = currency.format(checkoutDetails.amount);
  if (selectors.gatewayTotalAmount) selectors.gatewayTotalAmount.textContent = currency.format(checkoutDetails.total);

  selectors.gatewayCardPanel?.classList.remove("hidden");
  selectors.gatewayUpiPanel?.classList.add("hidden");
  selectors.gatewayProcessing?.classList.add("hidden");
  selectors.gatewayReceiptPanel?.classList.add("hidden");

  document.querySelectorAll(".gateway-tab").forEach(tab => tab.classList.remove("active"));
  const cardTab = document.querySelector("[data-gateway-tab='card']");
  if (cardTab) cardTab.classList.add("active");

  if (selectors.gatewayCardNo) selectors.gatewayCardNo.value = "";
  if (selectors.gatewayCardName) selectors.gatewayCardName.value = "";
  if (selectors.gatewayCardExpiry) selectors.gatewayCardExpiry.value = "";
  if (selectors.gatewayCardCvv) selectors.gatewayCardCvv.value = "";
  if (selectors.gatewayUpiVpa) selectors.gatewayUpiVpa.value = "";

  if (selectors.previewNumber) selectors.previewNumber.textContent = "•••• •••• •••• ••••";
  if (selectors.previewHolder) selectors.previewHolder.textContent = "YOUR NAME";
  if (selectors.previewExpiry) selectors.previewExpiry.textContent = "MM/YY";
  if (selectors.previewCvv) selectors.previewCvv.textContent = "•••";

  stopUpiTimer();

  const executePayment = async () => {
    const isCard = !selectors.gatewayCardPanel?.classList.contains("hidden");
    if (isCard) {
      if (!selectors.gatewayCardNo?.value || !selectors.gatewayCardName?.value || !selectors.gatewayCardExpiry?.value || !selectors.gatewayCardCvv?.value) {
        showToast("Please fill in all card details.");
        return;
      }
    } else {
      if (!selectors.gatewayUpiVpa?.value) {
        showToast("Please enter your UPI Virtual Private Address.");
        return;
      }
    }

    selectors.gatewayCardPanel?.classList.add("hidden");
    selectors.gatewayUpiPanel?.classList.add("hidden");
    selectors.gatewayProcessing?.classList.remove("hidden");

    const progress = selectors.gatewayProgressBarInner;
    if (progress) progress.style.width = "0%";

    const steps = [
      { width: "25%", text: "Validating payment credentials..." },
      { width: "55%", text: "Connecting to secure escrow vault..." },
      { width: "85%", text: "Capturing settlement ledger..." },
      { width: "100%", text: "Payment authorized successfully." }
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 600));
      if (progress) progress.style.width = step.width;
      if (selectors.gatewayProcessingText) selectors.gatewayProcessingText.textContent = step.text;
    }

    try {
      const payload = await checkoutDetails.checkoutAction();
      selectors.gatewayProcessing?.classList.add("hidden");
      selectors.gatewayReceiptPanel?.classList.remove("hidden");

      if (selectors.receiptDate) selectors.receiptDate.textContent = `Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
      if (selectors.receiptTxId) selectors.receiptTxId.textContent = payload.transactionId || `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`;
      if (selectors.receiptUser) selectors.receiptUser.textContent = state.user?.name || "Customer";
      if (selectors.receiptAmount) selectors.receiptAmount.textContent = currency.format(checkoutDetails.total);

      showToast("Transaction successfully completed.");

      if (selectors.receiptCloseButton) {
        selectors.receiptCloseButton.onclick = async () => {
          await Promise.all([loadWallet(), loadDashboard()]);
          openAppPage("overview");
        };
      }

      if (selectors.receiptPrintButton) {
        selectors.receiptPrintButton.onclick = () => {
          window.print();
        };
      }
    } catch (error) {
      showToast(error.message);
      selectors.gatewayProcessing?.classList.add("hidden");
      if (isCard) {
        selectors.gatewayCardPanel?.classList.remove("hidden");
      } else {
        selectors.gatewayUpiPanel?.classList.remove("hidden");
      }
    }
  };

  if (selectors.gatewayPayCardButton) selectors.gatewayPayCardButton.onclick = executePayment;
  if (selectors.gatewayPayUpiButton) selectors.gatewayPayUpiButton.onclick = executePayment;

  if (selectors.cancelGatewayButton) {
    selectors.cancelGatewayButton.onclick = () => {
      openAppPage("wallet");
      showToast("Payment cancelled.");
    };
  }

  document.querySelectorAll("[data-gateway-tab]").forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll(".gateway-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const target = tab.dataset.gatewayTab;
      if (target === "card") {
        selectors.gatewayCardPanel?.classList.remove("hidden");
        selectors.gatewayUpiPanel?.classList.add("hidden");
        stopUpiTimer();
      } else {
        selectors.gatewayCardPanel?.classList.add("hidden");
        selectors.gatewayUpiPanel?.classList.remove("hidden");
        startUpiTimer(executePayment);
      }
    };
  });
}

function startUpiTimer(onExpire) {
  stopUpiTimer();

  const qrSpinner = selectors.upiQrSpinner;
  if (qrSpinner) qrSpinner.classList.remove("hidden");

  state.upiTimer = setTimeout(() => {
    if (qrSpinner) qrSpinner.classList.add("hidden");
    showToast("QR Code scanned. Enter UPI PIN on your mobile device.");

    state.upiTimer = setTimeout(() => {
      onExpire();
    }, 3000);
  }, 4000);

  let seconds = 180;
  const timerLabel = selectors.upiTimerMinutes;

  const updateTimer = () => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (timerLabel) timerLabel.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    if (seconds > 0) {
      seconds--;
      state.upiCountdown = setTimeout(updateTimer, 1000);
    }
  };
  updateTimer();
}

function stopUpiTimer() {
  clearTimeout(state.upiTimer);
  clearTimeout(state.upiCountdown);
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

init();
