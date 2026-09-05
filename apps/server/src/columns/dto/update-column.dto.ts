import { PartialType } from "@nestjs/mapped-types";
import { CreateColumnDto } from "./create-column.dto";

/**
 * DTO for updating a column. All fields from {@link CreateColumnDto} are optional.
 * Uses NestJS `PartialType` to avoid redefining validators.
 */
export class UpdateColumnDto extends PartialType(CreateColumnDto) {}
