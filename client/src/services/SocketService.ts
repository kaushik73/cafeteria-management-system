import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket;

  constructor(serverUrl: string) {
    this.socket = io(serverUrl, {
      transports: ["websocket"],
      timeout: 200000, // 20 sec
    });
  }

  public async connect(): Promise<Socket> {
    return new Promise((resolve, reject) => {
      this.socket.on("connect", () => {
        console.log(`Connected with id: ${this.socket.id}`);
        resolve(this.socket);
      });

      this.socket.on("connect_error", (error) => {
        console.error("Connection error:", error);
        reject(error);
      });

      this.socket.on("disconnect", (reason) => {
        console.warn("Disconnected from server:", reason);
      });
    });
  }

  public onEvent(eventName: string, callback: (data: any) => void): void {
    this.socket.on(eventName, (data) => {
      console.log(`TESTING : Received event ${eventName} with data:`, data);
      callback(data);
    });
  }

  public emitEvent<T>(
    eventName: string,
    data: any,
    callback: (response: T) => void
  ): void {
    this.socket.emit(eventName, data, (response: T) => {
      console.log(`TESTING - Emitted event ${eventName} with data:`, data);
      callback(response);
    });
  }
}

export const socketService = new SocketService("http://localhost:3001"); // server URL
