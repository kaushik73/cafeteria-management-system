import { Socket } from "socket.io";
import { Menu } from "../../models/Menu";
import MenuService from "../../services/MenuService";
import SocketService from "../../services/SocketService";
import AuthService from "../../services/AuthService";
import { Role } from "../../common/types";
import Admin from "../Admin/Admin";
import Employee from "../Employee/Employee";
import Chef from "../Chef/Chef";
import { Response } from "../../common/types";

export default class User {
  static socketService: SocketService;
  static socket: Socket;
  static registerHandlers(socketService: SocketService, socket: Socket) {
    User.socket = socket;
    User.socketService = socketService;
    socketService.registerEventHandler(socket, "logout", User.handleLogout);
    socketService.registerEventHandler(socket, "login", User.handleLogin);
  }

  static async handleShowMenuItems(
    data: Object,
    callback: (response: any) => void
  ) {
    try {
      console.log(data, "from handleShowMenuItems");

      const menuItems = await MenuService.showMenuItems(data);
      console.log({ message: menuItems });

      callback({ message: menuItems });
    } catch (error) {
      callback({ message: "Error getting menu items" });
      console.error("Error getting menu items:", error);
    }
  }

  static async handleLogout(data: any, callback: any) {
    try {
      console.log("handleLogout- server", data);

      await AuthService.logOut(data.userDetail);
      callback({ message: "log out successfull" });
    } catch (error) {}
  }

  static async handleLogin(
    data: any,
    callback: (response: Response<{ userDetail: User | null }>) => void
  ) {
    try {
      const { employeeID, password } = data;
      const userDetail: any = await AuthService.login(employeeID, password);
      if (userDetail) {
        const role = userDetail.role;
        User.navigateToClass(role as Role, User.socketService, User.socket);

        callback({
          status: "success",
          data: { userDetail: userDetail },
          message: "Valid user",
        });
      } else {
        callback({
          status: "error",
          data: { userDetail: null },
          message: "Invalid Credentials",
        });
      }
    } catch (error) {
      console.error("Error during login process:", error);
      callback({
        status: "error",
        data: { userDetail: null },
        message: "An error occurred during login",
      });
    }
  }

  static navigateToClass(
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
      case Role.Chef:
        Chef.registerHandlers(socketService, socket);
        break;
      default:
        console.log(`Unknown role: ${role}`);
    }
  }
}
