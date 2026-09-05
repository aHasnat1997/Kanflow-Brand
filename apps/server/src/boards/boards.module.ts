import { Module } from "@nestjs/common";
import { BoardsController } from "./boards.controller";
import { BoardsService } from "./boards.service";
import { BoardsRepository } from "./boards.repository";
import { UsersModule } from "../users/users.module";
import { BoardsGateway } from "./boards.gateway";
import { ActivityLoggerService } from "./activity-logger.service";

/** Manages board CRUD and sharing. Depends on UsersModule for email lookup. */
@Module({
  imports: [UsersModule],
  controllers: [BoardsController],
  providers: [BoardsService, BoardsRepository, BoardsGateway, ActivityLoggerService],
  exports: [BoardsService, BoardsGateway, ActivityLoggerService],
})
export class BoardsModule {}
