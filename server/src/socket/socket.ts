import { Server, Socket } from "socket.io";
import { createServer, Server as HttpServer } from "http";

class SocketService {
  private io: Server;

  constructor(httpServer: HttpServer, corsOrigin: string) {
    this.io = new Server(httpServer, {
      cors: {
        origin: [corsOrigin],
      },
    });
  }

  public async initialize(): Promise<void> {
    this.io.on("connection", (socket: Socket) => {
      console.log(`Client connected with id: ${socket.id}`);
      this.setupSocketListeners(socket);
    });
  }

  private setupSocketListeners(socket: Socket): void {
    socket.on("Hello-Event", (name1, name2, obj) => {
      console.log(name1, name2, obj);
    });
    this.joinRoom(socket, "testRoom").then((message) => {
      console.log(message);
    });
    this.emitEventToSocket(socket, "Welcome-Event", { message: "Welcome to the server!" });
  }

  public async joinRoom(socket: Socket, roomName: string): Promise<string> {
    socket.join(roomName);
    const message = `Socket ${socket.id} joined room ${roomName}`;
    console.log(message);
    return message;
  }

  public emitEventToRoom(roomName: string, eventName: string, data: any): void {
    this.io.to(roomName).emit(eventName, data);
  }

  public emitEventToSocket(socket: Socket, eventName: string, data: any): void {
    socket.emit(eventName, data);
  }

  public broadcastEvent(eventName: string, data: any): void {
    this.io.emit(eventName, data);
  }
}

export default SocketService;
