const API_BASE = "https://api.nripendra.online";
const THEME_KEY = "sarkarinext_blog_theme";

const blogGrid = document.getElementById("blogGrid");
const moreGrid = document.getElementById("moreGrid");
const trendingList = document.getElementById("trendingList");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const themeToggle = document.getElementById("themeToggle");
const heroCount = document.getElementById("heroCount");

function safeHTML(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getDateText(value) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getCategoryText(value) {
  return value || "General";
}

function getThemePreference() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}

function setupThemeToggle() {
  if (!themeToggle) return;
  applyTheme(getThemePreference());
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(nextTheme);
  });
}

function setupMagneticHover() {
  const items = document.querySelectorAll(".magnetic");
  items.forEach((item) => {
    item.addEventListener("mousemove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate(${x * 0.06}px, ${y * 0.06}px)`;
    });
    item.addEventListener("mouseleave", () => {
      item.style.transform = "";
    });
  });
}

function setupRevealAnimations() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  items.forEach((item) => observer.observe(item));
}

function setLoadingCards(target, count = 6) {
  if (!target) return;
  target.innerHTML = Array.from({ length: count }, () => `
    <article class="card loadingCard">
      <div class="cardTop">
        <span class="tag">Loading</span>
        <span class="date">...</span>
      </div>
      <h2 class="title" style="background: rgba(255,255,255,0.05); height: 30px; border-radius: 4px; margin-top: 15px;"></h2>
      <p class="excerpt" style="background: rgba(255,255,255,0.03); height: 60px; border-radius: 4px; margin-top: 15px;"></p>
      <div class="cardBottom">
        <span class="read">Read Story &rarr;</span>
      </div>
    </article>
  `).join("");
}

function createCardMarkup(blog) {
  return `
    <div class="cardTop">
      <span class="tag">${safeHTML(getCategoryText(blog.category))}</span>
      <span class="date">${safeHTML(getDateText(blog.date))}</span>
    </div>

    <h2 class="title">${safeHTML(blog.title || "")}</h2>
    <p class="excerpt">${safeHTML(blog.excerpt || "")}</p>

    <div class="cardBottom">
      <a class="read" href="post.html?slug=${encodeURIComponent(blog.slug || "")}">Read Story &rarr;</a>
    </div>
  `;
}

function renderTrending(blogs) {
  if (!trendingList) return;

  const trending = [...blogs]
    .sort((a, b) => Number(b.views || 0) - Number(a.views || 0))
    .slice(0, 3);

  trendingList.innerHTML = trending.map((blog) => `
    <article class="card reveal">
      <div class="cardTop">
        <span class="tag">${safeHTML(getCategoryText(blog.category))}</span>
        <span class="date">${safeHTML(getDateText(blog.date))}</span>
      </div>
      <h3 style="font-size: 1.25rem; font-weight: 700; line-height:1.2; margin-top: 10px;">${safeHTML(blog.title || "")}</h3>
      <div class="cardBottom">
        <a class="read" href="post.html?slug=${encodeURIComponent(blog.slug || "")}">Read Story &rarr;</a>
      </div>
    </article>
  `).join("");
}


async function loadBlogList() {
  if (!blogGrid) return;

  setLoadingCards(blogGrid, 4);

  try {
    const res = await fetch(`${API_BASE}/api/blogs`);
    const data = await res.json();
    if (!data.ok) throw new Error(data.msg || "Failed to load blogs.");

    const blogs = data.blogs || [];
    if (heroCount) heroCount.innerText = `${blogs.length}+`;

    if (categorySelect) {
      const cats = ["all", ...new Set(blogs.map((blog) => getCategoryText(blog.category)))];
      categorySelect.innerHTML = "";
      cats.forEach((cat) => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.innerText = cat === "all" ? "All Categories" : cat;
        categorySelect.appendChild(opt);
      });
    }

    renderTrending(blogs);

    function render() {
      const q = (searchInput?.value || "").toLowerCase().trim();
      const selected = categorySelect?.value || "all";

      const filtered = blogs.filter((blog) => {
        const title = (blog.title || "").toLowerCase();
        const excerpt = (blog.excerpt || "").toLowerCase();
        const category = getCategoryText(blog.category);
        return (title.includes(q) || excerpt.includes(q)) && (selected === "all" || category === selected);
      });

      blogGrid.innerHTML = "";

      if (!filtered.length) {
        blogGrid.innerHTML = '<div class="empty">No blogs found for this search.</div>';
        return;
      }

      filtered.forEach((blog) => {
        const card = document.createElement("article");
        card.className = "card reveal";
        card.innerHTML = createCardMarkup(blog);
        blogGrid.appendChild(card);
      });

      setupRevealAnimations();
      setupMagneticHover();
    }

    searchInput?.addEventListener("input", render);
    categorySelect?.addEventListener("change", render);
    render();
    setupRevealAnimations();
    setupMagneticHover();
  } catch (error) {
    blogGrid.innerHTML = `<div class="empty">Blog load error: ${safeHTML(error.message)}</div>`;
  }
}

