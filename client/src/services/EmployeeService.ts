import InputService from "./InputService";
import OutputService from "./OutputService";
import { socketService } from "./SocketService";
import validateService from "../validations/ValidationService";

export default class EmployeeService {
  // static selectFoodItems() {
  //   const items = [];
  //   let moreItems = true;

  //   while (moreItems) {
  //     const itemID = parseInt(
  //       InputService.takeInput("Enter menu item ID to select: ")
  //     );
  //     const quantity = parseInt(InputService.takeInput("Enter quantity: "));
  //     items.push({ itemID, quantity });

  //     moreItems =
  //       InputService.takeInput("Do you want to add more items? (yes/no): ") ===
  //       "yes";
  //   }

  //   socket.emitEvent("selectFoodItems", { items }, (response) => {
  //     console.log(response);
  //   });
  // }

  // static giveFeedback() {
  //   const menuItemID = parseInt(
  //     InputService.takeInput("Enter menu item ID to give feedback: ")
  //   );
  //   const comment = InputService.takeInput("Enter your comment: ");
  //   const rating = parseInt(
  //     InputService.takeInput("Enter your rating (1-5): ")
  //   );

  //   const feedback = { menuItemID, comment, rating };

  //   socket.emitEvent("giveFeedback", feedback, (response) => {
  //     console.log(response);
  //   });
  // }

  static async seeNotifications() {
    return new Promise((resolve, reject) => {
      socketService.emitEvent("seeNotifications", {}, (response: any) => {
        const filteredResponse = response.message.map((notification: any) => {
          const { notification_type, message , notification_date } = notification;
          return { notification_type, message };
        });
        OutputService.printTable(filteredResponse);
        resolve(filteredResponse);
      });
    });
  }

  static showEmployeeMenu(): Promise<string> {
    return new Promise((resolve, reject) => {
      OutputService.printMessage(
        `Employee Menu:\n` +
          `1. Select Food Items\n` +
          `2. Give Feedback\n` +
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
}
