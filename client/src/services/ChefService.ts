import { IUser } from "../models/User";
import CommonValidations from "../validations/CommonValidation";
import { SharedService } from "./SharedService";
import InputService from "./InputService";
import OutputService from "./OutputService";
import { socketService } from "./SocketService";
import { Menu, allowedMealTypes, MealType } from "../models/Menu";
import { Recommendation } from "../models/Recommendation";
import { VotedItem } from "../models/VotedItem";
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
          `2. View Food Recommendations\n` +
          `3. Rollout Food to Employees\n` +
          `4. See Discard Items\n` +
          `5. View Feedback Report\n` +
          `6. View Employee Votes\n` +
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

  // work start :
  static async viewFoodRecommendation() {
    try {
      await this.viewFoodRecommendationForMeal("breakfast");
      await this.viewFoodRecommendationForMeal("lunch");
      await this.viewFoodRecommendationForMeal("dinner");
    } catch (error) {
      console.error("Error viewing food recommendations:", error);
    }
  }

  static async viewFoodRecommendationForMeal(mealType: MealType) {
    return new Promise((resolve, reject) => {
      socketService.emitEvent(
        "viewFoodRecommendation",
        { mealType },
        (chefResponse: {
          status: string;
          message: string;
          recommendations: Recommendation[];
        }) => {
          OutputService.printMessage(`Recommendations for ${mealType}:`);
          OutputService.printTable(chefResponse.recommendations);
          resolve(chefResponse);
        }
      );
    });
  }

  static rolloutFoodToEmployees() {
    return new Promise(async (resolve, reject) => {
      // socketService.emitEvent("rolloutFoodToEmployees", {}, (response: any) => {
      // OutputService.printTable(response.message);
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
        "rolloutFoodToEmployees",
        rolloutData,
        (chefResponse: any) => {
          OutputService.printMessage(chefResponse);
          resolve(chefResponse);
        }
      );
    });
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

  static viewEmployeeVotes() {
    return new Promise((resolve, reject) => {
      socketService.emitEvent(
        "viewEmployeeVotes",
        {},
        (response: { employeeVotes: VotedItem[] }) => {
          OutputService.printTable(response.employeeVotes);
          resolve(response.employeeVotes);
        }
      );
    });
  }
}
