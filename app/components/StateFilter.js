"use client";

import { useEffect } from "react";

// Simple Levenshtein distance for fuzzy matching
function levenshtein(a, b) {
  const m = [];
  let i, j;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  for (i = 0; i <= b.length; i++) m[i] = [i];
  for (j = 0; j <= a.length; j++) m[0][j] = j;

  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      m[i][j] =
        b[i - 1] === a[j - 1]
          ? m[i - 1][j - 1]
          : Math.min(
              m[i - 1][j - 1] + 1,
              m[i][j - 1] + 1,
              m[i - 1][j] + 1
            );
    }
  }
  return m[b.length][a.length];
}

function normalize(str) {
  return str.toLowerCase().trim();
}

function fuzzyMatch(text, query) {
  const t = normalize(text);
  const q = normalize(query);
  if (!q) return true;
  if (t.startsWith(q)) return true;
  if (t.includes(q)) return true;
  return levenshtein(t, q) <= 2;
}

// Popularity scores — pretend ML/analytics powered
const POPULARITY = {
  california: 98,
  texas: 96,
  florida: 92,
  "new york": 90,
  georgia: 84,
};

// Region “intelligence” keywords
const REGION_KEYWORDS = {
  "west coast": ["california", "oregon", "washington"],
  "east coast": ["maine", "new york", "new jersey", "virginia", "florida"],
  "deep south": ["alabama", "georgia", "mississippi", "louisiana"],
  midwest: [
    "illinois",
    "indiana",
    "iowa",
    "kansas",
    "michigan",
    "minnesota",
    "missouri",
    "nebraska",
    "north dakota",
    "south dakota",
    "ohio",
    "wisconsin",
  ],
};

