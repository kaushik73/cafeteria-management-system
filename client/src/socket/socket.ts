import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket;

  constructor(serverUrl: string) {
    this.socket = io(serverUrl);
  }

  public async connect(): Promise<Socket> {
    return new Promise((resolve) => {
      this.socket.on("connect", () => {
        console.log(`Connected with id: ${this.socket.id}`);
        resolve(this.socket);
      });
    });
  }

  public onEvent(eventName: string, callback: (data: any) => void): void {
    this.socket.on(eventName, (data) => {
      console.log(`Received event ${eventName} with data:`, data);
      callback(data);
    });
  }

  public emitEvent(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
    console.log(`Emitted event ${eventName} with data:`, data);
  }
}

export default SocketService;
