import { Socket } from "socket.io";
import { Menu } from "../../models/Menu";
import MenuService from "../../services/MenuService";
import SocketService from "../../services/SocketService";
import AuthService from "../../services/AuthService";
import { Role } from "../../common/types";
import Admin from "../Admin/Admin";
import Employee from "../Employee/Employee";
import Chef from "../Chef/Chef";
import { IUser } from "../../models/User";

export default class User {
  static socketService: SocketService;
  static socket: Socket;
  static registerHandlers(socketService: SocketService, socket: Socket) {
    console.log("in registerHandlers user");
    User.socket = socket;
    User.socketService = socketService;
    socketService.registerEventHandler(socket, "login", User.handleLogin);
    socketService.registerEventHandler(socket, "logout", User.handleLogout);
    socketService.registerEventHandler(
      socket,
      "getMenuDetailFromId",
      User.getMenuDetailFromId
    );
  }

  static async handleLogin(data: any, callback: any) {
    try {
      const { employeeID, password } = data;
      const userDetail: IUser = (await AuthService.login(
        employeeID,
        password
      )) as IUser;
      console.log(userDetail, "fdsfsfsdfs");
      if (userDetail) {
        const role: Role = userDetail.role as Role;
        User.navigateToClass(role, User.socketService, User.socket);
        console.log({ userDetail: userDetail, message: "valid user" });

        callback({ userDetail: userDetail, message: "valid user" });
      } else if (userDetail == null) {
        callback({ userDetail: null, message: "Invalid Credianlts" });
      } else {
        callback({ userDetail: null, message: "Error Validating User" });
        console.log(userDetail);
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

  static async handleLogout(data: any, callback: any) {
    try {
      console.log("handleLogout- server", data);

      await AuthService.logOut(data.userDetail);
      callback({ message: "log out successfull" });
    } catch (error) {}
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

  static navigateToClass(
    role: Role,
    socketService: SocketService,
    socket: Socket
  ) {
    console.log("dsdsf", { role });

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
  static async getMenuDetailFromId(
    data: { menu_id: number },
    callback: (response: { message: Menu }) => void
  ) {
    const menuDetail = (await MenuService.getMenuDetailFromId(
      data.menu_id
    )) as Menu;
    callback({ message: menuDetail });
  }
}
