import * as readlineSync from "readline-sync";
import EmployeeService from "../services/EmployeeService";
import { loginUI } from "./LoginUI";
import { User } from "../models/Users";
import OutputService from "../services/OutputService";

class EmployeeUI {
  async showEmployeeMenu(userDetail: User) {
    let continueLoop = true;

    while (continueLoop) {
      const choice: string = await EmployeeService.showEmployeeMenu(userDetail);

      switch (choice) {
        case "1":
          await EmployeeService.showMenuItems();
          await EmployeeService.giveFeedback();
          break;
        case "2":
          await EmployeeService.seeNotifications();
          break;
        case "3":
          await EmployeeService.showMenuItems();
          break;
        case "0":
          loginUI.showLoginMenu();
          break;
        default:
          OutputService.printMessage(
            "Invalid choice. Please select a valid option."
          );
          EmployeeService.showEmployeeMenu(userDetail);
      }
    }
  }
}

export const employeeUI = new EmployeeUI();
