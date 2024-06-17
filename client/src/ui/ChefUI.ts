import * as readlineSync from "readline-sync";
import ChefService from "../services/ChefService";
import { loginUI } from "./LoginUI";
import { User } from "../models/Users";
import OutputService from "../services/OutputService";

export default class ChefUI {
  async showChefMenu(userDetail: User) {
    let continueLoop = true;

    while (continueLoop) {
      const choice: string = await ChefService.showChefMenu(userDetail);
      console.log(`User chose: ${choice}`);

      switch (choice) {
        case "1":
          await ChefService.viewFoodRecommendation();
          break;
        case "2":
          await ChefService.sendFoodRecommendationToEmployees();
          break;
        case "3":
          await ChefService.viewFeedbackReport();
          break;
        case "0":
          continueLoop = false;
          loginUI.showLoginMenu();
          break;
        default:
          OutputService.printMessage(
            "Invalid choice. Please select a valid option."
          );
          ChefService.showChefMenu(userDetail);
      }
    }
  }
}

export const chefUI = new ChefUI();
