import ChefService from "../services/ChefService";
import { loginUI } from "./LoginUI";
import { IUser } from "../models/User";
import OutputService from "../services/OutputService";
import AuthService from "../services/AuthService";

export default class ChefUI {
  async showChefMenu(userDetail: IUser) {
    let continueLoop = true;

    while (continueLoop) {
      const choice: string = await ChefService.showChefMenu(userDetail);
      continueLoop = await ChefUI.handleMenuChoice(choice);
    }
  }

  private static handleMenuChoice = async (
    choice: string
  ): Promise<boolean> => {
    const menuActions: { [key: string]: () => Promise<any> } = {
      "1": ChefService.showMenuItems,
      "2": ChefService.viewFoodRecommendation,
      "3": ChefService.rolloutFoodToEmployees,
      "4": ChefService.showDiscardItems,
      "5": ChefService.viewEmployeeVotes,
      "0": ChefService.handleLogOut,
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

export const chefUI = new ChefUI();
