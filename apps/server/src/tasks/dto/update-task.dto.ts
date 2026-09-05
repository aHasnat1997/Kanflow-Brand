import { PartialType } from "@nestjs/mapped-types";
import { CreateTaskDto } from "./create-task.dto";

/**
 * DTO for editing a task's title or description.
 * All fields from {@link CreateTaskDto} are made optional via PartialType.
 */
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
