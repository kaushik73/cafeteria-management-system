import { Menu } from "../models/Menu";
import InputService from "./InputService";
import { socketService } from "./SocketService";
import {
  validateMealType,
  validateItemName,
  validatePrice,
  validateAvailabilityStatus,
  validateItemID,
  validateDescription,
  validateCategory,
  validateNotificationMessage,
} from "../validations/MenuValidations";
import validateService from "../validations/ValidationService";

import { MealTypes } from "../common/types";
import OutputService from "./OutputService";

export default class AdminService {
  static async addMenuItem() {
    return new Promise((resolve, reject) => {
      const item_name: string = InputService.takeInputWithValidation(
        "Enter menu item name: ",
        validateItemName
      );

      const price: number = parseFloat(
        InputService.takeInputWithValidation(
          "Enter menu item price: ",
          validatePrice
        )
      );

      const availability_status: boolean =
        InputService.takeInputWithValidation(
          "Is the item available? (yes/no): ",
          validateAvailabilityStatus
        ).toLowerCase() === "yes";

      const meal_type: Menu["meal_type"] = InputService.takeInputWithValidation(
        "Enter meal type? (lunch/dinner/breakfast): ",
        validateMealType
      ) as MealTypes[keyof MealTypes];

      const item = { item_name, price, availability_status, meal_type };

      OutputService.printMessage("in client admin service, above");
      socketService.emitEvent("addMenuItem", item, (response: any) => {
        OutputService.printMessage("in client admin service, below");
        OutputService.printMessage(response.message);
        resolve(response.message);
      });
    });
  }

  static async deleteMenuItem() {
    return new Promise((resolve, reject) => {
      const itemID: number = parseInt(
        InputService.takeInputWithValidation(
          "Enter menu item ID to delete: ",
          validateItemID
        )
      );
      socketService.emitEvent("deleteMenuItem", { itemID }, (response: any) => {
        OutputService.printMessage(response.message);
        resolve(response.message);
      });
    });
  }
  static async updateMenuItem() {
    return new Promise((resolve, reject) => {
      const menu_id: number = parseInt(
        InputService.takeInputWithValidation(
          "Enter menu item ID to update: ",
          validateItemID
        )
      );
      const item_name: string = InputService.takeInputWithValidation(
        "Enter new menu item name: ",
        validateItemName
      );

      const price: number = parseFloat(
        InputService.takeInputWithValidation(
          "Enter new menu item price: ",
          validatePrice
        )
      );
      const availability_status: boolean =
        InputService.takeInputWithValidation(
          "Is the item available? (yes/no): ",
          validateAvailabilityStatus
        ) === "yes";
      const meal_type: string = InputService.takeInputWithValidation(
        "Enter new menu item category: ",
        validateCategory
      );

      const item = {
        menu_id,
        item_name,
        price,
        availability_status,
        meal_type,
      };

      socketService.emitEvent("updateMenuItem", item, (response: any) => {
        OutputService.printMessage(response.message);
        resolve(response.message);
      });
    });
    // OutputService.printMessage(`Emitted updateMenuItem event with item:${item}`);
  }

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

  static showAdminMenu(): Promise<string> {
    return new Promise((resolve, reject) => {
      OutputService.printMessage(
        `Admin Menu:\n` +
          `1. Add Menu Item\n` +
          `2. Update Menu Item\n` +
          `3. Delete Menu Item\n` +
          `4. Update Item Availability\n` +
          `5. Generate Sales Report\n` +
          // `6. Send Notifications\n` +
          `0. Logout`
      );
      const choice = InputService.takeInputWithValidation(
        "Choose an option: ",
        validateService.validateOption
      );
      resolve(choice);
    });
  }

  static updateItemAvailability() {
    const itemID: number = parseInt(
      InputService.takeInputWithValidation(
        "Enter menu item ID to update availability: ",
        validateItemID
      )
    );
    const availability: boolean =
      InputService.takeInputWithValidation(
        "Is the item available? (yes/no): ",
        validateAvailabilityStatus
      ) === "yes";

    socketService.emitEvent(
      "updateItemAvailability",
      { itemID, availability },
      (response) => {
        OutputService.printMessage(response);
      }
    );
  }
  // static sendNotifications() {
  //   socketService.emitEvent("sendNotifications", {}, (response : Notification[]) => {
  //     OutputService.printTable(response);
  //   });
  // }

  static generateSalesReport() {
    socketService.emitEvent("generateSalesReport", {}, (response) => {
      OutputService.printMessage(response);
    });
  }

  // static sendMenuUpdateNotification() {
  //   const message: string = InputService.takeInputWithValidation(
  //     "Enter notification message: ",
  //     validateNotificationMessage
  //   );

  //   socketService.emitEvent(
  //     "sendMenuUpdateNotification",
  //     { message },
  //     (response) => {
  //       OutputService.printMessage(response);
  //     }
  //   );
  // }

  // static sendAvailabilityNotification() {
  //   const message: string = InputService.takeInputWithValidation(
  //     "Enter notification message: ",
  //     validateNotificationMessage
  //   );

  //   socketService.emitEvent(
  //     "sendAvailabilityNotification",
  //     { message },
  //     (response) => {
  //       OutputService.printMessage(response);
  //     }
  //   );
  // }
}