export default function StateFilter() {
  useEffect(() => {
    const searchInput = document.getElementById("stateSearch");
    const alphaButtons = Array.from(
      document.querySelectorAll(".alpha-btn")
    );
    const cards = Array.from(
      document.querySelectorAll(".state-pro-card")
    );
    const links = Array.from(
      document.querySelectorAll(".state-pro-card li a")
    );
    const emptyMessage = document.getElementById("state-empty-message");
    const suggestionsBox = document.getElementById("state-suggestions");
    const recentRow = document.getElementById("state-recent-row");

    if (!searchInput || !cards.length) return;

    /* -------------------------------
       RECENT STATE MEMORY (localStorage)
    --------------------------------*/
    function loadRecentStates() {
      try {
        const raw = localStorage.getItem("recentStates");
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    function saveRecentStates(list) {
      localStorage.setItem("recentStates", JSON.stringify(list.slice(0, 6)));
    }

    function renderRecentRow() {
      if (!recentRow) return;
      const recent = loadRecentStates();
      if (!recent.length) {
        recentRow.style.display = "none";
        recentRow.innerHTML = "";
        return;
      }

      recentRow.style.display = "flex";
      recentRow.innerHTML = `
        <span class="state-recent-label">Recently viewed:</span>
        ${recent
          .map(
            (s) =>
              `<button class="state-pill" data-state="${s}">${s}</button>`
          )
          .join("")}
      `;
    }

    function onStateClick(e) {
      const state = e.currentTarget.textContent.trim();
      let history = loadRecentStates();
      history = [state, ...history.filter((s) => s !== state)];
      saveRecentStates(history);
      renderRecentRow();
    }

    links.forEach((a) => {
      a.addEventListener("click", onStateClick);
    });

    renderRecentRow();

    /* -------------------------------
       UI RESET
    --------------------------------*/
    function resetUI() {
      cards.forEach((card) => {
        card.style.display = "block";
        card.classList.remove("collapsed");
        const lis = card.querySelectorAll("li");
        lis.forEach((li) => {
          li.style.display = "list-item";
          li.classList.remove("highlight");
        });
      });
      if (emptyMessage) emptyMessage.style.display = "none";
      if (suggestionsBox) suggestionsBox.innerHTML = "";
    }

    /* -------------------------------
       REGION HIGHLIGHT
    --------------------------------*/
    function highlightRegion(stateNames) {
      const matchSet = stateNames.map((s) => normalize(s));
      cards.forEach((card) => {
        let regionMatches = 0;
        const lis = card.querySelectorAll("li");
        lis.forEach((li) => {
          const label = normalize(li.textContent || "");
          const isMatch = matchSet.includes(label);
          li.style.display = isMatch ? "list-item" : "none";
          li.classList.toggle("highlight", isMatch);
          if (isMatch) regionMatches++;
        });
        card.style.display = regionMatches ? "block" : "none";
        card.classList.toggle("collapsed", regionMatches === 0);
      });
      if (emptyMessage) emptyMessage.style.display = "none";
    }

    /* -------------------------------
       SUGGESTION DROPDOWN
    --------------------------------*/
    function renderSuggestions(query) {
      if (!suggestionsBox) return;
      const q = normalize(query);
      if (!q) {
        suggestionsBox.innerHTML = "";
        return;
      }

      const scored = links.map((a) => {
        const name = normalize(a.textContent || "");
        const dist = levenshtein(name, q);
        const pop = POPULARITY[name] || 70;
        const score = (100 - dist * 8) + pop;
        return { name, label: a.textContent.trim(), score };
      });

      scored.sort((a, b) => b.score - a.score);

      const top = scored.slice(0, 5);

      suggestionsBox.innerHTML = `
        <div class="state-suggestions__inner">
          <div class="state-suggestions__label">Did you mean:</div>
          ${top
            .map(
              (s) =>
                `<button type="button" class="state-suggestion-pill" data-state="${s.label}">
                  ${s.label}
                </button>`
            )
            .join("")}
        </div>
      `;
    }

    function handleSuggestionClick(e) {
      const target = e.target.closest(".state-suggestion-pill");
      if (!target) return;
      const stateName = target.getAttribute("data-state");
      if (!stateName) return;
      searchInput.value = stateName;
      applySearch(stateName);
    }

    if (suggestionsBox) {
      suggestionsBox.addEventListener("click", handleSuggestionClick);
    }

    /* -------------------------------
       MAIN SEARCH LOGIC
    --------------------------------*/
    function applySearch(rawQuery) {
      const query = normalize(rawQuery);

      // Empty query → reset everything
      if (!query) {
        resetUI();
        return;
      }

      // Natural language region detection
      for (const key in REGION_KEYWORDS) {
        if (query.includes(key)) {
          highlightRegion(REGION_KEYWORDS[key]);
          if (emptyMessage) emptyMessage.style.display = "none";
          renderSuggestions(""); // clear suggestions
          return;
        }
      }

      let totalMatches = 0;

      cards.forEach((card) => {
        let regionMatches = 0;
        const lis = card.querySelectorAll("li");
        lis.forEach((li) => {
          const label = normalize(li.textContent || "");
          const isMatch = fuzzyMatch(label, query);
          li.style.display = isMatch ? "list-item" : "none";
          li.classList.toggle("highlight", isMatch);
          if (isMatch) regionMatches++;
        });
        card.style.display = regionMatches ? "block" : "none";
        card.classList.toggle("collapsed", regionMatches === 0);
        totalMatches += regionMatches;
      });

      if (emptyMessage) {
        emptyMessage.style.display = totalMatches === 0 ? "block" : "none";
      }

      renderSuggestions(query);

      // Auto-scroll to best match
      if (totalMatches > 0) {
        const firstVisible = document.querySelector(
          ".state-pro-card li.highlight"
        );
        if (firstVisible) {
          firstVisible.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    }

    const handleInput = (e) => {
      applySearch(e.target.value);
    };

    searchInput.addEventListener("input", handleInput);

    /* -------------------------------
       ALPHABET FILTER
    --------------------------------*/
    const handleAlphaClick = (letter) => {
      const q = normalize(letter);
      let totalMatches = 0;

      cards.forEach((card) => {
        let regionMatches = 0;
        const lis = card.querySelectorAll("li");
        lis.forEach((li) => {
          const label = normalize(li.textContent || "");
          const isMatch = label.startsWith(q);
          li.style.display = isMatch ? "list-item" : "none";
          li.classList.toggle("highlight", isMatch);
          if (isMatch) regionMatches++;
        });
        card.style.display = regionMatches ? "block" : "none";
        card.classList.toggle("collapsed", regionMatches === 0);
        totalMatches += regionMatches;
      });

      if (emptyMessage) {
        emptyMessage.style.display = totalMatches === 0 ? "block" : "none";
      }

      if (suggestionsBox) suggestionsBox.innerHTML = "";
      searchInput.value = ""; // clear search after alpha click
    };

    const alphaHandlers = alphaButtons.map((btn) => {
      const fn = () => handleAlphaClick(btn.textContent);
      btn.addEventListener("click", fn);
      return { btn, fn };
    });

    /* -------------------------------
       RECENT ROW CLICK → APPLY FILTER
    --------------------------------*/
    function handleRecentClick(e) {
      const pill = e.target.closest(".state-pill");
      if (!pill) return;
      const label = pill.getAttribute("data-state");
      if (!label) return;
      searchInput.value = label;
      applySearch(label);
    }

    if (recentRow) {
      recentRow.addEventListener("click", handleRecentClick);
    }

    // Initial full reset
    resetUI();

    /* -------------------------------
       CLEANUP
    --------------------------------*/
    return () => {
      searchInput.removeEventListener("input", handleInput);
      alphaHandlers.forEach(({ btn, fn }) =>
        btn.removeEventListener("click", fn)
      );
      links.forEach((a) => a.removeEventListener("click", onStateClick));
      if (recentRow) recentRow.removeEventListener("click", handleRecentClick);
      if (suggestionsBox)
        suggestionsBox.removeEventListener("click", handleSuggestionClick);
    };
  }, []);

  return null; // Invisible control layer
}