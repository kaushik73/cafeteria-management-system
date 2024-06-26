import {
  MealType,
  DietaryType,
  SpiceType,
  CuisineType,
  Menu,
} from "../models/Menu";
import InputService from "./InputService";
import { socketService } from "./SocketService";
import {
  validateMealType,
  validatePrice,
  validateBoolean,
  validateMenuID,
  validateInputLength,
  validateDietaryType,
  validateSpiceType,
  validateCuisineType,
} from "../validations/MenuValidations";
import validateService from "../validations/CommonValidation";

import OutputService from "./OutputService";
import { IUser } from "../models/User";
import { SharedService } from "./SharedService";
import { Log } from "../models/Log";

export default class AdminService {
  static userDetail: IUser;
  private static sharedService: SharedService;
  static {
    AdminService.sharedService = new SharedService();
  }

  static showAdminMenu(userDetail: IUser): Promise<string> {
    AdminService.userDetail = userDetail;

    return new Promise((resolve, reject) => {
      OutputService.printMessage(
        `Admin Menu:\n` +
          `1. View Menu\n` +
          `2. Add Menu Item\n` +
          `3. Update Menu Item\n` +
          `4. Delete Menu Item\n` +
          `5. Update Item Availability\n` +
          `6. View Feedbacks of Item\n` +
          `7. View Feedback Report\n` +
          `8. See Discard Items\n` +
          `9. See Discard Items Operations(Should be done once a month)\n` +
          `10. See Log\n` +
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
    await AdminService.sharedService.showMenuItems();
  }

  static async addMenuItem() {
    return new Promise((resolve, reject) => {
      const itemName: string = InputService.takeInputWithValidation(
        "Enter menu item name: ",
        validateInputLength
      );

      const price: number = parseFloat(
        InputService.takeInputWithValidation(
          "Enter menu item price: ",
          validatePrice
        )
      );

      const availabilityStatus: boolean =
        InputService.takeInputWithValidation(
          "Is the item available? (yes/no): ",
          validateBoolean
        ).toLowerCase() === "yes";

      const mealType: MealType = InputService.takeInputWithValidation(
        "Enter meal type? (lunch/dinner/breakfast): ",
        validateMealType
      ) as MealType;

      const dietaryType: DietaryType = InputService.takeInputWithValidation(
        "Enter dietary type? (vegetarian/non-vegetarian/eggetarian): ",
        validateDietaryType
      ) as DietaryType;

      const spiceType: SpiceType = InputService.takeInputWithValidation(
        "Enter spice type? (high/medium/low): ",
        validateSpiceType
      ) as SpiceType;

      const cuisineType: CuisineType = InputService.takeInputWithValidation(
        "Enter cuisine type? (north-indian/south-indian/other): ",
        validateCuisineType
      ) as CuisineType;

      const sweeToothType: boolean =
        InputService.takeInputWithValidation(
          "Are you sweet tooth type? (yes/no): ",
          validateBoolean
        ).toLowerCase() === "yes";

      const item: Partial<Menu> = {
        item_name: itemName,
        price,
        availability_status: availabilityStatus,
        meal_type: mealType,
        cuisine_type: cuisineType,
        spice_type: spiceType,
        dietary_type: dietaryType,
        sweet_tooth_type: sweeToothType,
        is_discard: false,
      };

      console.log("in client admin service, above");
      socketService.emitEvent("addMenuItem", item, (response: any) => {
        console.log("in client admin service, below");
        OutputService.printMessage(response.message);
        resolve(response.message);
      });
    });
  }

  static async updateMenuItem() {
    return new Promise((resolve, reject) => {
      const menuId: number = parseInt(
        InputService.takeInputWithValidation(
          "Enter menu item ID to update: ",
          validateMenuID
        )
      );

      const itemName: string = InputService.takeOptionalInputWithValidation(
        "Enter new menu item name (press enter to keep current): ",
        validateInputLength
      );

      const price: number = parseInt(
        InputService.takeOptionalInputWithValidation(
          "Enter new menu item price (press enter to keep current): ",
          validatePrice
        )
      );

      const availabilityStatus: boolean =
        InputService.takeOptionalInputWithValidation(
          "Is the item available? (yes/no), press enter to keep current: ",
          validateBoolean
        ).toLowerCase() === "yes";

      const mealType: MealType = InputService.takeOptionalInputWithValidation(
        "Enter meal type? (lunch/dinner/breakfast), press enter to keep current: ",
        validateMealType
      ) as MealType;

      const dietaryType: DietaryType =
        InputService.takeOptionalInputWithValidation(
          "Enter dietary type? (vegetarian/non-Vegetarian/eggetarian), press enter to keep current: ",
          validateDietaryType
        ) as DietaryType;

      const spiceType: SpiceType = InputService.takeOptionalInputWithValidation(
        "Enter spice type? (high/medium/low), press enter to keep current): ",
        validateSpiceType
      ) as SpiceType;

      const cuisineType: CuisineType =
        InputService.takeOptionalInputWithValidation(
          "Enter cuisine type? (north-indian/south-indian/other), press enter to keep current: ",
          validateCuisineType
        ) as CuisineType;

      const sweetToothType: boolean =
        InputService.takeOptionalInputWithValidation(
          "Are you sweet tooth type? (yes/no), press enter to keep current: ",
          validateBoolean
        ).toLowerCase() === "yes";

      const item: Partial<Menu> = {
        menu_id: menuId,
        item_name: itemName,
        price,
        availability_status: availabilityStatus,
        meal_type: mealType,
        dietary_type: dietaryType,
        spice_type: spiceType,
        cuisine_type: cuisineType,
        sweet_tooth_type: sweetToothType,
        is_discard: false,
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
      socketService.emitEvent(
        "deleteMenuItem",
        { menu_id: itemID },
        (response: any) => {
          OutputService.printMessage(response.message);
          resolve(response.message);
        }
      );
    });
  }

  static async updateItemAvailability() {
    return new Promise((resolve, reject) => {
      const itemID: number = parseInt(
        InputService.takeInputWithValidation(
          "Enter menu item ID to update availability: ",
          validateMenuID
        )
      );
      const availability: boolean =
        InputService.takeInputWithValidation(
          "Is the item available? (yes/no): ",
          validateBoolean
        ) === "yes";

      socketService.emitEvent(
        "updateItemAvailability",
        { menu_id: itemID, availability_status: availability },
        (response: { message: string }) => {
          OutputService.printMessage(response.message);
          resolve(response.message);
        }
      );
    });
  }

  static async viewFeedbacksofItem() {
    return new Promise((resolve, reject) => {
      const menuId: number = parseInt(
        InputService.takeInputWithValidation(
          "Enter menu ID to view feedbacks for: ",
          validateMenuID
        )
      );
      socketService.emitEvent(
        "viewFeedbacks",
        { menu_id: menuId },
        (response: { message: any }) => {
          const filteredResponse = response.message.map((feedback: any) => {
            const { rating, comment, menu_id, feedback_date } = feedback;
            return { rating, comment, menu_id, feedback_date };
          });
          // todo : change date format from server/ client
          OutputService.printTable(filteredResponse);
          resolve(response.message);
        }
      );
    });
  }

  static viewFeedbackReport() {
    return new Promise((resolve, reject) => {
      socketService.emitEvent("viewFeedbackReport", {}, (response) => {
        OutputService.printMessage(response);
      });
    });
  }

  // done till above

  static showDiscardItems() {
    return new Promise((resolve, reject) => {
      socketService.emitEvent(
        "showDiscardItems",
        {},
        (response: { message: Menu[] }) => {
          console.log("response - showDiscardItems", response);

          OutputService.printTable(response.message);
          resolve("showDiscardItems");
        }
      );
    });
  }

  static async showDiscardItemsOperations() {
    return new Promise(async (resolve, reject) => {
      OutputService.printMessage(
        `1. Remove the Food Item\n` +
          `2. Roll out Detailed Feedback Questions\n` +
          `0. Go to Admin Menu`
      );
      let continueLoop = true;
      while (continueLoop) {
        const choice = InputService.takeInputWithValidation(
          "Choose an option: ",
          validateService.validateOption
        );
        switch (choice) {
          case "1":
            await AdminService.removeDiscardItem();
            break;
          case "2":
            await AdminService.detailedFeedbackForDiscardMenu();
            break;
          case "0":
            continueLoop = false;
            await AdminService.showAdminMenu(AdminService.userDetail);
            break;
          default:
            OutputService.printMessage(
              "Invalid choice. Please select a valid option."
            );
        }
      }
      resolve("showDiscardItemsOperations");
    });
  }

  static async removeDiscardItem() {
    return new Promise((resolve, reject) => {
      const removeDiscardItemsIdArray: string =
        InputService.takeInputWithValidation(
          "Enter comma(,) separated Menu ID: "
        );

      const menuIdArray: number[] = removeDiscardItemsIdArray
        .split(",")
        .map((id) => Number(id.trim()));
      socketService.emitEvent(
        "removeDiscardItem",
        { menuIdArray: menuIdArray },
        (response: { message: string }) => {
          OutputService.printMessage(response.message);
          resolve("removeDiscardItem");
        }
      );
    });
  }

  static async detailedFeedbackForDiscardMenu() {
    return new Promise(async (resolve, reject) => {
      const ItemsId = InputService.takeInputWithValidation(
        "Enter comma (,) separated item Id you want to have detail feedback on: ",
        validateInputLength
      );

      const menuIdArray: number[] = ItemsId.split(",").map((id) =>
        Number(id.trim())
      );
      socketService.emitEvent(
        "detailedFeedbackForDiscardMenu",
        { menuIdArray: menuIdArray },
        (response: { message: string }) => {
          OutputService.printMessage(response.message);
          resolve("detailedFeedbackForDiscardMenu");
        }
      );
    });
  }

  static async viewLogs() {
    return new Promise((resolve, reject) => {
      socketService.emitEvent("viewLog", {}, (response: { message: Log[] }) => {
        OutputService.printTable(response.message);
        resolve("logs");
      });
    });
  }
}
