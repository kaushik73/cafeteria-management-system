import { IUser } from "../models/User";
import { socketService } from "./SocketService";

export default class AuthService {
  static userDetail: IUser;
  static login(employeeID: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      socketService.emitEvent(
        "login",
        { employeeID, password },
        (response: Response<{ userDetail: IUser | null }>) => {
          const userDetail = response.data.userDetail;
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
