import { createServer } from "http";
import SocketService from "./services/SocketService";
import AuthService from "./services/AuthService";
import Admin from "./modules/Admin/Admin";
import { Role } from "./common/types";
import { Socket } from "socket.io";
import Employee from "./modules/Employee/Employee";
import { recommendationService } from "./engine/services/RecommendationService";
import Chef from "./modules/Chef/Chef";
import { recommendationEngine } from "./engine";

const server = createServer();
export default function main() {
  const socketService = SocketService.getInstance(server);
  socketService.initialize();

  socketService.onConnection((socket) => {
    socket.on("getUserDetail", async (data, callback) => {
      try {
        const { employeeID, password } = data;
        const userDetail: any = await AuthService.getUserDetail(
          employeeID,
          password
        );
        console.log(userDetail);
        if (userDetail) {
          const role = userDetail.role;
          navigateToClass(role as Role, socketService, socket);

          if (role == Role.Employee) {
            console.log("inside employees emit Room if");
            SocketService.joinRoom(socket, "employees");
          }

          callback({ userDetail: userDetail, message: "valid user" });
        } else if (userDetail == null) {
          callback({ userDetail: null, message: "Invalid Credianlts" });
        } else {
          callback({ userDetail: null, message: "Error Validating User" });
          console.log(userDetail);
        }
      } catch (error) {
        callback({ userDetail: null, message: "Internal server error" });
        console.error("Error retrieving user role:", error);
      }
    });

    // socket.on(
    //   "setUserDetail",
    //   (userDetail, callback: (response: any) => void) => {
    //     console.log(
    //       `Client with id ${socket.id} set role to ${userDetail.role}`
    //     );
    //     navigateToClass(userDetail.role, socketService, socket);
    //     // if ((role = Role.Employee)) {
    //     //   SocketService.joinRoom(socket, "employees");
    //     // }
    //     callback(userDetail);
    //     console.log(`Role set to ${userDetail.role}, handlers registered`);
    //   }
    // );

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
  // recommendationEngine.registerHandlers(socketService, socket);

  // recommendationEngine.generateDailyRecommendation((data: any) => {
  //   console.log(data);
  // });
  switch (role) {
    case Role.Admin:
      Admin.registerHandlers(socketService, socket);
      break;
    case Role.Employee:
      Employee.registerHandlers(socketService, socket);
      break;
    case Role.Chef:
      Chef.registerHandlers(socketService, socket);
      break;
    default:
      console.log(`Unknown role: ${role}`);
  }
}

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
