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

class Chef {
  static registerHandlers(socketService: SocketService, socket: Socket) {
    console.log("in registerHandlers Chef");

    socketService.registerEventHandler(
      socket,
      "showMenuItems",
      Chef.handleShowMenuItems
    );

    socketService.registerEventHandler(
      socket,
      "viewFoodRecommendation",
      Chef.viewFoodRecommendation
    );
    socketService.registerEventHandler(
      socket,
      "rolloutFoodToEmployees",
      Chef.rolloutFoodToEmployees
    );

    socketService.registerEventHandler(
      socket,
      "showDiscardItems",
      Chef.showDiscardItems
    );
    socketService.registerEventHandler(
      socket,
      "viewFeedbackReport",
      Chef.viewFeedbackReport
    );
    socketService.registerEventHandler(
      socket,
      "viewEmployeeVotes",
      Chef.viewEmployeeVotes
    );
  }

  static async handleShowMenuItems(
    data: Object,
    callback: (response: any) => void
  ) {
    User.handleShowMenuItems(data, callback);
  }

  static async viewFeedbackReport(
    data: any,
    callback: (response: any) => void
  ) {
    try {
      const { from, to } = data;

      const formattedFrom = from;
      const formattedTo = to;

      // const formattedFrom = DateService.formatDate(from);
      // const formattedTo = DateService.formatDate(to);
      console.log("dates in viewFeedbackReport", formattedFrom, formattedTo);

      const report = await ReportService.viewFeedbackReport(
        formattedFrom,
        formattedTo
      );
      callback({ message: report });
    } catch (error) {
      callback({ message: "Error fetching report" });
      console.error("Error fetching report:", error);
    }
  }

  static async showDiscardItems(
    data: {},
    callback: (response: { message: Menu[] }) => void
  ) {
    try {
      await recommendationEngine.setDiscardStatus();
      const discardMenu = await MenuService.getItemsToDiscard();
      callback({ message: discardMenu });
    } catch (error) {
      console.error("Error getting discard Items:", error);
      throw new Error("Error getting discard Items");
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
      const nextDay = DateService.getNthPreviousDate(-1);
      const recommendationsExist =
        await RecommendationService.checkRecommendationsExist(
          data.mealType,
          nextDay
        );

      if (!recommendationsExist) {
        await engineRecommendationService.generateNextDayRecommendations(
          data.mealType
        );
      }

      const recommendations = await RecommendationService.viewRecommendedFood(
        data.mealType
      );
      callback({
        status: "success",
        message: `Recommendations for ${data.mealType} retrieved successfully.`,
        recommendations,
      });
    } catch (error) {
      console.error("Error retrieving recommendations:", error);
      callback({
        status: "error",
        message: `Error retrieving recommendations for ${data.mealType}.`,
        recommendations: [],
      });
    }
  }

  static async rolloutFoodToEmployees(
    data: { [key: string]: number[] },
    callback: (response: any) => void
  ) {
    console.log(data);
    try {
      const updatedRecommendations: Recommendation[] = [];

      for (const mealType of Object.keys(data)) {
        const recommendationIds = data[mealType];
        console.log(
          "mealType",
          mealType,
          "recommendationIds",
          recommendationIds
        );

        for (const recommendationId of recommendationIds) {
          if (recommendationId == 0) {
            break;
          }
          const updatedRecommendation: any = await sqlDBOperations.update(
            "Recommendation",
            { rollout_to_employee: true },
            { recommendation_id: recommendationId }
          );
          if (updatedRecommendation) {
            updatedRecommendations.push(updatedRecommendation);
          }
        }
      }

      console.log("Updated recommendations:", updatedRecommendations);
      callback("Chef Roll out Success");
    } catch (error) {
      console.error("Error in rolloutFoodToEmployees:", error);
      callback("Chef Rolledout Failed");
    }
  }

  static async viewEmployeeVotes(
    data: {},
    callback: (response: { employeeVotes: VotedItem[] }) => void
  ) {
    try {
      const employeeVotes: any[] = await VoteService.getEmployeeVotes();
      callback({ employeeVotes });
      console.log("success rolloutFoodToEmployees:");
    } catch (error) {
      console.error("Error in rolloutFoodToEmployees:", error);
    }
  }
}
export default Chef;
