import { User } from "../models/Users";
import { socketService } from "./SocketService";

export default class AuthService {
  static getUserDetail(employeeID: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      socketService.emitEvent(
        "getUserDetail",
        { employeeID, password },
        (response: { userDetail: User; message: string }) => {
          if (response.userDetail) {
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
}
