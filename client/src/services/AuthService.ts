import { IUser } from "../models/User";
import { socketService } from "./SocketService";
import { Response } from "../common/types";
export default class AuthService {
  static userDetail: IUser;
  static login(employeeID: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      socketService.emitEvent(
        "login",
        { employeeID, password },
        (response: { userDetail: IUser; message: string }) => {
          const userDetail = response.userDetail;
          console.log(userDetail, "userDetail");

          if (userDetail) {
            AuthService.userDetail = userDetail;
            resolve(userDetail);
          } else if (userDetail === null) {
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
