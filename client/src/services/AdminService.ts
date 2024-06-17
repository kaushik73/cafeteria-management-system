import { Menu } from "../models/Menu";
import InputService from "./InputService";
import { socketService } from "./SocketService";
import {
  validateMealType,
  validateItemName,
  validatePrice,
  validateAvailabilityStatus,
  validateMenuID,
  validateDescription,
  validateCategory,
  validateNotificationMessage,
} from "../validations/MenuValidations";
import validateService from "../validations/ValidationService";

import { MealTypes } from "../common/types";
import OutputService from "./OutputService";
import { Feedback } from "../models/Feedback";
import { User } from "../models/Users";

export default class AdminService {
  static userDetail: User;

  static showAdminMenu(userDetail: User): Promise<string> {
    AdminService.userDetail = userDetail;

    return new Promise((resolve, reject) => {
      OutputService.printMessage(
        `Admin Menu:\n` +
          `1.W View Menu\n` +
          `2.W Add Menu Item\n` +
          `3.W Update Menu Item\n` +
          `4. Delete Menu Item\n` +
          `5. Update Item Availability\n` +
          `6.W View Feedbacks of Item\n` +
          `7.W inChef View Feedback Report\n` +
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

  static async updateMenuItem() {
    return new Promise((resolve, reject) => {
      const menu_id: number = parseInt(
        InputService.takeInputWithValidation(
          "Enter menu item ID to update: ",
          validateMenuID
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
  }

  static async deleteMenuItem() {
    return new Promise((resolve, reject) => {
      const itemID: number = parseInt(
        InputService.takeInputWithValidation(
          "Enter menu item ID to delete: ",
          validateMenuID
        )
      );
      socketService.emitEvent("deleteMenuItem", { itemID }, (response: any) => {
        OutputService.printMessage(response.message);
        resolve(response.message);
      });
    });
  }

  static updateItemAvailability() {
    const itemID: number = parseInt(
      InputService.takeInputWithValidation(
        "Enter menu item ID to update availability: ",
        validateMenuID
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

  static async viewFeedbacksofItem() {
    return new Promise((resolve, reject) => {
      const menu_id: number = parseInt(
        InputService.takeInputWithValidation(
          "Enter menu item ID to view feedbacks for: ",
          validateMenuID
        )
      );
      socketService.emitEvent(
        "viewFeedbacks",
        { menu_id },
        (response: { message: any }) => {
          console.log("viewFeedbacks socket called from client");
          const filteredResponse = response.message.map((feedback: any) => {
            const { rating, comment, menu_id, feedback_date } = feedback;
            return { rating, comment, menu_id, feedback_date };
          });
          // todo : change date format from server/ client
          console.log("filteredResponse", filteredResponse);

          OutputService.printTable(filteredResponse);
          resolve(response.message);
        }
      );
    });
  }

  static viewFeedbackReport() {
    socketService.emitEvent("viewFeedbackReport", {}, (response) => {
      OutputService.printMessage(response);
    });
  }
}
