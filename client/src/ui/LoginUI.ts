import InputService from "../services/InputService";
import ValidationService from "../validations/ValidationService";
import AuthService from "../services/AuthService";
import { adminUI } from "./AdminUI";
import { employeeUI } from "./EmployeeUI";
import { Role } from "../common/types";
import OutputService from "../services/OutputService";
import { User } from "../models/Users";
import { chefUI } from "./ChefUI";

class LoginUI {
  private userID: string = "101";
  private password: string = "pass";
  public role!: Role;

  async showLoginMenu() {
    OutputService.printMessage("Welcome to the system! Please log in.");

    let loggedIn = false;

    while (!loggedIn) {
      // this.userID = InputService.takeInputWithValidation("Enter your userID: ");
      // this.password = InputService.takeInputWithValidation(
      //   "Enter your Password: "
      // );

      try {
        if (ValidationService.validateUserID(this.userID)) {
          const userDetail = await AuthService.getUserDetail(
            this.userID,
            this.password
          );
          this.role = userDetail.role;
          OutputService.printMessage(`Role received: ${this.role}`);
          console.log("Role ", this.role, "set successfully on server");
          this.navigateToRoleMenu(userDetail);
          loggedIn = true; // Set loggedIn to true to exit the loop upon successful login
        } else {
          OutputService.printMessage("Invalid userID format.");
        }
      } catch (error: any) {
        OutputService.printMessage(error.message);
      }
    }
  }

  navigateToRoleMenu(userDetail: User) {
    switch (userDetail.role) {
      case Role.Admin:
        adminUI.showAdminMenu(userDetail);
        break;
      case Role.Chef:
        chefUI.showChefMenu(userDetail);
        break;
      case Role.Employee:
        employeeUI.showEmployeeMenu(userDetail);
        break;
      default:
        OutputService.printMessage("Invalid role!");
    }
  }
}

export const loginUI = new LoginUI();
