import { User } from "../models/Users";
import CommonValidations from "../validations/CommonValidation";
import { SharedService } from "./SharedService";
import InputService from "./InputService";
import OutputService from "./OutputService";
import { socketService } from "./SocketService";

export default class ChefService {
  static userDetail: User;
  private static sharedService: SharedService;
  static {
    ChefService.sharedService = new SharedService();
  }
  static showChefMenu(userDetail: User): Promise<string> {
    ChefService.userDetail = userDetail;
    return new Promise((resolve, reject) => {
      OutputService.printMessage(
        `Chef Menu:\n` +
          `1.W View Menu Items\n` +
          `2. View Food Recommendations\n` +
          `3. Send Food Notification to Employees\n` +
          `4.W View Feedback Report\n` +
          `0. Logout`
      );
      const choice = InputService.takeInputWithValidation(
        "Choose an option: ",
        CommonValidations.validateOption
      );
      resolve(choice);
    });
  }

  static async showMenuItems() {
    await ChefService.sharedService.showMenuItems();
  }

  static viewFeedbackReport() {
    return new Promise(async (resolve, reject) => {
      const fromInput = InputService.takeInputWithValidation(
        "Enter the start date (YYYY-MM-DD): ",
        CommonValidations.validateDate
      );
      const toInput = InputService.takeInputWithValidation(
        "Enter the end date (YYYY-MM-DD): ",
        CommonValidations.validateDate
      );

      const from = fromInput;
      const to = toInput;

      // const formattedFrom = Vali.formatDate(from);
      // const formattedTo = DateService.formatDate(to);

      socketService.emitEvent(
        "viewFeedbackReport",
        { from, to },
        // { from: formattedFrom, to: formattedTo },
        (response: any) => {
          OutputService.printTable(response.message);
          resolve(response.message);
        }
      );
    });
  }

  static viewFoodRecommendation() {
    return new Promise(async (resolve, reject) => {
      socketService.emitEvent("viewFoodRecommendation", {}, (response) => {
        console.log(response);
      });

      resolve("temp");
    });
  }

  static sendFoodRecommendationToEmployees() {
    return new Promise(async (resolve, reject) => {
      socketService.emitEvent(
        "sendFoodRecommendationToEmployees",
        {},
        (response) => {
          console.log(response);
        }
      );

      resolve("temp");
    });
  }
}
