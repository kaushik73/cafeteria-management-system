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
  private roleActions: any = {
    [Role.Admin]: adminUI.showAdminMenu,
    [Role.Chef]: chefUI.showChefMenu,
    [Role.Employee]: employeeUI.showEmployeeMenu,
  };

  async showLoginMenu() {
    return new Promise(async (resolve, reject) => {
      let userID: string = "102";
      let password: string = "pass";
      OutputService.printMessage("Welcome to the system! Please log in.");

      let loggedIn = false;

      while (!loggedIn) {
        userID = InputService.takeInputWithValidation("Enter your userID: ");
        password = InputService.takeMaskedInput("Enter your Password: ");
        // userID = "102";
        // password = "pass";

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

  private getUserRole(userDetail: IUser): Role | string {
    switch (userDetail.role) {
      case Role.Admin:
      case Role.Chef:
      case Role.Employee:
        return userDetail.role;
      default:
        return "Invalid role!";
    }
  }

  navigateToRoleMenu(userDetail: IUser) {
    const role = this.getUserRole(userDetail);

    if (role === "Invalid role!") {
      OutputService.printMessage(role);
      return;
    }

    const action = this.roleActions[role];
    if (action) {
      action(userDetail);
    } else {
      OutputService.printMessage("Invalid role!");
    }
  }
}

export const loginUI = new LoginUI();
