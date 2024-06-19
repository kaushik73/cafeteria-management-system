import InputService from "./InputService";
import OutputService from "./OutputService";
import { socketService } from "./SocketService";
import validateService from "../validations/CommonValidation";
import { User } from "../models/Users";
import { Menu } from "../models/Menu";
import { SharedService } from "./SharedService";

export default class EmployeeService {
  static userDetail: User;
  private static sharedService: SharedService;
  static {
    EmployeeService.sharedService = new SharedService();
  }
  static showEmployeeMenu(userDetail: User): Promise<string> {
    EmployeeService.userDetail = userDetail;
    return new Promise((resolve, reject) => {
      OutputService.printMessage(
        `Employee Menu:\n` +
          `1.W Give Feedback\n` +
          `2.W See Notifications\n` +
          `3.W See Menu\n` +
          `0. Logout`
      );
      const choice = InputService.takeInputWithValidation(
        "Choose an option: ",
        validateService.validateOption
      );
      resolve(choice);
    });
  }

  static async showMenuItems() {
    await EmployeeService.sharedService.showMenuItems();
  }

  static giveFeedback() {
    return new Promise(async (resolve, reject) => {
      const itemID: string = InputService.takeInputWithValidation(
        "Enter menu item id to give feedback:"
        // validateItemID
      );
      const comment: string = InputService.takeInputWithValidation(
        "Enter your comment:"
        // validateItemName
      );

      const rating: number = parseFloat(
        InputService.takeInputWithValidation("Enter your rating (1-5): ")
      );

      const feedback = {
        menu_id: itemID,
        comment,
        rating,
        user_id: EmployeeService.userDetail.user_id,
      };

      socketService.emitEvent("giveFeedback", feedback, (response: any) => {
        OutputService.printMessage(response.message);
        resolve(response.message);
      });
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
}
