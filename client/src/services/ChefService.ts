import { IUser } from "../models/User";
import CommonValidations from "../validations/CommonValidation";
import { SharedService } from "./SharedService";
import InputService from "./InputService";
import OutputService from "./OutputService";
import { socketService } from "./SocketService";
export default class ChefService {
  static userDetail: IUser;
  private static sharedService: SharedService;
  static {
    ChefService.sharedService = new SharedService();
  }
  static showChefMenu(userDetail: IUser): Promise<string> {
    ChefService.userDetail = userDetail;
    return new Promise((resolve, reject) => {
      OutputService.printMessage(
        `Chef Menu:\n` +
          `1.W View Menu Items\n` +
          // `2. View Food Recommendations\n` +
          `3. Rollout Food to Employees\n` +
          `4. View Feedback Report\n` +
          `5. See Discard Items\n` +
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

  static rolloutFoodToEmployees() {
    return new Promise(async (resolve, reject) => {
      socketService.emitEvent("rolloutFoodToEmployees", {}, (response: any) => {
        OutputService.printTable(response.message);
        const recommendationIdForBreakfast: string =
          InputService.takeInputWithValidation(
            "Enter comma (,) separated recommendation_id for breakfast: "
          );
        const recommendationIdForLunch: string =
          InputService.takeInputWithValidation(
            "Enter comma (,) separated recommendation_id for lunch: "
          );
        const recommendationIdForDinner: string =
          InputService.takeInputWithValidation(
            "Enter comma (,) separated recommendation_id for dinner: "
          );

        const rolloutData = {
          breakfast: recommendationIdForBreakfast
            .split(",")
            .map((id) => Number(id.trim())),
          lunch: recommendationIdForLunch
            .split(",")
            .map((id) => Number(id.trim())),
          dinner: recommendationIdForDinner
            .split(",")
            .map((id) => Number(id.trim())),
        };

        console.log(rolloutData, "rolloutData");

        socketService.emitEvent(
          "chefRollout",
          rolloutData,
          (chefResponse: any) => {
            OutputService.printMessage(chefResponse);
            resolve(chefResponse);
          }
        );
        resolve(response);
      });
    });
  }

  static showDiscardItems() {
    socketService.emitEvent("showDiscardItems", {}, (response) => {
      OutputService.printMessage(response);
    });
  }
}
