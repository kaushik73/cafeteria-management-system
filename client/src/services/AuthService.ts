import { User } from "../models/Users";
import { socketService } from "./SocketService";

export default class AuthService {
  static userDetail: User;
  static setUserDetail(employeeID: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      socketService.emitEvent(
        "login",
        { employeeID, password },
        (response: { userDetail: User; message: string }) => {
          console.log("inside client login");

          if (response.userDetail) {
            AuthService.userDetail = response.userDetail;
            resolve(response.userDetail);
          } else if (response.userDetail === null) {
            reject(new Error(response.message));
          } else {
            reject(new Error(response.message));
          }
        }
      );
    });
  }

  static logOut() {
    return new Promise(async (resolve, reject) => {
      socketService.emitEvent(
        "logout",
        { userDetail: AuthService.userDetail },
        (response: { message: string }) => {
          resolve(response.message);
        }
      );
    });
  }
}
