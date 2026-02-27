# Dansk Metal App

<p align="center">
   <b>Tech Stack</b><br>
   <img src="https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
   <img src="https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
   <img src="https://img.shields.io/badge/SCSS-c6538c?style=for-the-badge&logo=sass&logoColor=white" alt="SCSS"/>
   <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint"/>
</p>

A modern web application for Dansk Metal, built with Next.js, TypeScript, and a robust set of tools for a seamless developer and user experience.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Styling](#styling)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** SCSS Modules, global SCSS
- **Linting:** ESLint
- **State/Logic:** React Hooks
- **API:** REST (configurable via environment variable)
- **Other:**
  - Modern React features (Server/Client Components)
  - Modular component structure

## Project Structure

```
.
├── public/                # Static assets (images, etc.)
├── src/
│   ├── app/               # Next.js app directory (routing, pages)
│   ├── components/        # Reusable UI components
│   ├── data/              # Static data (e.g., menu)
│   ├── hooks/             # Custom React hooks
│   ├── styles/            # SCSS styles (global, modules)
│   └── types/             # TypeScript type definitions
├── .env                   # Environment variables
├── eslint.config.mjs      # ESLint configuration
├── next.config.ts         # Next.js configuration
├── package.json           # Project metadata and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up environment variables:**
   - Copy `.env.example` to `.env` (if available) and configure as needed.
   - Example:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:3001/api
     ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Base URL for the backend API (must be public for Next.js frontend access).

## Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build for production
- `npm run start` — Start the production server
- `npm run lint` — Run ESLint

## Styling

- Uses SCSS modules for component-level styles (e.g., `header.module.scss`).
- Global styles and variables in `src/styles/`.

## API

- The app communicates with a REST API, base URL set via `NEXT_PUBLIC_API_URL`.
- API calls are managed via custom hooks (see `src/hooks/useApi.ts`).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## License

[MIT](LICENSE)
