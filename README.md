# Kanflow

Kanflow is a modern, full-stack Kanban board application designed to help teams and individuals organize their work seamlessly. Built with a focus on a premium user experience and real-time collaboration, Kanflow offers an intuitive interface for managing tasks, tracking progress, and working together effectively.

## ✨ Features

- **Real-time Collaboration**: WebSocket integration ensures that updates to boards, columns, and tasks are instantly reflected across all connected clients.
- **Drag & Drop**: Fluid and responsive drag-and-drop interface for moving tasks between columns using `@dnd-kit`.
- **Role-based Access Control**: Share boards with users by assigning them `OWNER`, `EDITOR`, or `VIEWER` roles.
- **Access Requests**: Users with view-only access can request edit permissions, which owners can approve in real time.
- **Activity History**: A detailed history drawer tracks all major actions (task creation, movement, user joins) on a board.
- **Authentication**: Secure JWT-based authentication system with HTTP-only cookies.
- **Premium Design**: Built with Next.js, Tailwind CSS, and headless accessible UI components for a modern, beautiful aesthetic.

## 🛠️ Tech Stack

### Frontend (Workspace: `apps/web`)
- **Framework**: Next.js 16 (App Router, Turbopack) & React 19
- **Styling**: Tailwind CSS v4
- **Components**: `@base-ui/react`, Radix UI primitives, and `lucide-react` icons
- **Form Handling**: React Hook Form with Zod validation
- **Data Fetching**: Native Fetch API with custom wrappers
- **Real-time**: `socket.io-client`

### Backend (Workspace: `apps/server`)
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma (Workspace: `packages/db`)
- **Real-time**: Socket.io / `@nestjs/websockets`
- **Validation**: `class-validator` & Zod

### Tooling
- **Package Manager**: Bun (Monorepo Workspaces)
- **Containerization**: Docker & Docker Compose

## 🚀 Getting Started

### Option 1: Run with Docker (Recommended)

The easiest way to get the application up and running is using Docker Compose. This will spin up the Next.js frontend, NestJS backend, and a PostgreSQL database all pre-configured to communicate with each other.

1. Clone the repository and navigate to the project root.
2. Build and start the containers:
   ```bash
   docker compose up --build
   ```
   *Note: Add `-d` to run in detached mode.*
3. Access the application:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5000

If you need to tear down the environment and reset the database:
```bash
docker compose down -v
```

### Option 2: Local Development Setup

If you prefer to run the applications directly on your host machine for development:

#### Prerequisites
- [Bun](https://bun.sh/) installed
- PostgreSQL database running locally (or remotely)

#### 1. Install Dependencies
From the root of the project, install all workspace dependencies:
```bash
bun install
```

#### 2. Environment Variables
To get the backend and database working, you need an environment configuration. We've provided an example file.

Copy the `.env.example` to `.env` in the root of the project:
```bash
cp .env.example .env
```

Ensure the variables inside `.env` match your local environment. In particular, check that:
- `DATABASE_URL` points to a valid PostgreSQL database. If you don't have a local Postgres instance running, you can start a standalone one with Docker:
  ```bash
  docker run -d --name kanflow-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=postgres -p 5432:5432 postgres
  ```
- `JWT_SECRET` is set to a secure string (minimum 32 characters) for authentication.
- `NEXT_PUBLIC_SERVER_URL` matches where the backend is running (`http://localhost:5000` by default).

#### 3. Database Migration
Run the Prisma migrations to set up your database schema:
```bash
cd packages/db
bunx prisma generate
bunx prisma db push
cd ../..
```

#### 4. Start the Development Servers
You can start both the frontend and backend simultaneously from the root using:
```bash
bun run dev
```

Alternatively, you can run them individually:
- **Backend**: `cd apps/server && bun run dev` (Runs on port 5000)
- **Frontend**: `cd apps/web && bun run dev` (Runs on port 3000)

## 📁 Project Structure

This project uses a monorepo structure managed by Bun Workspaces:

```text
Kanflow-Brand/
├── apps/
│   ├── server/        # NestJS Backend API & WebSockets
│   └── web/           # Next.js Frontend Application
├── packages/
│   ├── config/        # Shared configuration (TypeScript, ESLint)
│   ├── db/            # Prisma Schema & generated client
│   ├── env/           # Shared environment variable validation
│   └── types/         # Shared TypeScript interfaces & DTOs
├── docker-compose.yml # Container orchestration
└── package.json       # Root workspace configuration
```
