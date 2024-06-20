import { Socket } from "socket.io";
import { Menu } from "../../models/Menu";
import MenuService from "../../services/MenuService";
import SocketService from "../../services/SocketService";
import AuthService from "../../services/AuthService";
import { Role } from "../../common/types";
import Admin from "../Admin/Admin";
import Employee from "../Employee/Employee";
import Chef from "../Chef/Chef";

export default class User {
  static socketService: SocketService;
  static socket: Socket;
  static registerHandlers(socketService: SocketService, socket: Socket) {
    console.log("in registerHandlers user");
    User.socket = socket;
    User.socketService = socketService;
    socketService.registerEventHandler(socket, "logout", User.handleLogout);
    socketService.registerEventHandler(socket, "login", User.login);
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

  static async getMenuIdFromName(
    data: string,
    callback: (response: any) => void
  ) {
    try {
      const result: Menu = await MenuService.getMenuIdFromName(data);
      console.log({ message: result.menu_id }, "itemID");

      callback({ message: result.menu_id });
    } catch (error) {
      callback({ message: "Error fetching itemID" });
      console.error("Error fetching itemID:", error);
    }
  }

  static async handleLogout(data: any, callback: any) {
    try {
      console.log("handleLogout- server", data);

      await AuthService.logOut(data.userDetail);
      callback({ message: "log out successfull" });
    } catch (error) {}
  }

  static async login(data: any, callback: any) {
    try {
      const { employeeID, password } = data;
      const userDetail: any = await AuthService.login(employeeID, password);
      console.log(userDetail);
      if (userDetail) {
        const role = userDetail.role;
        User.navigateToClass(role as Role, User.socketService, User.socket);

        // if (role == Role.Employee) {
        //   console.log("inside employees emit Room if");
        //   SocketService.joinRoom(user.socket, "employees");
        // }

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
  }

  static navigateToClass(
    role: Role,
    socketService: SocketService,
    socket: Socket
  ) {
    // recommendationEngine.registerHandlers(socketService, socket);

    // recommendationEngine.getNextDayRecommendation((data: any) => {
    //   console.log("data", data);
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
}
