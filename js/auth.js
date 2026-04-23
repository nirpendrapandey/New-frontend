/* ===================================================
   SARKARINEXT - AUTH MODULE
   Login / Signup / Logout / Session Management
=================================================== */

const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:3000"
  : "https://api.nripendra.online";

const SarkariAuth = {
  // Get stored token
  getToken() {
    return localStorage.getItem("sn_token");
  },

  // Get stored user
  getUser() {
    try {
      return JSON.parse(localStorage.getItem("sn_user"));
    } catch {
      return null;
    }
  },

  // Check if logged in
  isLoggedIn() {
    return !!this.getToken();
  },

  // Save session
  saveSession(token, user) {
    localStorage.setItem("sn_token", token);
    localStorage.setItem("sn_user", JSON.stringify(user));
  },

  // Clear session
  clearSession() {
    localStorage.removeItem("sn_token");
    localStorage.removeItem("sn_user");
  },

  // Auth header
  authHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Register
  async register(name, email, password, phone) {
    try {
      const res = await fetch(API_BASE + "/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await res.json();

      if (res.ok && data.token) {
        this.saveSession(data.token, data.user);
        return { ok: true, user: data.user };
      }
      return { ok: false, message: data.message || "Registration failed" };
    } catch (err) {
      return { ok: false, message: "Network error. Try again." };
    }
  },

  // Login
  async login(email, password) {
    try {
      const res = await fetch(API_BASE + "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.token) {
        this.saveSession(data.token, data.user);
        return { ok: true, user: data.user };
      }
      return { ok: false, message: data.message || "Login failed" };
    } catch (err) {
      return { ok: false, message: "Network error. Try again." };
    }
  },

  // Logout
  logout() {
    this.clearSession();
    if (typeof openPage === "function") openPage("home");
    updateAuthUI();
  },
};

/* ===================================================
   AUTH UI HANDLERS
=================================================== */

function updateAuthUI() {
  const authBtnsTop = document.getElementById("authButtonsTopbar");
  if (!authBtnsTop) return;

  if (SarkariAuth.isLoggedIn()) {
    const user = SarkariAuth.getUser();
    const initials = (user?.name || "U").charAt(0).toUpperCase();
    authBtnsTop.innerHTML = `
      <button class="auth-avatar-btn" onclick="openPage('dashboardPage')" title="My Dashboard">
        <span class="auth-avatar">${initials}</span>
        <span class="auth-name-text">${user?.name?.split(" ")[0] || "Dashboard"}</span>
      </button>
      <button class="auth-logout-btn" onclick="SarkariAuth.logout()" title="Logout">✕</button>
    `;
  } else {
    authBtnsTop.innerHTML = `
      <button class="auth-login-topbar" onclick="openPage('authPage')">Login</button>
    `;
  }
}

function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const phone = document.getElementById("signupPhone")?.value.trim() || "";
  const msgEl = document.getElementById("signupMsg");

  if (!name || !email || !password) {
    msgEl.textContent = "All fields are required";
    msgEl.className = "auth-msg error";
    return;
  }
  if (password.length < 6) {
    msgEl.textContent = "Password must be at least 6 characters";
    msgEl.className = "auth-msg error";
    return;
  }

  msgEl.textContent = "Creating account...";
  msgEl.className = "auth-msg";

  SarkariAuth.register(name, email, password, phone).then((res) => {
    if (res.ok) {
      msgEl.textContent = "Account created! Redirecting...";
      msgEl.className = "auth-msg success";
      updateAuthUI();
      setTimeout(() => openPage("dashboardPage"), 800);
    } else {
      msgEl.textContent = res.message;
      msgEl.className = "auth-msg error";
    }
  });
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const msgEl = document.getElementById("loginMsg");

  if (!email || !password) {
    msgEl.textContent = "Email and password required";
    msgEl.className = "auth-msg error";
    return;
  }

  msgEl.textContent = "Logging in...";
  msgEl.className = "auth-msg";

  SarkariAuth.login(email, password).then((res) => {
    if (res.ok) {
      msgEl.textContent = "Success! Redirecting...";
      msgEl.className = "auth-msg success";
      updateAuthUI();
      setTimeout(() => openPage("dashboardPage"), 800);
    } else {
      msgEl.textContent = res.message;
      msgEl.className = "auth-msg error";
    }
  });
}

function showAuthTab(tab) {
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");
  const loginForm = document.getElementById("loginFormBox");
  const signupForm = document.getElementById("signupFormBox");

  if (tab === "login") {
    loginTab?.classList.add("active");
    signupTab?.classList.remove("active");
    loginForm?.classList.remove("hide");
    signupForm?.classList.add("hide");
  } else {
    loginTab?.classList.remove("active");
    signupTab?.classList.add("active");
    loginForm?.classList.add("hide");
    signupForm?.classList.remove("hide");
  }
}

// Initialize auth UI on page load
document.addEventListener("DOMContentLoaded", () => {
  updateAuthUI();
});
