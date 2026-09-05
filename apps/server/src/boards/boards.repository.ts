import { Injectable } from "@nestjs/common";
import prisma from "@Kanflow-Brand/db";
import type {
  Board as PrismaBoard,
  BoardMember as PrismaBoardMember,
} from "@Kanflow-Brand/db";

type BoardWithMembers = PrismaBoard & { members: PrismaBoardMember[] };

/**
 * Repository for Board and BoardMember persistence operations.
 * All Prisma calls for boards are centralised here.
 */
@Injectable()
export class BoardsRepository {
  /**
   * Returns all boards where the user is an owner or member, including members list.
   *
   * @param userId - The requesting user's ID
   * @returns Array of boards with their member lists
   */
  async findAllForUser(userId: string): Promise<BoardWithMembers[]> {
    return prisma.board.findMany({
      where: {
        members: { some: { userId } },
      },
      include: { members: true },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Finds a single board by ID, including its columns (ordered by position)
   * and each column's tasks (ordered by position).
   *
   * @param id - Board CUID
   * @returns Full board detail with nested columns/tasks, or `null`
   */
  async findById(id: string) {
    return prisma.board.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: { select: { id: true, email: true, name: true } },
          },
        },
        columns: {
          orderBy: { position: "asc" },
          include: {
            tasks: { orderBy: { position: "asc" } },
          },
        },
      },
    });
  }

  /**
   * Creates a board and the owner's BoardMember row in a single transaction.
   *
   * @param name - Board display name
   * @param ownerId - User ID of the creator
   * @returns The newly created board with its members
   */
  async create(name: string, ownerId: string): Promise<BoardWithMembers> {
    return prisma.board.create({
      data: {
        name,
        ownerId,
        members: {
          create: { userId: ownerId, role: "OWNER" },
        },
      },
      include: { members: true },
    });
  }

  /**
   * Looks up an existing BoardMember row for a (board, user) pair.
   *
   * @param boardId - Board CUID
   * @param userId - User CUID
   * @returns The membership record or `null`
   */
  async findMember(
    boardId: string,
    userId: string,
  ): Promise<PrismaBoardMember | null> {
    return prisma.boardMember.findUnique({
      where: { boardId_userId: { boardId, userId } },
    });
  }

  /**
   * Adds a new MEMBER row to a board.
   *
   * @param boardId - Board CUID
   * @param userId - User CUID to add
   * @returns The new BoardMember record
   */
  async addMember(boardId: string, userId: string): Promise<PrismaBoardMember> {
    return prisma.boardMember.create({
      data: { boardId, userId, role: "MEMBER" },
    });
  }

  async addMemberWithRole(boardId: string, userId: string, role: any): Promise<PrismaBoardMember> {
    return prisma.boardMember.create({
      data: { boardId, userId, role },
    });
  }

  async updateShareToken(boardId: string, token: string) {
    return prisma.board.update({
      where: { id: boardId },
      data: { shareToken: token },
    });
  }

  async findByShareToken(token: string) {
    return prisma.board.findUnique({
      where: { shareToken: token },
    });
  }

  async createAccessRequest(boardId: string, userId: string) {
    return prisma.boardAccessRequest.create({
      data: { boardId, userId },
    });
  }

  async findAccessRequests(boardId: string) {
    return prisma.boardAccessRequest.findMany({
      where: { boardId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateAccessRequest(reqId: string, status: any) {
    return prisma.boardAccessRequest.update({
      where: { id: reqId },
      data: { status },
    });
  }

  async updateMemberRole(boardId: string, userId: string, role: any) {
    return prisma.boardMember.update({
      where: { boardId_userId: { boardId, userId } },
      data: { role },
    });
  }
}
