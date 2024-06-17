import { socketService } from "./SocketService";
import { Role } from "../common/types";
import { User } from "../models/Users";

export default class AuthService {
  static getUserDetail(employeeID: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      socketService.emitEvent(
        "getUserDetail",
        { employeeID, password },
        (response: any) => {
          console.log("a", response);

          if (response.userDetail) {
            console.log("1");
            resolve(response.userDetail);
          } else if (response.userDetail === null) {
            console.log("2");
            reject(new Error(response.message));
          } else {
            console.log("3");
            reject(new Error(response.message));
          }
        }
      );
    });
  }

  // static setUserDetail(userDetail: User): Promise<User> {
  //   return new Promise((resolve, reject) => {
  //     socketService.emitEvent("setUserDetail", userDetail, (response: any) => {
  //       if (response) {
  //         resolve(userDetail);
  //       } else {
  //         reject(new Error(response?.message || "Failed to set details"));
  //       }
  //     });
  //   });
  // }
}
