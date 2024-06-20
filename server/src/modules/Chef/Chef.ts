import { Socket } from "socket.io";
import SocketService from "../../services/SocketService";
import ReportService from "../../services/ReportService";
import User from "../User/User";
import { recommendationEngine } from "../../engine";
import { sqlDBOperations } from "../../database/operations/sqlDBOperations";
import { Recommendation } from "../../models/Recommendation";

class Chef {
  static registerHandlers(socketService: SocketService, socket: Socket) {
    console.log("in registerHandlers Chef");

    socketService.registerEventHandler(
      socket,
      "viewFeedbackReport",
      Chef.viewFeedbackReport
    );
    socketService.registerEventHandler(
      socket,
      "showMenuItems",
      Chef.handleShowMenuItems
    );
    socketService.registerEventHandler(
      socket,
      "rolloutFoodToEmployees",
      Chef.rolloutFoodToEmployees
    );
    socketService.registerEventHandler(socket, "chefRollout", Chef.chefRollout);
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

  static async rolloutFoodToEmployees(
    data: Object,
    callback: (response: any) => void
  ) {
    User.handleShowMenuItems(data, callback);
    // todo : uncomment this
    await recommendationEngine.generateNextDayRecommendation((data: any) => {
      console.log("generateNextDayRecommendation", data);
    });
    await recommendationEngine.getNextDayRecommendation((data: any) => {
      console.log("data-getNextDayRecommendation", data.recommendations);
      callback(data.recommendations);
    });
  }

  // not working
  static async chefRollout(
    data: { [key: string]: number[] },
    callback: (response: any) => void
  ) {
    console.log(data);
    try {
      const updatedRecommendations: Recommendation[] = [];

      for (const mealType of Object.keys(data)) {
        const recommendationIds = data[mealType];

        for (const recommendationId of recommendationIds) {
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
      callback("Chef Rolledout Success");
    } catch (error) {
      console.error("Error in chefRollout:", error);
      callback("Chef Rolledout Failed");
    }
  }
}
export default Chef;
