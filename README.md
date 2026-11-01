# Inventory Dashboard: A Debugging Exercise

A small product-inventory dashboard built with **React 18**, **TypeScript** and **CSS Modules** (bundled with Vite). It is deliberately broken: the code contains **four intentional bugs**, and the goal is to find and fix them using only the spec and the symptoms below.

## Purpose

This project exists to practice debugging a realistic front-end codebase, not to ship a product. It is meant to train:

- Reading unfamiliar React + TypeScript code and reasoning about how data flows through it
- Reproducing a bug from a symptom description, then narrowing it to a root cause
- Telling apart bugs from different layers: types, hooks, styling and event handling
- Fixing the cause rather than patching the symptom

The four bugs are of varying difficulty and cover these areas (in no particular order):

1. A TypeScript typing problem
2. A React hook problem
3. A CSS Modules scoping or layout problem
4. A runtime state or event-handling problem

Where each one lives is intentionally not documented.

## What the app does

- **Stats bar**: product count, total units, inventory value and low-stock count
- **Search / filter bar**: debounced search by name or SKU, category filter, "Low stock only" toggle and a live result count
- **Product list**: sortable-looking table with stock badges, click a row to edit, per-row Delete
- **Create / Edit form**: side panel for adding or editing a product
- **Persistence**: products are stored in `localStorage` under `inventory.products`

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # typecheck + production build
```

To reset to the seed data, run `localStorage.clear()` in the browser console and reload.

## Expected behavior (the spec)

1. **Stats bar** shows the product count, the sum of all units in stock, the total inventory value (price x stock), and the number of low-stock items (stock <= 5). All of these update as products change.
2. **Search/filter bar** sits on one row on desktop: a search field that grows to fill the space, a category dropdown, a "Low stock only" checkbox with its label, and a result count on the right. Search is debounced and matches name or SKU, case-insensitively.
3. **Product list**: clicking a row opens the edit form pre-filled with that product. The Delete button removes only that product, and the form stays closed (or closes if it was editing that product).
4. **Create/Edit form**: "+ New product" opens a blank form, and Save adds the product. Editing an existing product updates it in place. Cancel closes the form with no changes.
5. **Persistence**: any change (create, edit, delete) survives a page reload.

## Observed bugs

**Bug A.** Total units starts at 358 and is correct for a while. After you edit a product's stock value and save (or create a new product), the "Total units" card shows a huge, nonsensical number instead of a slightly different total. The other three stats still look right.

**Bug B.** Create a product and reload: it's still there. Delete one and reload: it stays gone. But edit an existing product (change a name, price, or stock), save, and reload: the old values come back.

**Bug C.** At a normal desktop width, the toolbar doesn't render as a single tidy row. The category dropdown stretches across the full width on its own line, and the "Low stock only" checkbox looks oversized and misaligned relative to its label.

**Bug D.** Click Delete on any row. The row disappears as expected, but the side panel also opens, showing an empty "New product" form. If you fill it in and click Save, the panel closes and nothing is added.

## Tasks

Work through these in any order. Each task is done when its check passes **and** the rest of the spec still holds.

- [ ] **A: Total units stays accurate after changes**
  Edit a product's stock or create a new product, then check the "Total units" card.
  *Done when:* it shows the correct sum of all stock values, and the other stats still update.

- [ ] **B: Edits survive a page reload**
  Edit a product's name, price or stock, save, then reload the page.
  *Done when:* the edited values persist, and create/delete persistence still works.

- [ ] **C: Toolbar renders as one row on desktop**
  View the app at a normal desktop width (about 1100px or wider).
  *Done when:* search, category dropdown, "Low stock only" checkbox and result count sit on a single row, and the checkbox is a normal size aligned with its label.

- [ ] **D: Deleting a product only deletes**
  Click Delete on any row.
  *Done when:* the row is removed, the side panel stays closed, and "+ New product" followed by Save still adds a product correctly.

## Ground rules

- Fix root causes, not symptoms. A workaround that hides the problem doesn't count.
- Keep each fix minimal and avoid unrelated refactors.
- After each fix, re-test the matching symptom **and** the rest of the spec to make sure nothing else broke.
- Use React DevTools, the browser's Elements/Application panels, and `console.log` freely.

## Done when

All five spec items behave as described, none of the four symptoms can be reproduced, and `npm run build` succeeds.