import { Injectable } from "@nestjs/common";
import prisma from "@Kanflow-Brand/db";
import type { User as PrismaUser } from "@Kanflow-Brand/db";

type UserCreateInput = {
  email: string;
  name: string;
  passwordHash: string;
};

/**
 * Repository layer for User persistence operations.
 * Wraps all Prisma queries for the User model — no business logic here.
 */
@Injectable()
export class AuthRepository {
  /**
   * Finds a user by their email address (case-insensitive lookup handled by DB).
   *
   * @param email - The email to search for
   * @returns The full user record including `passwordHash`, or `null` if not found
   */
  async findByEmail(email: string): Promise<PrismaUser | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  /**
   * Creates a new user record in the database.
   *
   * @param data - The user fields to persist (passwordHash must already be hashed)
   * @returns The newly created user record
   */
  async createUser(data: UserCreateInput): Promise<PrismaUser> {
    return prisma.user.create({ data });
  }

  /**
   * Finds a user by their ID, selecting only public fields (no passwordHash).
   *
   * @param id - The user's CUID
   * @returns Partial user (id, email, name, createdAt) or `null` if not found
   */
  async findById(
    id: string,
  ): Promise<Pick<PrismaUser, "id" | "email" | "name" | "createdAt"> | null> {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, createdAt: true },
    });
  }
}
