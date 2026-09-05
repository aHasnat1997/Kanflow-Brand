import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { BoardsService } from "./boards.service";
import { CreateBoardDto } from "./dto/create-board.dto";
import { ShareBoardDto } from "./dto/share-board.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { BoardAccessGuard } from "../common/guards/board-access.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import type { AuthUser, BoardWithMembers, BoardDetail } from "@Kanflow-Brand/types";

import { ActivityLoggerService } from "./activity-logger.service";

/**
 * HTTP interface for board management.
 * All routes require JWT authentication; board-specific routes also
 * require the {@link BoardAccessGuard}.
 */
@Controller("boards")
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly activityLogger: ActivityLoggerService,
  ) {}

  /** Returns all boards the user owns or is a member of. */
  @Get()
  async getBoards(@CurrentUser() user: AuthUser): Promise<BoardWithMembers[]> {
    return this.boardsService.getBoards(user.id);
  }

  /** Creates a new board and records the creator as OWNER. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBoard(
    @Body() dto: CreateBoardDto,
    @CurrentUser() user: AuthUser,
  ): Promise<BoardWithMembers> {
    return this.boardsService.createBoard(dto, user);
  }

  /** Returns full board detail (columns + tasks). */
  @Get(":id")
  @UseGuards(BoardAccessGuard)
  async getBoardDetail(@Param("id") id: string): Promise<BoardDetail> {
    return this.boardsService.getBoardDetail(id);
  }

  /** Shares the board with another user by email. */
  @Post(":id/share")
  @UseGuards(BoardAccessGuard)
  @HttpCode(HttpStatus.OK)
  async shareBoard(
    @Param("id") id: string,
    @Body() dto: ShareBoardDto,
  ): Promise<{ message: string }> {
    return this.boardsService.shareBoard(id, dto);
  }

  /** Gets the activity logs for a board. */
  @Get(":id/activity")
  @UseGuards(BoardAccessGuard)
  async getBoardActivity(@Param("id") id: string) {
    return this.activityLogger.getLogs(id);
  }

  /** Gets or generates the share token for a board. */
  @Get(":id/share-token")
  @UseGuards(BoardAccessGuard)
  async getShareToken(@Param("id") id: string) {
    return this.boardsService.getShareToken(id);
  }

  /** Joins a board via share token. */
  @Get("join/:token")
  async joinViaToken(
    @Param("token") token: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.boardsService.joinViaToken(token, user);
  }

  /** Requests edit access for a board. */
  @Post(":id/access-requests")
  @UseGuards(BoardAccessGuard)
  async requestEditAccess(
    @Param("id") id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.boardsService.requestEditAccess(id, user);
  }

  /** Gets all access requests for a board. */
  @Get(":id/access-requests")
  @UseGuards(BoardAccessGuard)
  async getAccessRequests(@Param("id") id: string) {
    return this.boardsService.getAccessRequests(id);
  }

  /** Approves or rejects an access request. */
  @Patch(":id/access-requests/:reqId")
  @UseGuards(BoardAccessGuard)
  async updateAccessRequest(
    @Param("id") id: string,
    @Param("reqId") reqId: string,
    @Body() body: { status: "APPROVED" | "REJECTED" },
  ) {
    return this.boardsService.updateAccessRequest(id, reqId, body.status);
  }
}