async function loadSinglePost() {
  const postEl = document.getElementById("post");
  if (!postEl) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    postEl.innerHTML = "<h1>Blog Not Found</h1><p>Slug missing.</p>";
    return;
  }

  postEl.innerHTML = '<div class="empty">Loading post...</div>';

  try {
    const res = await fetch(`${API_BASE}/api/blogs/${encodeURIComponent(slug)}`);
    const data = await res.json();
    if (!data.ok) throw new Error(data.msg || "Blog not found.");

    const post = data.blog || {};
    document.title = `${post.title || "Blog"} - SarkariNext`;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", post.excerpt || "SarkariNext Blog");

    postEl.innerHTML = `
      <div class="postHead">
        <span class="tag">${safeHTML(getCategoryText(post.category))}</span>
        <span class="date">${safeHTML(getDateText(post.date))}</span>
        <span class="views" id="viewsBox">Views: ...</span>
      </div>

      <h1>${safeHTML(post.title || "")}</h1>
      <p class="excerpt">${safeHTML(post.excerpt || "")}</p>

      <div class="content">
        ${post.content || ""}
      </div>
    `;

    await countView(slug);
    await loadMorePosts(slug);
    setupRevealAnimations();
    setupMagneticHover();
  } catch (error) {
    postEl.innerHTML = `<h1>Blog Not Found</h1><p>${safeHTML(error.message)}</p>`;
  }
}

async function countView(slug) {
  const viewsBox = document.getElementById("viewsBox");
  if (!viewsBox) return;

  try {
    const key = `viewed_${slug}`;
    const last = localStorage.getItem(key);

    if (last && Date.now() - Number(last) < 30 * 60 * 1000) {
      const res = await fetch(`${API_BASE}/api/blogs/${encodeURIComponent(slug)}`);
      const data = await res.json();
      viewsBox.innerHTML = data.ok ? `Views: <b>${Number(data.blog.views || 0)}</b>` : "Views: <b>0</b>";
      return;
    }

    localStorage.setItem(key, Date.now());
    const res = await fetch(`${API_BASE}/api/blogs/${encodeURIComponent(slug)}/view`, { method: "POST" });
    const data = await res.json();
    viewsBox.innerHTML = data.ok ? `Views: <b>${Number(data.views || 0)}</b>` : "Views: <b>0</b>";
  } catch {
    viewsBox.innerHTML = "Views: <b>0</b>";
  }
}

async function loadMorePosts(currentSlug) {
  if (!moreGrid) return;

  moreGrid.innerHTML = `
    <article class="miniCard loadingCard"></article>
    <article class="miniCard loadingCard"></article>
    <article class="miniCard loadingCard"></article>
  `;

  try {
    const res = await fetch(`${API_BASE}/api/blogs`);
    const data = await res.json();
    if (!data.ok) return;

    const blogs = (data.blogs || [])
      .filter((blog) => blog.slug !== currentSlug)
      .sort((a, b) => Number(b.views || 0) - Number(a.views || 0))
      .slice(0, 4);

    if (!blogs.length) {
      moreGrid.innerHTML = '<div class="empty">No more blogs available.</div>';
      return;
    }

    moreGrid.innerHTML = blogs.map((blog) => `
      <article class="miniCard reveal">
        <div class="miniTop">
          <span class="tag">${safeHTML(getCategoryText(blog.category))}</span>
          <span class="date">${safeHTML(getDateText(blog.date))}</span>
        </div>
        <h3>${safeHTML(blog.title || "")}</h3>
        <div class="miniMeta">${safeHTML(blog.excerpt || "")}</div>
        <a class="miniRead magnetic" href="post.html?slug=${encodeURIComponent(blog.slug || "")}">Read story &rarr;</a>
      </article>
    `).join("");

    setupRevealAnimations();
    setupMagneticHover();
  } catch {
    moreGrid.innerHTML = '<div class="empty">Unable to load more blogs.</div>';
  }
}

setupThemeToggle();
loadBlogList();
loadSinglePost();
setupRevealAnimations();
setupMagneticHover();
