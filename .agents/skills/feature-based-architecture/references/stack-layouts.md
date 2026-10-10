# Stack-specific feature layouts

Read only the section for the stack in use. If the project already has its own conventions, they win.

Contents: React/Vite · Next.js · Vue/Nuxt · Angular · Flutter · NestJS · FastAPI · Spring Boot

---

## React / Vite (TypeScript)

```
src/
├── app/               # App.tsx, router, providers, store config
├── features/
│   └── auth/
│       ├── components/  hooks/  api/  state/
│       ├── types.ts
│       └── index.ts
└── shared/
    ├── ui/            # design-system primitives
    ├── lib/           # http client, utils
    └── hooks/         # generic hooks only
```
Routes live in `app/` and import from `@/features/<name>`. Configure a path alias (`@/`) in `tsconfig` and the bundler.

## Next.js (App Router)

`app/` is the **routing layer**, so keep route files thin and put features outside it:
```
src/
├── app/                      # page.tsx / layout.tsx / route.ts: compose features only
│   └── (shop)/cart/page.tsx  # imports <CartView /> from "@/features/cart"
├── features/
│   └── cart/
│       ├── components/  actions/  api/  types.ts
│       └── index.ts
└── shared/
```
Server Actions and data fetchers for a feature live in that feature (e.g. `actions/`). Mark client/server boundaries per file, and don't export server-only code from an entry file consumed by client components.

## Vue / Nuxt

```
src/
├── app/ (or main.ts, router/)
├── features/
│   └── cart/
│       ├── components/  composables/  stores/  api/
│       └── index.ts
└── shared/
```
In Nuxt, keep `pages/` thin and import from `~/features/<name>`; place feature composables and stores inside the feature rather than the global `composables/` and `stores/` folders.

## Angular

```
src/app/
├── core/               # app-wide singletons (interceptors, guards, layout)
├── features/
│   └── orders/
│       ├── components/  services/  state/  models/
│       ├── orders.routes.ts   # lazy-loaded via loadChildren / loadComponent
│       └── index.ts
└── shared/             # dumb components, pipes, directives
```
Prefer standalone components and lazy-loaded feature routes. Features are routed to from `app.routes.ts`, not imported into each other's modules.

## Flutter

```
lib/
├── app/                # MaterialApp, router, theme, DI
├── features/
│   └── auth/
│       ├── data/          # datasources, repository impls, DTOs
│       ├── domain/        # entities, repository interfaces, use cases
│       ├── presentation/  # screens, widgets, controllers/bloc/providers
│       └── auth.dart      # public exports
└── shared/ (or core/)
```
Layers (`data/domain/presentation`) exist **inside** each feature, never as top-level folders.

## NestJS

```
src/
├── app.module.ts
├── features/ (or modules/)
│   └── orders/
│       ├── orders.controller.ts
│       ├── orders.service.ts
│       ├── orders.repository.ts
│       ├── dto/  entities/
│       ├── orders.module.ts   # exports only what other modules may use
│       └── orders.service.spec.ts
└── shared/
```
The module's `exports` array is the public API. Other modules depend on exported providers, never on files inside the folder.

## FastAPI / Python

```
app/
├── main.py             # app factory, include_router calls
├── features/
│   └── orders/
│       ├── router.py
│       ├── service.py
│       ├── repository.py
│       ├── schemas.py
│       ├── models.py
│       ├── tests/
│       └── __init__.py   # public API (re-export intentionally)
└── shared/             # db session, settings, generic utilities
```
Use `import-linter` to forbid cross-feature imports of non-public modules.

## Spring Boot

Package by feature, not by layer:
```
com.example.shop
├── orders/      OrderController, OrderService, OrderRepository, Order, OrderDto
├── customers/   ...
└── shared/      config, exception handling, generic utilities
```
Keep internals package-private and expose only the service interface or facade other features need. ArchUnit can enforce this.
