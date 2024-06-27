import { IUser } from "../models/User";
import AdminService from "../services/AdminService";
import OutputService from "../services/OutputService";
import { loginUI } from "./LoginUI";
import AuthService from "../services/AuthService";

class AdminUI {
  static userDetail: IUser;

  async showAdminMenu(userDetail: IUser) {
    let continueLoop = true;

    while (continueLoop) {
      const choice: string = await AdminService.showAdminMenu(userDetail);

      switch (choice) {
        case "1":
          await AdminService.showMenuItems();
          break;
        case "2":
          await AdminService.addMenuItem();
          break;
        case "3":
          await AdminService.updateMenuItem();
          break;
        case "4":
          await AdminService.deleteMenuItem();
          break;
        case "5":
          await AdminService.updateItemAvailability();
          break;
        case "6":
          await AdminService.viewFeedbacksofItem();
        case "7":
          await AdminService.viewFeedbackReport();
          break;
        case "8":
          await AdminService.showDiscardItems();
          break;
        case "9":
          await AdminService.showDiscardItemsOperations();
          break;
        case "10":
          await AdminService.viewLogs();
          break;
        case "0":
          continueLoop = false;
          await AuthService.logOut();
          await loginUI.showLoginMenu();
          break;
        default:
          OutputService.printMessage(
            "Invalid choice. Please select a valid option."
          );
          AdminService.showAdminMenu(userDetail);
      }
    }
  }
}

export const adminUI = new AdminUI();
