import { Module } from "@nestjs/common";
import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";
import { TasksRepository } from "./tasks.repository";
import { BoardsModule } from "../boards/boards.module";

/** Manages task CRUD and cross-column moves. Ordering via task-ordering.util.ts. */
@Module({
  imports: [BoardsModule],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository],
})
export class TasksModule {}
