import { Module } from "@nestjs/common";
import { ColumnsController } from "./columns.controller";
import { ColumnsService } from "./columns.service";
import { ColumnsRepository } from "./columns.repository";
import { BoardsModule } from "../boards/boards.module";

/** Manages column CRUD operations within boards. */
@Module({
  imports: [BoardsModule],
  controllers: [ColumnsController],
  providers: [ColumnsService, ColumnsRepository],
})
export class ColumnsModule {}
