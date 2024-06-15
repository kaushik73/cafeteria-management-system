// import InputService from "../services/InputService";
// import ValidationService from "../validations/ValidationService";
// import AuthService from "../services/AuthService";
// import { adminUI } from "./AdminUI";
// import { employeeUI } from "./EmployeeUI";
// import { Role } from "../common/types";
// import OutputService from "../services/OutputService";

// export default class LoginUI {
//   private static userID: string = "1001";
//   private static password: string = "password123";

//   static async showLoginMenu() {
//     OutputService.printMessage("Welcome to the system! Please log in.");
//     this.userID = InputService.takeInput("Enter your userID: ");
//     this.password = InputService.takeInput("Enter your Password: ");

//     if (ValidationService.validateUserID(this.userID)) {
//       try {
//         const role = await AuthService.getUserRole(
//           this.userID,
//           this.password
//         );
//         OutputService.printMessage(`Role received: ${role}`);
//         await AuthService.setRole(role);
//         OutputService.printMessage("Role set successfully on server");
//         this.navigateToRoleMenu(role);
//       } catch (error: any) {
//         console.error(error.message);
//       }
//     } else {
//       OutputService.printMessage("Invalid User ID.");
//     }
//   }

//   static navigateToRoleMenu(role: Role) {
//     switch (role) {
//       case Role.Admin:
//         adminUI.showAdminMenu();
//         break;
//       case Role.Chef:
//         // chefUI.showChefMenu();
//         break;
//       case Role.Employee:
//         employeeUI.showEmployeeMenu();
//         break;
//       default:
//         OutputService.printMessage("Invalid role!");
//     }
//   }
// }

import InputService from "../services/InputService";
import ValidationService from "../validations/ValidationService";
import AuthService from "../services/AuthService";
import { adminUI } from "./AdminUI";
import { employeeUI } from "./EmployeeUI";
import { Role } from "../common/types";
import OutputService from "../services/OutputService";

export default class LoginUI {
  private static userID: string = "1001";
  private static password: string = "password123";

  static async showLoginMenu() {
    OutputService.printMessage("Welcome to the system! Please log in.");

    let loggedIn = false;

    while (!loggedIn) {
      this.userID = InputService.takeInput("Enter your userID: ");
      this.password = InputService.takeInput("Enter your Password: ");

      if (ValidationService.validateUserID(this.userID)) {
        try {
          const role = await AuthService.getUserRole(
            this.userID,
            this.password
          );
          OutputService.printMessage(`Role received: ${role}`);
          await AuthService.setRole(role);
          OutputService.printMessage("Role set successfully on server");
          this.navigateToRoleMenu(role);
          loggedIn = true; // Set loggedIn to true to exit the loop upon successful login
        } catch (error: any) {
          OutputService.printMessage(error.message);
        }
      } else {
        OutputService.printMessage("Invalid User ID.");
      }
    }
  }

  static navigateToRoleMenu(role: Role) {
    switch (role) {
      case Role.Admin:
        adminUI.showAdminMenu();
        break;
      case Role.Chef:
        // chefUI.showChefMenu();
        break;
      case Role.Employee:
        employeeUI.showEmployeeMenu();
        break;
      default:
        OutputService.printMessage("Invalid role!");
    }
  }
}
