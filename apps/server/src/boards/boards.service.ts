/**
 * @module BoardsService
 *
 * Business logic for board lifecycle operations: listing, creating, and sharing.
 * Access control (who can see/act on a board) is enforced by {@link BoardAccessGuard}.
 */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import type { BoardWithMembers, BoardDetail, AuthUser } from "@Kanflow-Brand/types";
import type { CreateBoardDto } from "./dto/create-board.dto";
import type { ShareBoardDto } from "./dto/share-board.dto";
import { BoardsRepository } from "./boards.repository";
import { UsersRepository } from "../users/users.repository";
import { BoardsGateway } from "./boards.gateway";

@Injectable()
export class BoardsService {
  constructor(
    private readonly boardsRepository: BoardsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly boardsGateway: BoardsGateway,
  ) {}

  /**
   * Returns all boards the requesting user owns or is a member of,
   * ordered by most recently created.
   *
   * @param userId - The requesting user's ID
   * @returns Array of {@link BoardWithMembers}
   */
  async getBoards(userId: string): Promise<BoardWithMembers[]> {
    const boards = await this.boardsRepository.findAllForUser(userId);
    return boards.map((b) => ({
      id: b.id,
      name: b.name,
      ownerId: b.ownerId,
      createdAt: b.createdAt,
      members: b.members.map((m) => ({
        id: m.id,
        boardId: m.boardId,
        userId: m.userId,
        role: m.role as "OWNER" | "MEMBER",
      })),
    }));
  }

  /**
   * Creates a new board and records the creator as an OWNER member.
   * Both operations run atomically via a Prisma nested write.
   *
   * @param dto - Board creation data
   * @param user - The authenticated user who becomes the owner
   * @returns The newly created {@link BoardWithMembers}
   */
  async createBoard(dto: CreateBoardDto, user: AuthUser): Promise<BoardWithMembers> {
    const board = await this.boardsRepository.create(dto.name, user.id);
    return {
      id: board.id,
      name: board.name,
      ownerId: board.ownerId,
      createdAt: board.createdAt,
      members: board.members.map((m) => ({
        id: m.id,
        boardId: m.boardId,
        userId: m.userId,
        role: m.role as "OWNER" | "MEMBER",
      })),
    };
  }

  /**
   * Returns the full detail of a board including ordered columns and tasks.
   * Used by the board detail page. Access already verified by {@link BoardAccessGuard}.
   *
   * @param boardId - Board CUID
   * @returns {@link BoardDetail} with nested columns and tasks
   * @throws {NotFoundException} 404 if the board doesn't exist
   */
  async getBoardDetail(boardId: string): Promise<BoardDetail> {
    const board = await this.boardsRepository.findById(boardId);
    if (!board) throw new NotFoundException("Board not found");

    return {
      id: board.id,
      name: board.name,
      ownerId: board.ownerId,
      createdAt: board.createdAt,
      members: board.members.map((m) => ({
        id: m.id,
        boardId: m.boardId,
        userId: m.userId,
        role: m.role as "OWNER" | "MEMBER",
        user: m.user,
      })),
      columns: board.columns.map((col) => ({
        id: col.id,
        boardId: col.boardId,
        name: col.name,
        position: col.position,
        createdAt: col.createdAt,
        tasks: col.tasks.map((t) => ({
          id: t.id,
          columnId: t.columnId,
          title: t.title,
          description: t.description,
          position: t.position,
          createdAt: t.createdAt,
        })),
      })),
    };
  }

  /**
   * Adds a user as a MEMBER of a board by their email address.
   *
   * @param boardId - Board CUID
   * @param dto - Contains the email of the user to invite
   * @returns A success message object
   * @throws {NotFoundException} 404 if no user with that email exists
   * @throws {ConflictException} 409 if the user is already a member
   */
  async shareBoard(
    boardId: string,
    dto: ShareBoardDto,
  ): Promise<{ message: string }> {
    const targetUser = await this.usersRepository.findByEmail(dto.email);
    if (!targetUser) {
      throw new NotFoundException("No user found with that email address");
    }

    const existing = await this.boardsRepository.findMember(boardId, targetUser.id);
    if (existing) {
      throw new ConflictException("User is already a member of this board");
    }

    await this.boardsRepository.addMember(boardId, targetUser.id);
    this.boardsGateway.broadcastToBoard(boardId, "boardUpdate", {});
    return { message: `${targetUser.email} has been added to the board` };
  }

  /**
   * Generates or retrieves a share token for a board.
   */
  async getShareToken(boardId: string): Promise<{ token: string }> {
    let board = await this.boardsRepository.findById(boardId);
    if (!board) throw new NotFoundException("Board not found");

    if (!board.shareToken) {
      const crypto = require("crypto");
      const token = crypto.randomBytes(16).toString("hex");
      board = await this.boardsRepository.updateShareToken(boardId, token);
    }
    return { token: board.shareToken! };
  }

  /**
   * Joins a board using a share token. Automatically grants VIEWER access.
   */
  async joinViaToken(token: string, user: AuthUser): Promise<{ boardId: string }> {
    const board = await this.boardsRepository.findByShareToken(token);
    if (!board || !board.linkSharingEnabled) {
      throw new NotFoundException("Invalid or disabled share link");
    }

    const existing = await this.boardsRepository.findMember(board.id, user.id);
    if (!existing) {
      await this.boardsRepository.addMemberWithRole(board.id, user.id, "VIEWER");
      this.boardsGateway.broadcastToBoard(board.id, "boardUpdate", {});
    }

    return { boardId: board.id };
  }

  /**
   * Creates a request for edit access.
   */
  async requestEditAccess(boardId: string, user: AuthUser) {
    const existing = await this.boardsRepository.findMember(boardId, user.id);
    if (!existing || existing.role !== "VIEWER") {
      throw new ConflictException("You are not a viewer of this board");
    }

    const request = await this.boardsRepository.createAccessRequest(boardId, user.id);
    this.boardsGateway.broadcastToBoard(boardId, "boardUpdate", {});
    return request;
  }

  /**
   * Lists all pending access requests for a board.
   */
  async getAccessRequests(boardId: string) {
    return this.boardsRepository.findAccessRequests(boardId);
  }

  /**
   * Approves or rejects an access request.
   */
  async updateAccessRequest(boardId: string, reqId: string, status: "APPROVED" | "REJECTED") {
    const request = await this.boardsRepository.updateAccessRequest(reqId, status);
    if (status === "APPROVED") {
      await this.boardsRepository.updateMemberRole(boardId, request.userId, "MEMBER");
    }
    this.boardsGateway.broadcastToBoard(boardId, "boardUpdate", {});
    return request;
  }
}
