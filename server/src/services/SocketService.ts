import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";

export default class SocketService {
  private static instance: SocketService;
  private io: Server;

  private constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: "http://localhost:3000",
        credentials: true,
      },
    });
  }

  public static getInstance(httpServer: HttpServer): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService(httpServer);
    }
    return SocketService.instance;
  }

  public initialize() {
    this.io.on("connection", (socket: Socket) => {
      console.log(`Client connected with id: ${socket.id}`);
    });
  }

  public onConnection(callback: (socket: Socket) => void) {
    this.io.on("connection", callback);
  }

  registerEventHandler(
    socket: Socket,
    event: string,
    handler: (data: any, callback: any) => void
  ) {
    console.log(`Registering event handler for ${event}`);
    socket.on(event, (data: any, callback) => {
      handler(data, callback);
    });
  }

  static rooms: { [key: string]: Set<Socket> } = {};

  static joinRoom(socket: Socket, room: string) {
    if (!SocketService.rooms[room]) {
      SocketService.rooms[room] = new Set();
    }
    SocketService.rooms[room].add(socket);
    socket.on("disconnect", () => {
      SocketService.rooms[room].delete(socket);
      if (SocketService.rooms[room].size === 0) {
        delete SocketService.rooms[room];
      }
    });
  }

  static emitToRoom(room: string, event: string, message: any) {
    if (SocketService.rooms[room]) {
      SocketService.rooms[room].forEach((socket) => {
        socket.emit(event, message);
      });
    }
  }
  // static emitToRoom1(room: string, event: string, message: string) {
  //   io.to(room).emit(event, message);
  // }
}
