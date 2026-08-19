# APIvault

APIvault is a modern, high-performance full-stack web application built with a Python (FastAPI) backend and a React (TypeScript + Vite + Tailwind CSS) frontend.

## 🚀 Features

- **Backend (API)**
  - ⚡ **FastAPI** for high-performance Python asynchronous API endpoints.
  - 🧰 **SQLModel & Pydantic** for type-safe ORM modeling, validation, and settings management.
  - 💾 **PostgreSQL** database backend with Alembic migrations.
  - 🔑 **JWT Authentication** & secure password hashing with Argon2/Bcrypt.
  - 📧 Automated email flows (Account Creation, Password Recovery) via Jinja2 templates & SMTP.

- **Frontend (Dashboard)**
  - ⚛️ **React 19 & TypeScript** with Vite for lightning-fast development & builds.
  - 🎨 **Tailwind CSS & Radix UI** for accessible, responsive UI components.
  - 🦇 Dark / Light theme support with seamless mode toggling.
  - 📡 Automatically generated type-safe API client via OpenAPI.

- **DevOps & Testing**
  - 🐋 **Docker Compose** setup for seamless local development and production deployments.
  - 🧪 **Pytest & Playwright** for unit, API, and end-to-end integration testing.

---

## 🛠️ Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [uv](https://github.com/astral-sh/uv) (for local Python package management)
- [bun](https://bun.sh/) or Node.js (for local frontend development)

### Quick Start with Docker

1. Clone the repository and navigate into the project directory:
   ```bash
   cd apivault
   ```

2. Configure environment variables in `.env` if needed:
   Check `.env` for `PROJECT_NAME`, `SECRET_KEY`, and database credentials.

3. Launch the development stack:
   ```bash
   docker compose up -d
   ```

4. Access the applications:
   - **Frontend Dashboard**: `http://localhost:5173`
   - **Backend API Docs**: `http://localhost:8000/docs`
   - **Mailcatcher (Local Email)**: `http://localhost:1080`
   - **Adminer (Database GUI)**: `http://localhost:8080`

---

## 🧪 Testing

### Backend Tests
To run backend unit and integration tests:
```bash
cd backend
uv run pytest
```

### Frontend Tests & Linting
To check types, run linters, or run Playwright tests:
```bash
cd frontend
bun run lint
bun run build
bun run test
```

---

## 📜 License

Private Project.
