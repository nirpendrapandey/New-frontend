/* ===================================================
   SARKARINEXT AI — Premium UI (Orange/Dark Theme)
   Redesigned to match the SarkariNext homepage.
   No external CSS changes. All styles are inline.
=================================================== */

(function () {
  const AI_API = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:3000"
    : "https://api.nripendra.online";

  // Don't init on test pages
  if (window.location.pathname.includes("series.html")) return;

  // ---- CREATE FLOATING BUTTON (Matching Homepage Accents) ----
  const fab = document.createElement("button");
  fab.id = "sn-ai-fab";
  fab.innerHTML = `
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
       <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM5.93 6.07a1 1 0 0 1 1.41 0L8.76 7.5a1 1 0 0 1-1.42 1.41L5.93 7.48a1 1 0 0 1 0-1.41zm12.14 0a1 1 0 0 1 0 1.41l-1.42 1.42a1 1 0 0 1-1.41-1.42l1.41-1.41a1 1 0 0 1 1.42 0zM3 11a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2H4a1 1 0 0 1-1-1zm13 0a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zM6.63 15.37a1 1 0 0 1 1.42 0l1.41 1.41a1 1 0 1 1-1.41 1.42l-1.42-1.41a1 1 0 0 1 0-1.42zm10.74 0a1 1 0 0 1 0 1.42l-1.41 1.41a1 1 0 1 1-1.42-1.41l1.41-1.41a1 1 0 0 1 1.42 0zM12 18a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z"/>
    </svg>`;
  fab.title = "Ask SarkariNext AI";
  Object.assign(fab.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "60px",
    height: "60px",
    borderRadius: "20px",
    background: "#ff9900",
    color: "#111",
    border: "none",
    cursor: "pointer",
    zIndex: "9999",
    boxShadow: "0 8px 32px rgba(255,153,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  });

  fab.onmouseenter = () => { 
    fab.style.transform = "translateY(-5px) scale(1.05)"; 
    fab.style.boxShadow = "0 12px 40px rgba(255,153,0,0.5)"; 
  };
  fab.onmouseleave = () => { 
    fab.style.transform = "translateY(0) scale(1)"; 
    fab.style.boxShadow = "0 8px 32px rgba(255,153,0,0.3)"; 
  };

  // ---- CREATE CHAT PANEL ----
  const panel = document.createElement("div");
  panel.id = "sn-ai-panel";
  Object.assign(panel.style, {
    position: "fixed",
    bottom: "100px",
    right: "24px",
    width: "380px",
    maxWidth: "calc(100vw - 32px)",
    height: "520px",
    maxHeight: "75vh",
    background: "#fff",
    borderRadius: "24px",
    boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
    display: "none",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: "9999",
    fontFamily: "'Poppins', sans-serif",
    border: "1px solid rgba(0,0,0,0.05)",
  });

  // ---- HEADER (SarkariNext Topbar Style) ----
  const header = document.createElement("div");
  Object.assign(header.style, {
    padding: "16px 20px",
    background: "#131921",
    color: "#ff9900",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: "0",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  });
  header.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;">
      <div style="width:32px;height:32px;background:#ff9900;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#111;font-weight:900;">S</div>
      <div style="display:flex;flex-direction:column;">
        <span style="font-size:14px;font-weight:900;letter-spacing:0.5px;color:#ff9900;">SARKARINEXT <span style="color:white">AI</span></span>
        <span style="font-size:10px;font-weight:700;color:rgba(255,255,255,0.6);text-transform:uppercase;">Exam Assistant</span>
      </div>
    </div>
  `;
  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "✕";
  Object.assign(closeBtn.style, {
    background: "rgba(255,255,255,0.1)", border: "none", color: "white",
    fontSize: "14px", cursor: "pointer", width: "28px", height: "28px", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center", transition: "0.2s"
  });
  closeBtn.onmouseenter = () => { closeBtn.style.background = "rgba(255,255,255,0.2)"; };
  closeBtn.onmouseleave = () => { closeBtn.style.background = "rgba(255,255,255,0.1)"; };
  closeBtn.onclick = () => { panel.style.display = "none"; };
  header.appendChild(closeBtn);

  // ---- MESSAGES AREA ----
  const msgs = document.createElement("div");
  msgs.id = "sn-ai-msgs";
  Object.assign(msgs.style, {
    flex: "1",
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    background: "#f8f9fa",
  });

  // Welcome message (Card Style)
  const welcome = document.createElement("div");
  Object.assign(welcome.style, {
    background: "white",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: "16px",
    padding: "16px",
    fontSize: "13px",
    color: "#444",
    lineHeight: "1.7",
    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
  });
  welcome.innerHTML = `
    <strong style="color:#111;display:block;margin-bottom:6px;font-size:15px;">Namaste! 🎯</strong>
    Main SarkariNext AI hoon, aapka <strong>Government Exam Expert</strong>. SSC, Railway, aur NDA level ke sawaal puchhein, main short tricks ke sath samjhata hoon.
  `;
  msgs.appendChild(welcome);

  // ---- INPUT AREA (SarkariNext Search style) ----
  const inputArea = document.createElement("div");
  Object.assign(inputArea.style, {
    padding: "16px",
    background: "white",
    borderTop: "1px solid rgba(0,0,0,0.05)",
    display: "flex",
    gap: "10px",
    flexShrink: "0",
  });

  const inputWrap = document.createElement("div");
  Object.assign(inputWrap.style, {
    flex: "1",
    position: "relative",
    display: "flex",
    alignItems: "center"
  });

  const input = document.createElement("input");
  input.type = "text";
  input.id = "sn-ai-input";
  input.placeholder = "Sawal puchein...";
  Object.assign(input.style, {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "2px solid #eee",
    background: "#fdfdfd",
    color: "#333",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s",
    fontFamily: "inherit",
  });
  input.onfocus = () => { input.style.borderColor = "#ff9900"; input.style.background = "#fff"; };
  input.onblur = () => { input.style.borderColor = "#eee"; input.style.background = "#fdfdfd"; };

  const sendBtn = document.createElement("button");
  sendBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>`;
  Object.assign(sendBtn.style, {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    background: "#ff9900",
    color: "#111",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.2s",
    flexShrink: "0",
  });
  sendBtn.onmouseenter = () => { sendBtn.style.background = "#e68a00"; };
  sendBtn.onmouseleave = () => { sendBtn.style.background = "#ff9900"; };

  inputArea.appendChild(inputWrap);
  inputWrap.appendChild(input);
  inputArea.appendChild(sendBtn);

  // ---- ASSEMBLE ----
  panel.appendChild(header);
  panel.appendChild(msgs);
  panel.appendChild(inputArea);
  document.body.appendChild(panel);
  document.body.appendChild(fab);

  // ---- TOGGLE ----
  fab.onclick = () => {
    const isOpen = panel.style.display === "flex";
    panel.style.display = isOpen ? "none" : "flex";
    if (!isOpen) {
      input.focus();
      fab.style.transform = "rotate(90deg) scale(0.9)";
      fab.innerHTML = "✕";
    } else {
      fab.style.transform = "rotate(0) scale(1)";
      fab.innerHTML = `
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
           <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM5.93 6.07a1 1 0 0 1 1.41 0L8.76 7.5a1 1 0 0 1-1.42 1.41L5.93 7.48a1 1 0 0 1 0-1.41zm12.14 0a1 1 0 0 1 0 1.41l-1.42 1.42a1 1 0 0 1-1.41-1.42l1.41-1.41a1 1 0 0 1 1.42 0zM3 11a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2H4a1 1 0 0 1-1-1zm13 0a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zM6.63 15.37a1 1 0 0 1 1.42 0l1.41 1.41a1 1 0 1 1-1.41 1.42l-1.42-1.41a1 1 0 0 1 0-1.42zm10.74 0a1 1 0 0 1 0 1.42l-1.41 1.41a1 1 0 1 1-1.42-1.41l1.41-1.41a1 1 0 0 1 1.42 0zM12 18a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z"/>
        </svg>`;
    }
  };

  // ---- ADD MESSAGE BUBBLE ----
  function addMsg(text, isUser) {
    const bubble = document.createElement("div");
    Object.assign(bubble.style, {
      maxWidth: "85%",
      padding: "12px 16px",
      borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
      fontSize: "14px",
      lineHeight: "1.7",
      wordWrap: "break-word",
      whiteSpace: "pre-wrap",
      alignSelf: isUser ? "flex-end" : "flex-start",
      background: isUser ? "#131921" : "white",
      color: isUser ? "white" : "#333",
      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
      border: isUser ? "none" : "1px solid rgba(0,0,0,0.05)",
    });
    bubble.textContent = text;
    msgs.appendChild(bubble);
    msgs.scrollTop = msgs.scrollHeight;
    return bubble;
  }

  // ---- LOADING BUBBLE ----
  function addLoading() {
    const bubble = document.createElement("div");
    Object.assign(bubble.style, {
      padding: "12px 16px",
      borderRadius: "16px 16px 16px 4px",
      fontSize: "13px",
      background: "white",
      color: "#ff9900",
      fontWeight: "700",
      alignSelf: "flex-start",
      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    });
    bubble.innerHTML = "<span class='sn-loading-dots'>SarkariNext AI is thinking...</span>";
    bubble.id = "sn-ai-loading";
    msgs.appendChild(bubble);
    msgs.scrollTop = msgs.scrollHeight;
    return bubble;
  }

  // ---- SEND MESSAGE ----
  async function send() {
    const text = input.value.trim();
    if (!text) return;

    addMsg(text, true);
    input.value = "";
    input.disabled = true;
    sendBtn.disabled = true;
    sendBtn.style.opacity = "0.5";

    const loader = addLoading();

    try {
      const res = await fetch(AI_API + "/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      loader.remove();
      addMsg(data.reply || "No reply received.", false);
    } catch (err) {
      loader.remove();
      addMsg("❌ Connection lost. Please try again.", false);
    }

    input.disabled = false;
    sendBtn.disabled = false;
    sendBtn.style.opacity = "1";
    input.focus();
  }

  sendBtn.onclick = send;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
  });
})();
