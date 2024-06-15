import { socketService } from "./SocketService";
import { Role } from "../common/types";

export default class AuthService {
  static getUserRole(employeeID: string, password: string): Promise<Role> {
    return new Promise((resolve, reject) => {
      socketService.emitEvent(
        "getUserRole",
        { employeeID, password },
        (response: { role: Role }) => {          
          if (response && response.role) {
            resolve(response.role);
          } else if (response.role == null) {
            reject(new Error("Invalid credentials. Please try again."));
          } else {
            reject(new Error("Failed to get user role"));
          }
        }
      );
    });
  }

  static setRole(role: Role): Promise<void> {
    return new Promise((resolve, reject) => {
      socketService.emitEvent("setRole", role, (response: any) => {
        if (response && response=== "success") {
          resolve();
        } else {
          reject(new Error(response?.message || "Failed to set role"));
        }
      });
    });
  }
}
