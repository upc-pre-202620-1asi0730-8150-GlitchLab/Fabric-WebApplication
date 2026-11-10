# Fabric

Web application for garment and textile manufacturers: production batch tracking, quality control, machinery management, alerts and analytics. Built with Vue 3 and a domain-driven design (DDD) architecture.

Team: GlitchLab

## Roles

- **Production supervisor:** dashboard, production batches, machines, alerts and quality supervision.
- **Quality inspector:** inspection dashboard, new roll inspection, inspection parameters and shrinkage tests.

## Tech Stack

Vue 3, Vite, Pinia, Vue Router, Vue I18n (en/es), PrimeVue, Chart.js, Axios and json-server (mock API).

## Structure

```text
src/
  alerts/
  identity-access/
  machine-registration/
  production-batches/
  quality/
  report-analytics/
  shared/
```

Each bounded context is split into `domain`, `application`, `infrastructure` and `presentation`.

## Getting Started

```bash
npm install
npm run api   # mock API at http://localhost:3000
npm run dev   # app at http://localhost:5173
```

Environment variables are defined in `.env.development` and `.env.production`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run api` | Start the mock API |

## Documentation

- [Architecture Decision Records](docs/adrs.md)
- [Class diagram](docs/class-diagram.puml)
- [User stories](docs/user.stories.md)
- [Changelog](CHANGELOG.md)

## License

MIT. See [LICENSE.md](LICENSE.md).
