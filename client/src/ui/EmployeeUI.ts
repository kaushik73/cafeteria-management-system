import * as readlineSync from "readline-sync";
import EmployeeService from "../services/EmployeeService";
import { loginUI } from "./LoginUI";
import { IUser } from "../models/User";
import OutputService from "../services/OutputService";

class EmployeeUI {
  async showEmployeeMenu(userDetail: IUser) {
    let continueLoop = true;

    while (continueLoop) {
      const choice: string = await EmployeeService.showEmployeeMenu(userDetail);

      switch (choice) {
        case "1":
          await EmployeeService.showMenuItems();
          break;
        case "2":
          await EmployeeService.seeNotifications();
          break;
        case "3":
          await EmployeeService.viewRecommendedFood();
          break;
        case "4":
          await EmployeeService.voteForRecommendedFood();
          break;
        case "5":
          await EmployeeService.giveFeedback();
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
