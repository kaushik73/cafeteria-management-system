import { Socket } from "socket.io";
import SocketService from "../../services/SocketService";
import ReportService from "../../services/ReportService";
import User from "../User/User";
import { recommendationEngine } from "../../engine";
import { sqlDBOperations } from "../../database/operations/sqlDBOperations";
import { Recommendation } from "../../models/Recommendation";
import { MealType, Menu } from "../../models/Menu";
import MenuService from "../../services/MenuService";
import RecommendationService from "../../services/RecommendationService";
import DateService from "../../services/DateService";
import { engineRecommendationService } from "../../engine/services/EngineRecommendationService";
import { VotedItem } from "../../models/VotedItem";
import VoteService from "../../services/VoteService";
import NotificationService from "../../services/NotificationService";

class Chef {
  static registerHandlers(socketService: SocketService, socket: Socket) {
    const handlers: {
      [event: string]: (data: any, callback: (response: any) => void) => void;
    } = {
      showMenuItems: Chef.handleShowMenuItems,
      viewFoodRecommendation: Chef.handleViewFoodRecommendation,
      rolloutFoodToEmployees: Chef.handleRolloutFoodToEmployees,
      showDiscardItems: Chef.handleShowDiscardItems,
      viewFeedbackReport: Chef.handleViewFeedbackReport,
      viewEmployeeVotes: Chef.handleViewEmployeeVotes,
    };

    for (const [event, handler] of Object.entries(handlers)) {
      socketService.registerEventHandler(socket, event, handler);
    }
  }

  static async handleShowMenuItems(
    data: Object,
    callback: (response: any) => void
  ) {
    User.handleShowMenuItems(data, callback);
  }

  static async handleViewFeedbackReport(
    data: any,
    callback: (response: any) => void
  ) {
    try {
      const { from, to } = data;
      const report = await ReportService.viewFeedbackReport(from, to);
      callback({ message: report });
    } catch (error) {
      Chef.handleError(callback, "Error fetching report", error);
    }
  }

  static async handleShowDiscardItems(
    data: {},
    callback: (response: { message: Menu[] }) => void
  ) {
    try {
      await recommendationEngine.setDiscardStatus();
      const discardMenu = await MenuService.getItemsToDiscard();
      callback({ message: discardMenu });
    } catch (error) {
      Chef.handleError(callback, "Error getting discard Items", error);
    }
  }

  static async handleViewFoodRecommendation(
    data: { mealType: MealType },
    callback: (response: {
      status: string;
      message: string;
      recommendations: Recommendation[];
    }) => void
  ) {
    try {
      const today = DateService.getNthPreviousDate(0);
      const recommendationsExist =
        await RecommendationService.checkRecommendationsExist(
          data.mealType,
          today
        );

      if (!recommendationsExist) {
        await engineRecommendationService.generateNextDayRecommendations(
          data.mealType
        );
        NotificationService.addNotification(
          "recommendation",
          "Food Recommendations are out for tomorrow",
          null
        );
      }

      Chef.viewFoodRecommendation(data, callback);
    } catch (error) {
      Chef.handleError(
        callback,
        "Error generating food recommendations",
        error
      );
    }
  }

  static async viewFoodRecommendation(
    data: { mealType: MealType },
    callback: (response: {
      status: string;
      message: string;
      recommendations: Recommendation[];
    }) => void
  ) {
    try {
      const recommendations = await RecommendationService.viewRecommendedFood(
        data.mealType
      );
      callback({
        status: "success",
        message: `Recommendations for ${data.mealType} retrieved successfully.`,
        recommendations,
      });
    } catch (error) {
      Chef.handleError(
        callback,
        `Error retrieving recommendations for ${data.mealType}`,
        error
      );
    }
  }

  static async handleRolloutFoodToEmployees(
    data: { [key: string]: number[] },
    callback: (response: string) => void
  ) {
    try {
      const updatedRecommendations: Recommendation[] = [];

      for (const mealType of Object.keys(data)) {
        const menuIds = data[mealType];
        for (const menuId of menuIds) {
          if (menuId === 0) break;
          const updatedRecommendation = await sqlDBOperations.update(
            "Recommendation",
            { rollout_to_employee: true },
            { menu_id: menuId }
          );
          if (updatedRecommendation) {
            updatedRecommendations.push(
              updatedRecommendation as unknown as Recommendation
            );
          }
        }
      }
      callback("Chef Roll out Success");
    } catch (error) {
      Chef.handleError(callback, "Chef Rolled out Failed", error);
    }
  }

  static async handleViewEmployeeVotes(
    data: {},
    callback: (response: { employeeVotes: VotedItem[] | null }) => void
  ) {
    try {
      const employeeVotes: VotedItem[] | null =
        await VoteService.getEmployeeVotes();
      callback({ employeeVotes });
    } catch (error) {
      Chef.handleError(callback, "Error retrieving employee votes", error);
    }
  }

  private static handleError(
    callback: (response: any) => void,
    message: string,
    error: any
  ) {
    console.error(message, error);
    callback({ status: "error", message });
  }
}

export default Chef;
