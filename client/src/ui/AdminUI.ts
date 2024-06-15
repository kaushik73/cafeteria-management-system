import AdminService from "../services/AdminService";
import OutputService from "../services/OutputService";
import LoginUI from "./LoginUI";

class AdminUI {
  async showAdminMenu() {
    let continueLoop = true;

    while (continueLoop) {
      const choice: string = await AdminService.showAdminMenu();
      console.log(`User chose: ${choice}`);

      switch (choice) {
        case "1":
          await AdminService.addMenuItem();
          break;
        case "2":
          await AdminService.showMenuItems();
          await AdminService.updateMenuItem();
          break;
        case "3":
          await AdminService.showMenuItems();
          await AdminService.deleteMenuItem();

          break;
        case "4":
          AdminService.updateItemAvailability();
          break;
        case "5":
          AdminService.generateSalesReport();
          break;
        case "6":
          // AdminService.sendNotifications();
          break;
        case "0":
          continueLoop = false;
          LoginUI.showLoginMenu();
          break;
        default:
          OutputService.printMessage("Invalid choice. Please select a valid option.");
          break;
      }
    }
  }
}

export const adminUI = new AdminUI();
