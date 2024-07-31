import { IUser } from "../models/User";
import AdminService from "../services/AdminService";
import OutputService from "../services/OutputService";

class AdminUI {
  static userDetail: IUser;

  async showAdminMenu(userDetail: IUser) {
    let continueLoop = true;
    while (continueLoop) {
      const choice: string = await AdminService.showAdminMenu(userDetail);
      continueLoop = await AdminUI.handleMenuChoice(choice);
    }
  }

  private static handleMenuChoice = async (
    choice: string
  ): Promise<boolean> => {
    const menuActions: { [key: string]: () => Promise<any> } = {
      "1": AdminService.showMenuItems,
      "2": AdminService.addMenuItem,
      "3": AdminService.updateMenuItem,
      "4": AdminService.deleteMenuItem,
      "5": AdminService.updateItemAvailability,
      "6": AdminService.viewFeedbacksofItem,
      "7": AdminService.viewFeedbackReport,
      "8": AdminService.showDiscardItems,
      "9": AdminService.showDiscardItemsOperations,
      "10": AdminService.viewLogs,
      "0": AdminService.handleLogOut,
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

export const adminUI = new AdminUI();
