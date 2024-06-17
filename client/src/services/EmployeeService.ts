import InputService from "./InputService";
import OutputService from "./OutputService";
import { socketService } from "./SocketService";
import validateService from "../validations/ValidationService";
import { User } from "../models/Users";
import { Menu } from "../models/Menu";

export default class EmployeeService {
  static userDetail: User;

  static showEmployeeMenu(userDetail: User): Promise<string> {
    EmployeeService.userDetail = userDetail;
    return new Promise((resolve, reject) => {
      OutputService.printMessage(
        `Employee Menu:\n` +
          `1. Give Feedback\n` +
          `2. See Notifications\n` +
          `0. Logout`
      );
      const choice = InputService.takeInputWithValidation(
        "Choose an option: ",
        validateService.validateOption
      );
      resolve(choice);
    });
  }

  static giveFeedback() {
    return new Promise(async (resolve, reject) => {
      const menu_name: string = InputService.takeInputWithValidation(
        "Enter menu item name to give feedback:"
        // validateItemI
      );
      const comment: string = InputService.takeInputWithValidation(
        "Enter your comment:"
        // validateItemName
      );

      const rating: number = parseFloat(
        InputService.takeInputWithValidation("Enter your rating (1-5): ")
      );

      const menu_id = await EmployeeService.getMenuIdFromName(menu_name);
      console.log("from here code is not going");
      const feedback = {
        menu_id,
        comment,
        rating,
        user_id: EmployeeService.userDetail.user_id,
      };

      console.log(feedback, "feedvakc from client emp service");

      socketService.emitEvent("giveFeedback", feedback, (response: any) => {
        OutputService.printMessage(response.message);
        resolve(response.message);
      });
    });
  }

  static getMenuIdFromName(menu_name: string): Promise<number> {
    return new Promise((resolve, reject) => {
      socketService.emitEvent(
        "getMenuIdFromName",
        menu_name, // LEARN WHAT THINGS CHANGES wHEn Passing the menu_name as an object
        (response: { message: number }) => {
          if (response && response.message) {
            resolve(response.message);
            console.log("response.message", response.message);
          } else {
            reject(new Error("Failed to get menu ID"));
          }
        }
      );
    });
  }

  static async seeNotifications() {
    return new Promise((resolve, reject) => {
      socketService.emitEvent("seeNotifications", {}, (response: any) => {
        const filteredResponse = response.message.map((notification: any) => {
          const { notification_type, message, notification_date } =
            notification;
          return { notification_type, message };
        });
        OutputService.printTable(filteredResponse);
        resolve(filteredResponse);
      });
    });
  }

  // todo : same in adminService as well
  static async showMenuItems() {
    return new Promise((resolve) => {
      socketService.emitEvent(
        "showMenuItems",
        { meal_type: "desc" },
        (response: any) => {
          OutputService.printTable(response.message);
          resolve(response.message);
        }
      );
    });
  }
}
