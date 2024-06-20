import InputService from "../services/InputService";
import CommonValidations from "../validations/CommonValidation";
import AuthService from "../services/AuthService";
import { adminUI } from "./AdminUI";
import { employeeUI } from "./EmployeeUI";
import { Role } from "../common/types";
import OutputService from "../services/OutputService";
import { User } from "../models/Users";
import { chefUI } from "./ChefUI";

class LoginUI {
  public role!: Role;

  async showLoginMenu() {
    return new Promise(async (resolve, reject) => {
      let userID: string = "101";
      let password: string = "pass";
      OutputService.printMessage("Welcome to the system! Please log in.");

      let loggedIn = false;

      while (!loggedIn) {
        userID = InputService.takeInputWithValidation("Enter your userID: ");
        password = InputService.takeInputWithValidation(
          "Enter your Password: "
        );

        try {
          if (CommonValidations.validateUserID(userID)) {
            const userDetail = await AuthService.setUserDetail(
              userID,
              password
            );
            this.role = userDetail.role;
            OutputService.printMessage(`Role received: ${this.role}`);
            console.log("Role ", this.role, "set successfully on server");
            this.navigateToRoleMenu(userDetail);
            loggedIn = true;
          } else {
            OutputService.printMessage("Invalid userID format.");
          }
        } catch (error: any) {
          OutputService.printMessage(error.message);
        }
      }
      resolve(this.role);
    });
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
