import CommonValidations from "../validations/CommonValidation";
import AuthService from "../services/AuthService";
import { adminUI } from "./AdminUI";
import { employeeUI } from "./EmployeeUI";
import { Role } from "../common/types";
import OutputService from "../services/OutputService";
import { IUser } from "../models/User";
import { chefUI } from "./ChefUI";
import InputService from "../services/InputService";

class LoginUI {
  public role!: Role;

  async showLoginMenu() {
    return new Promise(async (resolve, reject) => {
      let userID: string = "102";
      let password: string = "pass";
      OutputService.printMessage("Welcome to the system! Please log in.");

      let loggedIn = false;

      while (!loggedIn) {
        // take id and password as default
        userID = InputService.takeInputWithValidation("Enter your userID: ");
        password = InputService.takeInputWithValidation(
          "Enter your Password: "
        );

        try {
          if (CommonValidations.validateUserID(userID)) {
            const userDetail = await AuthService.login(userID, password);
            this.role = userDetail.role;
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

  navigateToRoleMenu(userDetail: IUser) {
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
