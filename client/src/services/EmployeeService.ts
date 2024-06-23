import InputService from "./InputService";
import OutputService from "./OutputService";
import { socketService } from "./SocketService";
import validateService from "../validations/CommonValidation";
import { IUser } from "../models/User";
import { SharedService } from "./SharedService";
import { Response } from "../common/types";

export default class EmployeeService {
  static userDetail: IUser;
  private static sharedService: SharedService;
  static {
    EmployeeService.sharedService = new SharedService();
  }
  static showEmployeeMenu(userDetail: IUser): Promise<string> {
    EmployeeService.userDetail = userDetail;
    return new Promise((resolve, reject) => {
      OutputService.printMessage(
        `Employee Menu:\n` +
          `1. See Menu\n` +
          `2. See Notifications\n` +
          `3. View Recommended Food\n` +
          `4. Vote for Recommended Food\n` +
          `5. Give Feedback\n` +
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
  static async viewRecommendedFood() {
    return new Promise((resolve, reject) => {
      socketService.emitEvent(
        "viewRecommendedFood",
        {},
        (response: Response<{ userDetail: IUser | null }>) => {
          const recommendedFood = response.data;
          if (!recommendedFood) {
            reject("No Food is available");
          } else {
            console.log(response, "asdgfhjmhng");

            OutputService.printTable(recommendedFood as unknown as any[]);
            resolve("viewRecommendedFood");
          }
        }
      );
    });
  }
  static async voteForRecommendedFood() {
    return new Promise((resolve, reject) => {
      socketService.emitEvent("voteForRecommendedFood", {}, (response: any) => {
        OutputService.printTable(response.message);
        //
        const voteIdForBreakfast: string = InputService.takeInputWithValidation(
          "Enter comma (,) separated recommendation_id for breakfast: "
        );

        const voteIdForLunch: string = InputService.takeInputWithValidation(
          "Enter comma (,) separated recommendation_id for lunch: "
        );
        const voteForDinner: string = InputService.takeInputWithValidation(
          "Enter comma (,) separated recommendation_id for dinner: "
        );

        const votesByEmployeeForNextDayFood = {
          breakfast: voteIdForBreakfast
            .split(",")
            .map((id) => Number(id.trim())),
          lunch: voteIdForLunch.split(",").map((id) => Number(id.trim())),
          dinner: voteForDinner.split(",").map((id) => Number(id.trim())),
        };
        //
        EmployeeService.sendVotesofEmployeeForNextDayFood(
          votesByEmployeeForNextDayFood
        );
        resolve(response.message);
      });
    });
  }

  // not implemented
  static sendVotesofEmployeeForNextDayFood(votesByEmployeeForNextDayFood: any) {
    return new Promise((resolve, reject) => {
      socketService.emitEvent(
        "sendVotesofEmployeeForNextDayFood",
        { votesByEmployeeForNextDayFood },
        (response: any) => {
          OutputService.printTable(response.message);
          //
        }
      );
    });
  }
}
