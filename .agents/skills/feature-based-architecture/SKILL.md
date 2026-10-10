---
name: feature-based-architecture
description: Enforces a feature-based (vertical-slice, feature-sliced) project structure whenever writing, adding, moving, or refactoring code. Keeps everything a business capability needs (UI, state, API calls, types, hooks, services, tests) together in one self-contained feature folder with a small public API, instead of splitting code by technical type (components/, services/, utils/). Use this skill whenever the user asks to add or change a feature, screen, page, module, endpoint, component, hook, or service, to scaffold or restructure a project, or to decide where a file should live, in any language or framework (React, Next.js, Vue, Angular, Flutter, Node, NestJS, FastAPI, Spring, etc.), even if they never say "feature-based".
license: MIT
metadata:
  version: "1.0"
---

# Feature-Based Architecture

Organize code by **what it does for the product**, not by **what kind of file it is**. A feature folder holds everything needed for one capability, so a change to "checkout" touches one folder, a feature can be understood or deleted in isolation, and teams stop colliding in giant shared `components/` and `services/` directories.

The boundary rules below exist to protect that isolation. When a situation isn't covered, choose the option that keeps a feature self-contained and its dependencies pointing in one direction.

## The model

```
src/
├── app/            # Composition: routing, providers, bootstrap, DI, store setup
├── features/
│   └── <feature>/  # One business capability
│       ├── ...     # Its UI, state, API calls, types, logic, tests
│       └── index.* # Public API: the only entry point other code may import
└── shared/         # Generic, domain-free building blocks (UI kit, http client, utils)
```

**Dependency direction: `app` → `features` → `shared`.** Never the reverse.

Exact folder names and file extensions depend on the stack. See `references/stack-layouts.md` for React, Next.js, Vue, Angular, Flutter, NestJS, FastAPI, and Spring Boot layouts.

## Workflow: do this every time you write or place code

1. **Inspect the repo first.** Look at the existing top-level structure before creating anything.
   - *Already feature-based:* follow its conventions exactly (folder names, casing, index files, internal sub-folders). Consistency beats this document's defaults.
   - *Layer-based or flat:* do not reorganize the project on your own. Put new code in a feature folder that coexists with the old structure, say so in one sentence, and offer to migrate incrementally.
   - *Empty or greenfield:* use the model above, adapted to the stack.
2. **Name the feature.** Use a business noun (`auth`, `cart`, `invoices`, `user-profile`), not a technical one (`forms`, `modals`, `helpers`). If the work extends an existing feature, put it there rather than creating a near-duplicate.
3. **Place each file** using the table below.
4. **Wire through the public API.** Export from the feature's entry file only what other code genuinely needs.
5. **Check imports before finishing** (see the checklist at the end).

## Where does this code go?

| The code is... | Put it in |
|---|---|
| Used by only one feature (even if it looks generic) | Inside that feature. Promote it later if a second feature needs it |
| Used by 2+ features and has no business meaning (Button, http client, date/currency formatting, validation helpers) | `shared/` |
| Used by 2+ features and has business meaning (e.g. "current user", "product") | The feature that owns that concept, exposed through its public API. If no feature owns it, create one |
| Wiring: routes, providers, store/DI config, app shell | `app/` |
| A screen or page that combines several features | `app/` (or the framework's routing layer), kept thin: it composes features, it contains no business logic |

Start local and promote on real second use. Premature sharing creates a `shared/` junk drawer that every feature secretly depends on.

## Boundary rules

- **Import other features only through their public entry point.** `import { CartBadge } from "@/features/cart"` is fine. `import { CartItem } from "@/features/cart/components/CartItem"` is not, because it makes the internals of `cart` impossible to change safely.
- **No circular feature dependencies.** If feature A and B need each other, either lift the combination into `app/` (composition), pass data or callbacks as props/arguments, communicate through events, or extract the shared concept into a third feature.
- **`shared/` never imports from `features/`.** It must stay domain-free.
- **Keep the public API small.** Export components, hooks, functions, and types that are part of the contract. Everything else stays private to the feature.
- **Enforce it with tooling when the project has (or wants) it:** ESLint `no-restricted-paths` / `import/no-internal-modules`, `dependency-cruiser`, Nx module boundaries, `import-linter` (Python), ArchUnit (Java). Suggest this when you notice boundary violations; don't add tooling unasked.

## Inside a feature

Organize by technical type only **inside** the feature, and only once it has grown enough to need it. A small feature can be a handful of flat files. Don't create empty folders "for later".

A typical mature frontend feature:

```
features/checkout/
├── components/
├── hooks/
├── api/            # requests + response mapping for this feature
├── state/          # store slice / context / signals
├── types.ts
├── utils.ts        # feature-private helpers
├── checkout.test.tsx   # tests live next to the code they test
└── index.ts
```

For backends, a feature is a vertical slice: controller/route, service/use-case, repository, DTOs/schemas, entity/model, and tests together in one folder.

Colocate tests, styles, stories, and fixtures with the code they belong to.

## Working in existing code

- **Bug fixes and small edits:** change the file where it lives. Don't move files as a side effect.
- **Moving files into features:** only when asked, or when the task cannot be done cleanly otherwise. Do it as its own step, update every import, and run the build/tests afterward.
- **Naming and style:** match the project (casing, suffixes, barrel-file habits). Default to `kebab-case` folders if there is no precedent.

## Examples

**Example 1: "Add password reset to the app"**
The project already has `features/auth/`. Add the work there, not in a new top-level `password-reset/` or in generic `pages/` and `services/` folders:
```
features/auth/
├── components/ResetPasswordForm.tsx
├── api/reset-password.ts
├── hooks/useResetPassword.ts
└── index.ts            # add: export { ResetPasswordForm } from "./components/ResetPasswordForm"
```
The route in `app/` imports `ResetPasswordForm` from `@/features/auth`.

**Example 2: "Where should `formatCurrency` go?"**
Only `invoices` uses it today → `features/invoices/utils.ts`. When `cart` also needs it, and it has no business logic, move it to `shared/utils/format-currency.ts` and update both imports.

**Example 3: "The cart needs to show product names"**
Don't reach into `features/products/api/...`. Import the exported hook or component from `@/features/products`. If `products` doesn't expose what you need, add it to `products`' public API deliberately.

## Anti-patterns to avoid

- Creating top-level `components/`, `hooks/`, `services/`, or `utils/` folders for feature-specific code.
- Deep imports into another feature's folders.
- A bloated `shared/` that contains business logic.
- Vague catch-all features (`common`, `misc`, `core-stuff`).
- One mega-feature that owns everything, or one feature per file. A feature should map to a capability a product person would recognize.
- Barrel files that re-export everything, which defeats the public API.

## Before you finish

- [ ] Every new file lives in a feature folder (or `app/` / `shared/` with a reason from the table).
- [ ] No imports into another feature's internals; no `shared/` → `features/` imports.
- [ ] No circular dependencies between features.
- [ ] The feature's entry file exports only what outside code needs.
- [ ] Tests sit next to the code they cover.
- [ ] If the repo wasn't feature-based, you told the user where the new code went and offered a migration path.
