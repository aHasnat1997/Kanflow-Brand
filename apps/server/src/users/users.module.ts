import { Module } from "@nestjs/common";
import { UsersRepository } from "./users.repository";

/** Provides user lookup functionality consumed by BoardsModule (sharing). */
@Module({
  providers: [UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
