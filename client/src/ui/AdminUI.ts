import { User } from "../models/Users";
import AdminService from "../services/AdminService";
import OutputService from "../services/OutputService";
import { loginUI } from "./LoginUI";
import AuthService from "../services/AuthService";

class AdminUI {
  static userDetail: User;

  async showAdminMenu(userDetail: User) {
    let continueLoop = true;

    while (continueLoop) {
      const choice: string = await AdminService.showAdminMenu(userDetail);

      switch (choice) {
        case "1":
          await AdminService.showMenuItems();
          break;
        case "2":
          // await AdminService.showMenuItems();
          await AdminService.addMenuItem();
          break;
        case "3":
          await AdminService.showMenuItems();
          await AdminService.updateMenuItem();
          break;
        case "4":
          await AdminService.showMenuItems();
          await AdminService.deleteMenuItem();
          break;
        case "5":
          await AdminService.showMenuItems();
          await AdminService.updateItemAvailability();
          break;
        case "6":
          await AdminService.showMenuItems();
          await AdminService.viewFeedbacksofItem();
        case "7":
          AdminService.viewFeedbackReport();
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
