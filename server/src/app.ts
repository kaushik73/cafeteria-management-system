import { createServer } from "http";
import SocketService from "./services/SocketService";
import AuthService from "./services/AuthService";
import Admin from "./modules/Admin/Admin";
import { Role } from "./common/types";
import { Socket } from "socket.io";
import Employee from "./modules/Employee/Employee";
// import { Employee } from "./modules/Employee/Employee";
// import { Chef } from "./modules/Chef/Chef";

const server = createServer();
export default function main() {
  const socketService = SocketService.getInstance(server);
  socketService.initialize();

  socketService.onConnection((socket) => {
    socket.on("getUserRole", async (data, callback) => {
      try {
        const { employeeID, password } = data;
        const role = await AuthService.getUserRole(employeeID, password);
        callback({ role });
      } catch (error) {
        callback({ error: "Internal server error" });
        console.error("Error retrieving user role:", error);
      }
    });

    socket.on("setRole", (role: Role, callback: (response: any) => void) => {
      console.log(`Client with id ${socket.id} set role to ${role}`);
      navigateToClass(role, socketService, socket);
      // if ((role = Role.Employee)) {
      //   SocketService.joinRoom(socket, "employees");
      // }
      callback("success");
      console.log(`Role set to ${role}, handlers registered`);
    });

    socket.on("disconnect", (reason) => {
      console.log(
        `Client disconnected with id: ${socket.id}, reason: ${reason}`
      );
    });
  });
}
function navigateToClass(
  role: Role,
  socketService: SocketService,
  socket: Socket
) {
  switch (role) {
    case Role.Admin:
      Admin.registerHandlers(socketService, socket);
      break;
    case Role.Employee:
      Employee.registerHandlers(socketService, socket);
      break;
    // case Role.Chef:
    //   Chef.registerHandlers(socketService, socket);
    //   break;
    default:
      console.log(`Unknown role: ${role}`);
  }
}

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
