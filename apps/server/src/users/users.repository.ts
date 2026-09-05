import { Injectable } from "@nestjs/common";
import prisma from "@Kanflow-Brand/db";
import type { User as PrismaUser } from "@Kanflow-Brand/db";

/**
 * Repository for User read operations.
 * Auth writes (create) live in {@link AuthRepository}.
 */
@Injectable()
export class UsersRepository {
  /**
   * Finds a user by their CUID, returning only public fields.
   *
   * @param id - The user's CUID
   * @returns Partial user record or `null`
   */
  async findById(
    id: string,
  ): Promise<Pick<PrismaUser, "id" | "email" | "name" | "createdAt"> | null> {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, createdAt: true },
    });
  }

  /**
   * Finds a user by email, returning only public fields.
   * Used by board sharing (no passwordHash needed).
   *
   * @param email - The email to look up
   * @returns Partial user record or `null`
   */
  async findByEmail(
    email: string,
  ): Promise<Pick<PrismaUser, "id" | "email" | "name" | "createdAt"> | null> {
    return prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, createdAt: true },
    });
  }
}
