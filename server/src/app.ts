import { createServer } from "http";
import SocketService from "./services/SocketService";
import User from "./modules/User/User";

const server = createServer();
export default function main() {
  const socketService = SocketService.getInstance(server);
  socketService.initialize();

  socketService.onConnection((socket) => {
    User.registerHandlers(socketService, socket);

    socket.on("disconnect", (reason) => {
      console.log(
        `Client disconnected with id: ${socket.id}, reason: ${reason}`
      );
    });
  });
}

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
