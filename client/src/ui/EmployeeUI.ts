import EmployeeService from "../services/EmployeeService";
import { loginUI } from "./LoginUI";
import { IUser } from "../models/User";
import OutputService from "../services/OutputService";
import AuthService from "../services/AuthService";

class EmployeeUI {
  async showEmployeeMenu(userDetail: IUser) {
    let continueLoop = true;

    while (continueLoop) {
      const choice: string = await EmployeeService.showEmployeeMenu(userDetail);
      continueLoop = await EmployeeUI.handleMenuChoice(choice);
    }
  }

  private static handleMenuChoice = async (
    choice: string
  ): Promise<boolean> => {
    const menuActions: { [key: string]: () => Promise<any> } = {
      "1": EmployeeService.showMenuItems,
      "2": EmployeeService.seeNotifications,
      "3": EmployeeService.viewPreferenceRecommendedFood,
      "4": EmployeeService.voteForRecommendedFood,
      "5": EmployeeService.giveFeedback,
      "0": EmployeeService.handleLogOut,
    };

    const action = menuActions[choice];

    if (action) {
      await action();
      return choice !== "0";
    } else {
      OutputService.printMessage(
        "Invalid choice. Please select a valid option."
      );
      return true;
    }
  };
}

export const employeeUI = new EmployeeUI();
