# DEV_GUARDRAILS.md  
RoutineSchedule – Ongoing Development Rules

## Purpose

These guardrails apply **after the initial build is complete**.

They exist to ensure that all future changes are:
- **Small**
- **Verifiable**
- **Testable**
- **Complete**
- **Do not break unrelated features or code paths**

All work (human or agentic) must treat this file as **authoritative**.

---

## 0. Core Principles for Every Change

1. **One change per PR / prompt**
   - One feature, fix, or refactor at a time.
   - No “while we’re here” edits.
   
2. **NO CHANGE DIRECTLY ON MAIN! EVER** 
   - Unless explicitly requested by the human providing the prompt
   
3. **Small, composable diffs**
   - Max 1–3 files touched unless strictly necessary.
   - If a change spans more, split into multiple steps.

4. **No broken states**
   - The app must run at all times.
   - No committing half-migrated structures or commented-out stubs.

5. **Tests or manual checks required**
   - For each change, document exactly how it was tested.
   - At minimum: start app, exercise affected view/endpoint, confirm no console errors.

6. **No collateral damage**
   - Do not alter unrelated components, routes, or stores “for consistency.”
   - If consistency work is needed, do it as its own dedicated change.

7. **Add statement of intent and reasoning for EVERY change**
 Add reasoning and rationale in for each change in a single simple addition row to a markdown table in reasonslog.md (include reference to version number you are looking at the time of consideration (not the version number the change was published in))

---

## 1. Minimal, Clean UI (UX + Visual Guardrails)

All UI changes must **preserve** and **extend** the original design goals of low cognitive load and clear flows.

### UI Guardrails

- Font sizes must follow a clear hierarchy (no tiny text, no random sizes).
- Buttons must be large, clearly labelled, and unambiguous.
- Never use more than **two** accent colors in the entire app.
- No modal stacking (only one modal visible at a time).
- No nested menus (keep navigation shallow and obvious).
- Navigation must remain visible, predictable, and consistent between views.
- Every view begins with a clear H1 title describing the screen’s purpose.
- Never introduce animation unless it has a clear UX rationale (no gratuitous motion).
- Keep forms to a maximum of **5–7 fields** per screen.
- Any new UI element must:
  - Reuse existing components where possible.
  - Match existing spacing, typography, and interaction patterns.

**UI Change Rule:**  
If a change requires introducing a new layout or pattern, it must be done as a **separate, focused change** with a clear justification in the commit message or PR description.

---

## 2. Build Discipline (Critical Guardrails)

These rules enforce disciplined, maintainable development.

### Rule A — No Global State Leakage

- All shared state goes through **Pinia** stores.
- No ad-hoc global event buses.
- `localStorage` may only be used for:
  - user preferences (e.g., theme)
  - last week viewed
- Any additional persistence must be discussed and added explicitly to the store layer.

### Rule B — No Hardcoded Dates

- All date logic (parsing, formatting, comparison, week-number calculations) must use `datesUtil`.
- No `new Date("2025-xx-xx")` scattered through components or services.
- If new date operations are needed:
  - Add them to `datesUtil`.
  - Use them exclusively from there.

### Rule C — No Mixed Concerns

Avoid cross-layer pollution:

- No API calls in views (use services instead).
- No SQL or DB access in controllers (use models).
- No complex state management inside components (use Pinia).
- No date formatting or parsing inside services or views (use `datesUtil`).
- No business logic in routes (use controllers/services).

If you notice mixed concerns, refactor them *in a dedicated, small change* focused only on separation of concerns.

### Rule D — Predictable Naming

Use consistent naming across the entire stack:

- **JavaScript / TypeScript:** `camelCase` for variables and functions.
- **Components:** `PascalCase` (e.g., `WeekView.vue`, `DayDetailView.vue`).
- **Database columns:** `snake_case` (e.g., `week_number`, `day_type`).
- **Pinia stores:** `useXStore` naming (e.g., `useScheduleStore`).

No ad-hoc naming conventions or mixed styles.

### Rule E — No Side Effects in Getters / Computed

- Getters (Pinia) and computed properties (Vue) must be **pure**:
  - No API calls.
  - No mutations.
  - No logging.
- They should only derive data from existing state or props.

If side effects are needed, use:
- Actions (Pinia)
- Methods (components)
- Services (backend/frontend)

### Rule F — No Dead Code

- Remove unused imports.
- Remove commented-out blocks of “temporary” code.
- Remove unused variables and functions.
- If you need to preserve an old version for reference, put it in:
  - Git history, or
  - A clearly labelled doc (e.g., `docs/archive.md`), not in active code.

---

## 3. Change Workflow (Step-by-Step)

Every change MUST follow this workflow:

0. **Check Git Repo Status and branch locations
    - End process here IF principle 2. is in violation

1. **Define the change in one sentence**
   - Example: “Add a notes field to schedule entries in the Day Detail view.”

2. **Identify all impacted layers**
   - DB? Model? Controller? API service? Store? View?

3. **Plan the smallest possible slice**
   - Prefer:
     - DB + model + API only  
     - or API + store + view only  
     - not every layer at once unless necessary.

4. **Edit**
   - Respect all guardrails above.
   - Keep the diff focused.

5. **Test**
   - Start backend & frontend.
   - Exercise the changed feature end-to-end.
   - Confirm:
     - No console errors.
     - No obvious layout breakage.
     - Unchanged flows still work.

6. **Document**
   - Iterate the package.json at the root of the project for version control
   - Following strict x.x.x MAJOR/MINOR/PATCH 
   - EVERY CHANGE COMMIT NEEDS A ENTRY IN a changelog.md stored at the root - iterate the existing document unless no document exists at the root.
   - Draft a commit msg in less than 100 words    

Example commit message:
> “Add notes field to schedule entries (DB + API + DayDetailView)”

---

## 4. Forbidden Changes (Without Explicit Justification)

The following must **not** be done casually:

- Global refactors of naming, structure, or folder layout.
- Replacing Pinia with another state management solution.
- Introducing new UI frameworks or component libraries.
- Widening API response shapes “just in case.”
- Changing DB schema without:
  - clear migration steps
  - updated seed
  - updated tests/checks.

Any such change must be:
- explicitly requested, and  
- justified in a dedicated planning doc / issue.

---

## 5. Agentic AI–Specific Rules

If an AI agent is making code changes, it must:

1. Touch **only the files necessary** for the described change.
2. Respect existing patterns before introducing new ones.
3. Never introduce new dependencies without stating:
   - why they are needed
   - where they are used
4. Always:
   - run through the change workflow (Section 3)
   - summarise which views/stores/endpoints were affected.
