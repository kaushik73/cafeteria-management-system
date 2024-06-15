import * as readlineSync from "readline-sync";
import EmployeeService from "../services/EmployeeService";
import LoginUI from "./LoginUI";

 class EmployeeUI {
  // async showEmployeeMenu1() {
  //   console.log("Employee Menu:");
  //   console.log("1. Select Food Items");
  //   console.log("2. Give Feedback");
  //   console.log("0. Logout");
    
  //   const choice = readlineSync.question("Choose an option: ");
  //   switch (choice) {
  //     case "1":
  //       // EmployeeService.selectFoodItems();
  //       break;
  //     case "2":
  //       // EmployeeService.giveFeedback();
  //       break;
  //     case "3":
  //       await EmployeeService.seeNotifications();
  //       break;
  //     case "0":
  //       LoginUI.showLoginMenu();
  //       break;
  //     default:
  //       console.log("Invalid option!");
  //       this.showEmployeeMenu();
  //   }
  // }


    async showEmployeeMenu() {
    let continueLoop = true;

    while (continueLoop) {
      const choice: string = await EmployeeService.showEmployeeMenu();
      console.log(`User chose: ${choice}`);

      switch (choice) {
        case "1":
          // EmployeeService.selectFoodItems();
          break;
        case "2":
          // EmployeeService.giveFeedback();
          break;
        case "3":
          await EmployeeService.seeNotifications();
          break;
        case "0":
          LoginUI.showLoginMenu();
          break;
        default:
          console.log("Invalid option!");
          EmployeeService.showEmployeeMenu();
      }
    }
  }
}

export const employeeUI = new EmployeeUI();
