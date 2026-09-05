/**
 * @packageDocumentation
 * @module @Kanflow-Brand/types
 *
 * Shared domain type definitions for the Kanflow monorepo.
 * Consumed by both `apps/server` (return types, service signatures)
 * and `apps/web` (API client, component props, hooks).
 *
 * ⚠️  This package contains ONLY type definitions — no runtime code.
 * Do NOT import from `@Kanflow-Brand/db`, Prisma, or any runtime package here.
 */

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/** Role of a user within a board. */
export type UserRole = "OWNER" | "MEMBER" | "VIEWER";

// ---------------------------------------------------------------------------
// Domain entities
// ---------------------------------------------------------------------------

/**
 * A registered user in the system.
 * `passwordHash` is intentionally omitted — never exposed via API.
 */
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

/** A Kanban board owned by a user. */
export interface Board {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
}

/** Membership record linking a User to a Board with a role. */
export interface BoardMember {
  id: string;
  boardId: string;
  userId: string;
  role: UserRole;
  /** Populated when the member is fetched with its user relation. */
  user?: Pick<User, "id" | "email" | "name">;
}

/** A column within a Kanban board, positioned with a float for ordering. */
export interface Column {
  id: string;
  boardId: string;
  name: string;
  /** Float position used for ordering. Managed by `task-ordering.util.ts`. */
  position: number;
  createdAt: Date;
}

/** A task card within a column, positioned with a float for ordering. */
export interface Task {
  id: string;
  columnId: string;
  title: string;
  /** Optional longer description of the task. */
  description: string | null;
  /** Float position used for ordering. Managed by `task-ordering.util.ts`. */
  position: number;
  createdAt: Date;
}

// ---------------------------------------------------------------------------
// Composite / view types
// ---------------------------------------------------------------------------

/** Board enriched with its member list — used in list and share responses. */
export type BoardWithMembers = Board & {
  members: BoardMember[];
};

/** Column enriched with its ordered task list — used in board detail responses. */
export type ColumnWithTasks = Column & {
  tasks: Task[];
};

/**
 * Full board detail including columns and their tasks.
 * Returned by `GET /boards/:id`.
 */
export type BoardDetail = Board & {
  columns: ColumnWithTasks[];
  members: BoardMember[];
};

// ---------------------------------------------------------------------------
// Auth types
// ---------------------------------------------------------------------------

/**
 * Payload encoded inside the JWT.
 * `sub` holds the user's database `id`.
 */
export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

/**
 * The user object attached to `req.user` by PassportJS after JWT validation.
 * A subset of {@link User} — always available on authenticated routes.
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

/** Body returned by `POST /auth/register`. */
export interface RegisterResponse {
  user: User;
}

/** Body returned by `GET /auth/me`. */
export interface MeResponse {
  user: User;
}

// ---------------------------------------------------------------------------
// API error shape
// ---------------------------------------------------------------------------

/**
 * Standardised error response shape produced by the global exception filter.
 * Every non-2xx response from `apps/server` follows this structure.
 */
export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}
