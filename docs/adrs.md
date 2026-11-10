# Architecture Decision Records (ADRs)

## Overview
This document records the key architectural decisions made for the Fabric frontend application (SaaS for garment and textile manufacturers: production batch tracking, quality control, machinery management and alerts). Each record follows the Architecture Decision Record practice (Michael Nygard and MADR conventions): context, decision, status and consequences.

---

## Table of Contents
- [ADR-001: Domain-Driven Design Layered Architecture with Bounded Contexts](#adr-001-domain-driven-design-layered-architecture-with-bounded-contexts)
- [ADR-002: Core Frontend Framework: Vue 3 with Composition API and Vite](#adr-002-core-frontend-framework-vue-3-with-composition-api-and-vite)
- [ADR-003: State Management with Pinia Stores per Bounded Context](#adr-003-state-management-with-pinia-stores-per-bounded-context)
- [ADR-004: UI Component Framework: PrimeVue with Globally Registered Components](#adr-004-ui-component-framework-primevue-with-globally-registered-components)
- [ADR-005: Centralized Styling in a Global Stylesheet](#adr-005-centralized-styling-in-a-global-stylesheet)
- [ADR-006: Centralized HTTP Client, Endpoint Abstraction and Assemblers](#adr-006-centralized-http-client-endpoint-abstraction-and-assemblers)
- [ADR-007: Role-Based Access Control with Session Store, Route Guard and Role Navigation](#adr-007-role-based-access-control-with-session-store-route-guard-and-role-navigation)
- [ADR-008: Internationalization with Vue I18n (English and Spanish)](#adr-008-internationalization-with-vue-i18n-english-and-spanish)
- [ADR-009: Data Visualization with Chart.js](#adr-009-data-visualization-with-chartjs)
- [ADR-010: Mock Backend with json-server and Firebase Hosting Deployment](#adr-010-mock-backend-with-json-server-and-firebase-hosting-deployment)

---

## ADR-001: Domain-Driven Design Layered Architecture with Bounded Contexts

### Status
Accepted

### Context
Fabric covers several distinct business areas (machine registration, production batches, quality, alerts, analytics and access control) developed in parallel by different team members. A flat structure by technical type (`/components`, `/views`, `/services`) causes tight coupling between features, business rules leaking into views and frequent merge conflicts.

### Decision
Organize the code by **Bounded Context** and, inside each one, by architectural layer:

| Bounded context | Responsibility |
|---|---|
| `machine-registration` | Machines, stop events, maintenance records |
| `production-batches` | Batches, stages, movements, operators, observations |
| `quality` | Fabric inspections, inspection parameters, shrinkage tests, garment defects |
| `alerts` | System alerts |
| `report-analytics` | Production dashboard and metrics |
| `identity-access` | Role selection, session and route protection |
| `shared` | Layout, sidebar, language switcher, base HTTP infrastructure |

Each context uses the layers `domain` (entities and value objects, framework-agnostic), `application` (Pinia stores), `infrastructure` (API clients and assemblers) and `presentation` (views, components and routes). The `shared` context must not import from any other bounded context. `app.vue` and `router.js` act as the composition root that wires every context together.

### Consequences
- **Positive:**
  - High cohesion inside each context and low coupling between contexts; teams can work on separate branches (`feature/machine-registration`, `feature/batches`, `feature/Quality-inspections`) with few conflicts.
  - Business rules (for example `FabricInspection.register`, `ShrinkageTest.register`, `BatchMovement.hasDiscrepancy`) live in the domain layer and are testable without UI.
  - Cross-context references are done by identifier (`batchId`, `machineId`) instead of direct imports.
- **Negative:**
  - More files and boilerplate than binding API responses directly to templates.
  - Layer boundaries are enforced by convention only; some legacy components still mix presentation and data access.
  - Context folder naming is not fully uniform (`application/store/production.js` versus `application/*.store.js`).

---

## ADR-002: Core Frontend Framework: Vue 3 with Composition API and Vite

### Status
Accepted

### Context
The team needs a reactive framework with fast iteration, a gentle learning curve for a student team and a quick build tool for a single-page application.

### Decision
Use **Vue 3** with Single-File Components and `<script setup>`, bundled with **Vite** and navigated with **Vue Router**.

### Consequences
- **Positive:**
  - Fast HMR and short build times.
  - Composition API allows clean reuse of store logic and computed state in views.
  - Lazy-loaded routes keep the initial bundle small.
- **Negative:**
  - The Vite and plugin configuration must be maintained in `vite.config.js`.
  - Case-sensitive file systems (Linux CI, Firebase builds) expose import mismatches that pass on Windows (for example `./App.vue` versus `app.vue`), so file name casing must be treated as part of the contract.

---

## ADR-003: State Management with Pinia Stores per Bounded Context

### Status
Accepted

### Context
Views need to share asynchronous data (machines, batches, inspections), loading and error state without passing props through many levels or creating a single global state object.

### Decision
Adopt **Pinia** and provide one store per bounded context or use case as the **application layer**: `useMachineStore`, `useProductionStore`, `useFabricInspectionStore`, `useInspectionParametersStore`, `useShrinkageTestStore`, `useInspectorDashboardStore` and `useSessionStore`. Stores orchestrate infrastructure services and domain entities; views only call store actions and read store state.

### Consequences
- **Positive:**
  - Context isolation and simple, typed-by-convention access from any view.
  - Derived values (counts, summaries, filtered lists) are computed inside stores or domain helpers (`summarizeInspections`, `filterInspections`) instead of in templates.
- **Negative:**
  - Two Pinia styles coexist (setup stores and the options-style `useProductionStore`), which is inconsistent.
  - Stores that persist data directly through services (for example the quality stores with `FabricInspectionService`) are coupled to the REST shape of the mock API.

---

## ADR-004: UI Component Framework: PrimeVue with Globally Registered Components

### Status
Accepted

### Context
The application needs accessible, ready-made data tables, forms, dialogs, selects, menus, tags and toasts to deliver a consistent interface with limited development time.

### Decision
Adopt **PrimeVue 5** with the `@primeuix/themes` preset and register the used components globally in `main.js` under the `pv-` prefix (`pv-data-table`, `pv-column`, `pv-button`, `pv-dialog`, `pv-select`, `pv-tag`, `pv-toast`, `pv-confirm-dialog`, among others). Toast and confirmation services are enabled at application level.

### Consequences
- **Positive:**
  - Fast construction of tables, forms and confirmations with built-in accessibility.
  - A single registration point and a predictable `pv-` naming convention in templates.
- **Negative:**
  - Vendor lock-in to the PrimeVue API and DOM structure.
  - The theme overrides component colors (for example the primary button), so brand colors must be applied with design-token variables such as `--p-button-primary-*` instead of plain CSS properties.

---

## ADR-005: Centralized Styling in a Global Stylesheet

### Status
Accepted

### Context
Styles were initially written inside each `.vue` file with `<style scoped>`, producing duplicated rules and inconsistent visuals across contexts. The team agreed on a single place and a single naming style for CSS.

### Decision
All new styles are written in the global `src/style.css`, organized by section (shared layout, inspector, report dashboard, and so on). Rules:
- Class names are hyphenated (`inspection-submit`, `report-card`); BEM-style `__` and `--` separators are not used.
- No `<style>` blocks in new or refactored `.vue` files and no separate CSS files.
- Context-specific classes carry a prefix (for example `report-`) to avoid collisions with older global names such as `.card`, `.stats-grid` and `.stat-value`.

### Consequences
- **Positive:**
  - One source of truth for look and feel; shared layout, sidebar and language switcher styles are reused by every context.
  - Easier visual reviews and theming.
- **Negative:**
  - A large global file where later definitions silently override earlier ones; collisions were already observed and fixed with prefixes.
  - Legacy components from earlier iterations still keep `<style scoped>` blocks and unused dashboard rules remain, so a cleanup is pending.

---

## ADR-006: Centralized HTTP Client, Endpoint Abstraction and Assemblers

### Status
Accepted

### Context
Calling `axios` directly from views or stores duplicates the base URL, error handling and CRUD code, and couples the UI to the shape of backend payloads.

### Decision
1. A shared `BaseApi` module exposes a configured Axios instance (`http`) whose base URL comes from the environment (`VITE_` variables).
2. A shared `BaseEndpoint` class implements the generic REST operations (`getAll`, `getById`, `create`, `update`, `delete`). Context APIs such as `MachineApi` (composition) and `ProductionBatchesApiService` (inheritance) build on it.
3. Resource-to-entity conversion is done in the infrastructure layer: `MachineAssembler` converts API resources into `Machine` entities, and production and report data are mapped through entity constructors and mapping functions.
4. Endpoint paths and the API base URL are configured through environment variables, never hardcoded in code.

### Consequences
- **Positive:**
  - Uniform HTTP configuration and removal of duplicated CRUD code.
  - The domain model is shielded from payload changes at the mapping step.
- **Negative:**
  - The pattern is not applied uniformly: the quality context uses static service classes (`FabricInspectionService`, `DefectService`) that call `http` directly, and assemblers exist only in some contexts.
  - Subclasses are bound to the REST conventions of `BaseEndpoint`.

---

## ADR-007: Role-Based Access Control with Session Store, Route Guard and Role Navigation

### Status
Accepted

### Context
Fabric serves two user profiles with different needs: the **production supervisor** (batches, machines, alerts, analytics, quality supervision) and the **quality inspector** (inspection dashboard, new roll inspection, parameters, shrinkage tests). Each profile must see only its own navigation and routes.

### Decision
Implement role-based access in the `identity-access` context:
- `USER_ROLES` (`production-supervisor`, `quality-inspector`) in the domain layer.
- `useSessionStore` keeps the selected role and exposes `isAuthenticated`, `signIn(role)` and `signOut()`.
- Routes declare metadata (`role`, `public`, `guestOnly`, `hideSidebar`); a global `beforeEach` guard in `auth-guard.js` redirects unauthenticated users to the login screen, redirects authenticated users away from guest-only pages and sends users to the home route of their own role when they open a route of another role.
- `role-navigation.js` defines the sidebar entries of each role and `role-options.js` the home route of each role, so the sidebar is built from the active role instead of hardcoded menus.
- The root path redirects to the role selection screen.

### Consequences
- **Positive:**
  - Declarative protection of routes and a different sidebar per role from a single source.
  - Easy to add roles or entries by editing configuration.
- **Negative:**
  - Access is simulated on the client by role selection; there is no credential validation or token. A real backend must enforce authentication and authorization independently.
  - The session lives only in memory, so reloading the page returns the user to the role selection screen unless persistence is added later.

---

## ADR-008: Internationalization with Vue I18n (English and Spanish)

### Status
Accepted

### Context
The product must be usable in English and Spanish, with runtime language switching, and the team rule is that no user-facing text is hardcoded in templates.

### Decision
Integrate **Vue I18n 11** in Composition mode (`legacy: false`) with `src/locales/en.json` and `src/locales/es.json`, configured in `src/i18n.js`. A shared language switcher is available in the layout. Conventions:
- Every label, placeholder, table header, message and empty state uses a translation key (`t('quality.fabric.stats.rolls')`), organized by context (`quality.*`, `qualityInspector.*`, `dashboard.*`).
- Stored and domain values stay in a stable form (for example `Conforming`, `Blocked`) and are translated only at display time through option maps (`RESULT_STATUS_DISPLAY`, `ROLL_STATUS_DISPLAY`, `SHRINKAGE_STATUS_DISPLAY`), so filters and business rules do not depend on the language.
- Both catalogs must keep exactly the same keys and contain no duplicate keys; the literal `|` character is avoided in messages because it is the plural separator.

### Consequences
- **Positive:**
  - Complete bilingual UI and a single place to edit copy.
  - Language changes cannot break business logic because stored values are language-independent.
- **Negative:**
  - Missing or duplicated keys cause untranslated labels or silent overrides, so parity must be checked whenever keys are added.
  - Raw records saved in English (for example in `db.json`) need display mapping wherever they are shown.

---

## ADR-009: Data Visualization with Chart.js

### Status
Accepted

### Context
The producer dashboard and the quality inspector dashboard must show production and inspection indicators (conforming versus observed rolls, shrinkage results, trends) in an understandable visual form.

### Decision
Use **Chart.js 4** to render charts inside presentation components (`ProductionChart`, `inspection-chart.component.vue`). Chart colors are centralized (`inspector-chart-colors.js`) and use the green of the application's identity. Aggregations (counts, percentages, grouping) are computed in the domain/application layer (`summarizeInspections`) and charts only receive ready data.

### Consequences
- **Positive:**
  - Lightweight, framework-agnostic library with full control of datasets and options.
  - Presentation components stay simple because calculations are outside the chart code.
- **Negative:**
  - Charts are drawn on a canvas, so they need manual accessibility support (labels or tables) and manual updates when data or language changes.

---

## ADR-010: Mock Backend with json-server and Firebase Hosting Deployment

### Status
Accepted

### Context
No real backend exists during the development phase of the course project, yet the frontend must exercise realistic REST flows and be accessible online for evaluation.

### Decision
- Use **json-server** with `server/db.json` as the fake REST API and `server/routes.json` to expose the endpoint paths (`/api/*` rewrite and nested resources such as `/production-batches/:id/movements`). The API runs locally with `npm run api` and in a hosted environment with `npm run start:api`, using the `PORT` variable.
- Deploy the frontend as a static single-page application on **Firebase Hosting** (`dist` folder with a rewrite of every path to `index.html`).
- Environment variables select the API base URL and endpoint paths per environment.

### Consequences
- **Positive:**
  - Parallel development of frontend contexts without waiting for a backend.
  - Simple and repeatable deployment, and SPA routes work after refresh thanks to the rewrite rule.
- **Negative:**
  - json-server offers no real authentication, validation or business rules; the frontend domain classes validate data on the client.
  - `server/db.json` is rewritten by json-server during use, so local changes can appear as noise in version control.
  - Replacing the mock with the real backend will require review of payload shapes and the mapping layer.
