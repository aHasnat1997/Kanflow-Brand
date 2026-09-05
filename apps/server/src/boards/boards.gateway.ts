import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class BoardsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(BoardsGateway.name);

  handleConnection(client: Socket) {
    this.logger.debug(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("joinBoard")
  handleJoinBoard(
    @ConnectedSocket() client: Socket,
    @MessageBody() boardId: string,
  ) {
    client.join(`board:${boardId}`);
    this.logger.debug(`Client ${client.id} joined board:${boardId}`);
    return { event: "joined", data: boardId };
  }

  @SubscribeMessage("leaveBoard")
  handleLeaveBoard(
    @ConnectedSocket() client: Socket,
    @MessageBody() boardId: string,
  ) {
    client.leave(`board:${boardId}`);
    this.logger.debug(`Client ${client.id} left board:${boardId}`);
    return { event: "left", data: boardId };
  }

  /**
   * Broadcasts an event to all clients in a board room.
   */
  broadcastToBoard(boardId: string, event: string, payload: any) {
    this.server.to(`board:${boardId}`).emit(event, payload);
  }
}
