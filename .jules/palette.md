## 2025-05-15 - Missing ARIA labels and focus states on icon buttons
**Learning:** Found a widespread pattern across the app where icon-only buttons (like the favorite button in GameCard, close button in SearchBar) lack accessible names (`aria-label`) and visible focus states (`focus-visible:ring`), making them inaccessible to screen readers and keyboard users.
**Action:** Always verify icon-only buttons have an `aria-label` describing their action and ensure they have a visible focus indicator using `focus-visible` classes.
