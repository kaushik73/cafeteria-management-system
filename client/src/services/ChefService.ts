import { User } from "../models/Users";
import ValidationService from "../validations/ValidationService";
import InputService from "./InputService";
import OutputService from "./OutputService";
import { socketService } from "./SocketService";

export default class ChefService {
  static userDetail: User;

  static showChefMenu(userDetail: User): Promise<string> {
    ChefService.userDetail = userDetail;
    return new Promise((resolve, reject) => {
      OutputService.printMessage(
        `Chef Menu:\n` +
          `1. View Food Recommendations\n` +
          `2. Send Food Recommendation to Employees\n` +
          `3.W View Feedback Report\n` +
          `0. Logout`
      );
      const choice = InputService.takeInputWithValidation(
        "Choose an option: ",
        ValidationService.validateOption
      );
      resolve(choice);
    });
  }

  static viewFeedbackReport() {
    return new Promise(async (resolve, reject) => {
      const fromInput = InputService.takeInputWithValidation(
        "Enter the start date (YYYY-MM-DD): ",
        ValidationService.validateDate
      );
      const toInput = InputService.takeInputWithValidation(
        "Enter the end date (YYYY-MM-DD): ",
        ValidationService.validateDate
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
