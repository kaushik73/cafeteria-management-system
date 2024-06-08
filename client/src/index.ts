import SocketService from "./socket/socket";

class ClientApp {
  private socketService: SocketService;

  constructor(serverUrl: string) {
    this.socketService = new SocketService(serverUrl);
    this.configureSocket();
  }

  private async configureSocket() {
    const socket = await this.socketService.connect();
    this.socketService.emitEvent("Hello-Event", { message: "Hi, Check", additionalData: { 1: "a" } });

    this.socketService.onEvent("Welcome-Event", (data) => {
      console.log("Welcome-Event received:", data);
    });

    this.socketService.onEvent("Room-Event", (data) => {
      console.log("Room-Event received:", data);
    });

    this.socketService.onEvent("Broadcast-Event", (data) => {
      console.log("Broadcast-Event received:", data);
    });
  }
}

const clientApp = new ClientApp("http://localhost:3000");
