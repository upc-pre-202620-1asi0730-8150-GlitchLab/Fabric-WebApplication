# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-11-12

### Added
- **Identity & Access Bounded Context:**
  - Domain layer: `USER_ROLES` (`production-supervisor`, `quality-inspector`).
  - Application layer: `useSessionStore` Pinia store with `signIn`, `signOut` and `isAuthenticated`.
  - Presentation layer: role selection screen, role navigation (`role-navigation.js`), role options (`role-options.js`) and route module.
  - Role-based route guard (`auth-guard.js`) and `withRole` helper; the root path redirects to role selection.
- **Quality Inspector interface:**
  - Role-based sidebar and layout for the inspector.
  - Inspector Dashboard with Chart.js charts, inspection history and filters (`useInspectorDashboardStore`, `summarizeInspections`, `filterInspections`, `inspection-chart.component.vue`, `inspection-history.component.vue`).
  - New roll inspection form (`FabricInspection` domain model, `useFabricInspectionStore`, `FabricCatalogService`).
  - Inspection parameters form (`InspectionParameters` domain model, `useInspectionParametersStore`).
  - Shrinkage test form with automatic shrinkage calculation and tolerance check (`ShrinkageTest` domain model, `useShrinkageTestStore`).
- **Quality supervisor views:**
  - Fabric inspection views for new inspection, shrinkage test and inspection parameters, with extra functions in the fabric inspection service.
- **Production Batches:**
  - Batch movements, operator assignment, observations and traceability history, with new endpoints in `ProductionBatchesApiService` and route rewrites in `server/routes.json`.
  - Batch filtering controls and data table components.
- **Report Analytics and Alerts:**
  - System alerts components and notification views.
  - Report analytics dashboard integrating the production chart, batch progress and stage components.
- **Internationalization:**
  - English and Spanish localization dictionaries and the language switcher component.
  - Translations for production batches (create batch, details and stages, operator assignment, observations, history and traceability).
  - `qualityInspector`, role selection and `quality.*` keys for the Quality views.
- **Mock data:**
  - Updated `json-server` schema and sample records; suppliers, fabric samples with shrinkage tolerance, dashboard records and inspection parameter data in `server/db.json`.
- **Documentation:**
  - Architecture Decision Records (`docs/adrs.md`) with ADR-001 through ADR-010.
  - Class diagram of the frontend (`docs/class-diagram.puml`).
  - This changelog.

### Changed
- Production store moved into the `production-batches` context (`application/store/production.js`) with centralized batch updates and traceability.
- Domain entities (`BatchMovement`, `BatchObservation`, `BatchOperator`, `BatchStage`) adapted to API models and used by the store.
- Batch creation form updated; creation errors are stored in state instead of thrown.
- Batch detail, operator and traceability views refactored to reuse independent shared components; analytics progress components, export modal and batch list view refactored.
- Producer dashboard (`report-analytics`) rebuilt with `report-` prefixed styles and a green production chart; stage labels centralized in `stage-labels.js`.
- Supervisor Quality views fully translated through i18n; stored values stay in English and are translated only for display.
- Shared layout, sidebar, language switcher and not-found styles moved to the global `style.css`.
- Primary submit buttons use the application green.
- All code comments removed from the source code; components renamed to English.

### Fixed
- Translations of fabric inspections and create production batch in English and Spanish.
- Duplicate keys in `es.json` and missing `dashboard.stages.qualityCheck` key.
- Import case mismatch (`./App.vue` versus `app.vue`) that broke builds on case-sensitive systems.
- Byte order mark lost in five `production-batches` domain files after comment removal.
- Producer dashboard layout broken by global CSS class collisions.
- Button color overridden by the PrimeVue theme.
- Dashboard graphics.

## [1.1.0] - 2026-10-16

### Added
- **State management:**
  - Pinia store initialization.
- **Internationalization:**
  - `vue-i18n` configuration with English and Spanish.
- **Shared context:**
  - Sidebar built from routes and Vue components, with the machinery option.
- **Machine Registration context:**
  - `Machine`, `StopEvent` and `MaintenanceRecord` entities, `MachineApi`, `MachineAssembler` and `useMachineStore`.
  - Main screen with data table, registration form and machine list, machine details view with form, breakdown reporting, maintenance records and operation resume.
  - Fake API and endpoint path configuration for the context.
- **Quality context:**
  - `DefectRecord` domain model.
  - Defect registration form, observed garments table, defect disposition card and full-screen evidence view.
  - Quality home screen, fabric inspections module and `json-server` database for the module.
- **Production Batches context:**
  - Context directory structure, `main.js` and `router.js` integration and create production batch view.
- **Report Analytics and Alerts:**
  - Dashboard components (stat cards, batches stage, batch progress, production chart, export report modal) and alerts components.
  - Production store and alerts and dashboard organized under the DDD structure.
- **Deployment:**
  - Firebase Hosting configuration (`firebase.json`) and scripts to run the fake API in a hosted environment (`npm run start:api`).
  - Route rewrites in `server/routes.json` and connection of the frontend with the hosted fake API.
  - Additional test records in the `json-server` database.
- Fabric favicon.

### Fixed
- Application startup and dependency errors after merging the feature branches; package lockfile synchronized.
- Route and view wiring in `app.vue`.
- Dashboard graphics.
- English and Spanish language errors in the Quality module.

## [1.0.0] - 2026-09-18

### Added
- **Project foundation:**
  - Vue 3 and Vite application with Vue Router, Axios and PrimeVue.
  - Domain-Driven Design directory structure with bounded contexts organized by Domain, Application, Infrastructure and Presentation layers.
  - `BaseEndpoint` and base API client in the `shared` context.
  - `json-server` fake API setup and environment variables for the API base URL.
  - Initial `README.md`, user stories and `LICENSE.md`.
