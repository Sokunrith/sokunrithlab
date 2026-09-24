/* Sokunrith Lab — renders everything from data.js. You normally never need to edit this file. */
(function () {
  "use strict";
  const D = window.LAB_DATA || {};
  const P = D.profile || {};
  const $ = (s) => document.querySelector(s);
  const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const slug = (v) => String(v || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const safeUrl = (u) => (/^(https?:|mailto:)/i.test(String(u || "").trim()) ? String(u).trim() : "");
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const parseDate = (d) => { const t = new Date(String(d) + "T00:00:00"); return isNaN(t) ? null : t; };
  const fmtDate = (d, opts) => { const t = parseDate(d); return t ? t.toLocaleDateString("en-GB", opts || { day: "numeric", month: "short", year: "numeric" }) : esc(d); };
  const initials = (name) => String(name || "").replace(/,.*$/, "").split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const empty = (msg) => `<p class="empty">${esc(msg)}</p>`;

  /* Simple text bindings */
  document.querySelectorAll("[data-bind]").forEach((el) => { const k = el.getAttribute("data-bind"); if (P[k]) el.textContent = P[k]; });
  $("#year").textContent = today.getFullYear();
  if (P.labName) document.title = P.labName + " | Inclusive Education and Well-Being, Hiroshima University";

  /* Hero weave: horizontal and vertical threads that interlace in a checkerboard */
  (function weave() {
    const host = $("#weave"); if (!host) return;
    const colors = ["var(--teal)", "var(--saffron)", "var(--ink)", "var(--sky)", "var(--plum)"];
    const n = 7, size = 400, gap = size / n, w = gap * 0.62, off = (gap - w) / 2;
    let h = "", v = "", over = "";
    for (let i = 0; i < n; i++) {
      const pos = i * gap + off;
      h += `<rect class="thread h" x="0" y="${pos}" width="${size}" height="${w}" rx="3" fill="${colors[i % 5]}" stroke="var(--paper)" stroke-width="3" style="animation-delay:${i * 70}ms"/>`;
      v += `<rect class="thread v" x="${pos}" y="0" width="${w}" height="${size}" rx="3" fill="${colors[(i + 2) % 5]}" stroke="var(--paper)" stroke-width="3" style="animation-delay:${250 + i * 70}ms"/>`;
    }
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      if ((r + c) % 2 === 0) continue; // horizontal thread on top here
      const x = c * gap + off, y = r * gap + off - 2, d = 900 + (r + c) * 25;
      over += `<g class="over" style="animation-delay:${d}ms"><rect x="${x}" y="${y}" width="${w}" height="${w + 4}" fill="${colors[(c + 2) % 5]}"/>` +
        `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + w + 4}" stroke="var(--paper)" stroke-width="3"/><line x1="${x + w}" y1="${y}" x2="${x + w}" y2="${y + w + 4}" stroke="var(--paper)" stroke-width="3"/></g>`;
    }
    // Vertical threads sit under horizontals except where "over" patches restore them.
    host.innerHTML = `<svg viewBox="-2 -2 ${size + 4} ${size + 4}" aria-hidden="true"><g>${v}</g><g>${h}</g><g>${over}</g></svg>`;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) host.classList.add("animate");
  })();

  /* About */
  $("#about-text").innerHTML = String(P.about || "").split(/\n\s*\n/).filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join("");
  $("#profile-links").innerHTML = (D.links || []).filter((l) => safeUrl(l.url)).map((l) => `<li><a href="${esc(safeUrl(l.url))}" target="_blank" rel="noopener">${esc(l.label)}</a></li>`).join("");
  $("#portrait").innerHTML = P.photo ? `<img class="portrait" src="${esc(P.photo)}" alt="Portrait of ${esc(P.piName)}">` : `<div class="monogram" aria-hidden="true">${esc(initials(P.piName))}</div>`;

  /* Research themes */
  const themeColors = ["var(--teal)", "var(--saffron)", "var(--sky)", "var(--plum)", "var(--ink)"];
  $("#themes").innerHTML = (D.themes || []).map((t, i) => `<div class="theme" style="--c:${themeColors[i % 5]}"><h3>${esc(t.title)}</h3><p>${esc(t.description)}</p></div>`).join("") || empty("Research themes will appear here.");

  /* Projects with status filter */
  (function projects() {
    const list = D.projects || [];
    const statuses = ["All", ...Array.from(new Set(list.map((p) => p.status).filter(Boolean)))];
    let current = "All";
    const bar = $("#project-filters");
    const draw = () => {
      bar.innerHTML = statuses.length > 2 ? statuses.map((s) => `<button class="chip" aria-pressed="${s === current}" data-v="${esc(s)}">${esc(s)}</button>`).join("") : "";
      const items = list.filter((p) => current === "All" || p.status === current);
      $("#project-list").innerHTML = items.map((p) => {
        const meta = [p.period, p.role, p.funder ? "Funded by " + p.funder : "", p.partners ? "With " + p.partners : ""].filter(Boolean).map((m) => `<span>${esc(m)}</span>`).join("");
        const link = safeUrl(p.url) ? `<p><a href="${esc(safeUrl(p.url))}" target="_blank" rel="noopener">Project page</a></p>` : "";
        return `<article class="project">${p.status ? `<span class="status ${slug(p.status)}">${esc(p.status)}</span>` : ""}<h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p><div class="meta">${meta}</div>${link}</article>`;
      }).join("") || empty("No projects in this category yet.");
    };
    bar.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { current = b.dataset.v; draw(); } });
    draw();
  })();

  /* Publications with type/status filter, search and APA copy */
  (function publications() {
    const list = (D.publications || []).slice().sort((a, b) => (Number(b.year) || 9999) - (Number(a.year) || 9999));
    const isForthcoming = (p) => p.status && p.status !== "Published";
    const filters = ["All", "Selected"];
    Array.from(new Set(list.map((p) => p.type).filter(Boolean))).forEach((t) => filters.push(t));
    if (list.some(isForthcoming)) filters.push("Forthcoming");
    let current = "All", query = "";
    const apa = (p) => {
      let s = `${p.authors || ""} (${p.status && p.status !== "Published" ? p.status.toLowerCase() : p.year}). ${p.title}. ${p.venue}`;
      if (p.volume) s += `, ${p.volume}`;
      if (p.pages) s += `, ${p.pages}`;
      s += ".";
      if (p.doi) s += ` https://doi.org/${p.doi}`;
      return s.replace(/\.\./g, ".");
    };
    const render = () => {
      $("#pub-filters").innerHTML = filters.map((f) => `<button class="chip" aria-pressed="${f === current}" data-v="${esc(f)}">${esc(f)}</button>`).join("");
      const q = query.toLowerCase();
      const items = list.filter((p) => {
        if (current === "Selected" && !p.featured) return false;
        if (current === "Forthcoming" && !isForthcoming(p)) return false;
        if (!["All", "Selected", "Forthcoming"].includes(current) && p.type !== current) return false;
        return !q || [p.title, p.authors, p.venue, p.year].join(" ").toLowerCase().includes(q);
      });
      $("#pub-count").textContent = `${items.length} ${items.length === 1 ? "entry" : "entries"}`;
      const groups = {};
      items.forEach((p) => { const k = isForthcoming(p) ? "Forthcoming" : String(p.year || "Undated"); (groups[k] = groups[k] || []).push(p); });
      const order = Object.keys(groups).sort((a, b) => (a === "Forthcoming" ? -1 : b === "Forthcoming" ? 1 : Number(b) - Number(a)));
      $("#pub-list").innerHTML = order.map((k) => `<div class="year-group"><h3>${esc(k)}</h3>${groups[k].map((p) => {
        const idx = list.indexOf(p);
        const href = p.doi ? "https://doi.org/" + p.doi : safeUrl(p.url);
        const details = [p.volume, p.pages].filter(Boolean).join(", ");
        return `<article class="pub${p.featured ? " featured" : ""}">
          <p class="pub-title">${href ? `<a href="${esc(href)}" target="_blank" rel="noopener">${esc(p.title)}</a>` : esc(p.title)}</p>
          <p class="pub-cite">${esc(p.authors)} <em>${esc(p.venue)}</em>${details ? ", " + esc(details) : ""}${p.year ? " (" + esc(p.year) + ")" : ""}</p>
          <div class="pub-actions">${isForthcoming(p) ? `<span class="status ${slug(p.status)}">${esc(p.status)}</span>` : ""}<span>${esc(p.type || "")}</span>
          ${p.doi ? `<a href="https://doi.org/${esc(p.doi)}" target="_blank" rel="noopener">DOI</a>` : ""}
          <button class="linklike" data-cite="${idx}">Copy citation</button></div>
        </article>`;
      }).join("")}</div>`).join("") || empty("No publications match. Try another filter or search term.");
    };
    $("#pub-filters").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { current = b.dataset.v; render(); } });
    $("#pub-search").addEventListener("input", (e) => { query = e.target.value; render(); });
    $("#pub-list").addEventListener("click", (e) => {
      const b = e.target.closest("[data-cite]"); if (!b) return;
      const text = apa(list[Number(b.dataset.cite)]);
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(() => toast("Citation copied"), () => { window.prompt("Copy this citation:", text); });
    });
    render();
  })();

  /* Conferences: split into upcoming and past automatically by date */
  (function talks() {
    const list = (D.conferences || []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
    const upcoming = list.filter((t) => { const d = parseDate(t.date); return d && d >= today; }).reverse();
    const past = list.filter((t) => !upcoming.includes(t));
    const row = (t) => `<article class="talk"><time datetime="${esc(t.date)}">${fmtDate(t.date)}</time><div>
      <h4>${safeUrl(t.url) ? `<a href="${esc(safeUrl(t.url))}" target="_blank" rel="noopener">${esc(t.title)}</a>` : esc(t.title)}</h4>
      <p>${[t.type, t.authors].filter(Boolean).map(esc).join(". ")}${t.type || t.authors ? ". " : ""}${esc(t.event)}${t.location ? ", " + esc(t.location) : ""}.</p></div></article>`;
    let html = "";
    if (upcoming.length) html += `<div class="talk-group"><h3>Upcoming</h3>${upcoming.map(row).join("")}</div>`;
    if (past.length) html += `<div class="talk-group"><h3>Past</h3>${past.map(row).join("")}</div>`;
    $("#talk-list").innerHTML = html || empty("Conference presentations will appear here.");
  })();

  /* Teaching */
  $("#teaching-list").innerHTML = (D.teaching || []).map((c) => `<li><h3>${safeUrl(c.url) ? `<a href="${esc(safeUrl(c.url))}" target="_blank" rel="noopener">${esc(c.title)}</a>` : esc(c.title)}</h3>
    <div class="meta">${[c.level, [c.term, c.year].filter(Boolean).join(", ")].filter(Boolean).map((m) => `<span>${esc(m)}</span>`).join("")}</div>
    ${c.description ? `<p>${esc(c.description)}</p>` : ""}</li>`).join("") || `<li>${empty("Courses will appear here.")}</li>`;

  /* News, newest first; future-dated items show as upcoming */
  $("#news-list").innerHTML = (D.news || []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date))).map((n) => {
    const d = parseDate(n.date); const soon = d && d > today;
    return `<li class="news-item"><time datetime="${esc(n.date)}">${fmtDate(n.date)}${soon ? `<br><span class="status upcoming">Upcoming</span>` : ""}</time>
      <div><h3>${safeUrl(n.link) ? `<a href="${esc(safeUrl(n.link))}" target="_blank" rel="noopener">${esc(n.title)}</a>` : esc(n.title)}</h3>${n.body ? `<p>${esc(n.body)}</p>` : ""}</div></li>`;
  }).join("") || `<li>${empty("News will appear here.")}</li>`;

  /* People */
  $("#member-list").innerHTML = (D.members || []).map((m) => `<div class="member">
    ${m.photo ? `<img src="${esc(m.photo)}" alt="">` : `<span class="dot" aria-hidden="true">${esc(initials(m.name))}</span>`}
    <div><h3>${safeUrl(m.link) ? `<a href="${esc(safeUrl(m.link))}" target="_blank" rel="noopener">${esc(m.name)}</a>` : esc(m.name)}</h3>
    <p class="role">${esc(m.role)}</p><p>${esc(m.bio)}</p>${m.email ? `<p><a href="mailto:${esc(m.email)}">${esc(m.email)}</a></p>` : ""}</div></div>`).join("");
  $("#join-text").textContent = (D.join && D.join.text) || "";
  const mail = P.email ? "mailto:" + P.email : "#contact";
  $("#join-mail").href = mail + (P.email ? "?subject=" + encodeURIComponent("Joining " + (P.labName || "the lab")) : "");
  $("#contact-email").href = mail; $("#contact-email").textContent = P.email || "";

  /* Mobile navigation and current-section highlight */
  const toggle = $(".nav-toggle"), nav = $("#site-nav");
  toggle.addEventListener("click", () => { const open = nav.classList.toggle("open"); toggle.setAttribute("aria-expanded", open); });
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); } });
  if ("IntersectionObserver" in window) {
    const links = Array.from(nav.querySelectorAll("a"));
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => a.setAttribute("aria-current", a.getAttribute("href") === "#" + en.target.id ? "true" : "false"));
    }), { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach((s) => io.observe(s));
  }

  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 1800); }
})();
