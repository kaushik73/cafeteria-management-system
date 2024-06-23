import { Socket } from "socket.io";
import SocketService from "../../services/SocketService";
import ReportService from "../../services/ReportService";
import User from "../User/User";
import { recommendationEngine } from "../../engine";
import { sqlDBOperations } from "../../database/operations/sqlDBOperations";
import { Recommendation } from "../../models/Recommendation";
import NotificationService from "../../services/NotificationService";
import MenuService from "../../services/MenuService";
import RecommendationService from "../../services/RecommendationService";

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
      "seeRecommendedFood",
      Chef.seeRecommendedFood
    );
    socketService.registerEventHandler(
      socket,
      "rolloutFoodToEmployees",
      Chef.rolloutFoodToEmployees
    );
    socketService.registerEventHandler(socket, "chefRollout", Chef.chefRollout);
    socketService.registerEventHandler(
      socket,
      "showDiscardItems",
      Chef.showDiscardItems
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

  static async seeRecommendedFood(data: any, callback: any) {
<<<<<<< HEAD
    // await recommendationEngine.getNextDayRecommendations((data: any) => {
    //   console.log("data-getNextDayRecommendation", data);
    //   callback(data);
    // });
  }

=======
    await recommendationEngine.getNextDayRecommendations((data: any) => {
      console.log("data-getNextDayRecommendation", data);
      callback(data);
    });
  }
>>>>>>> e10dfd21a8b093fc80a8046e1f240ed46a74aa27
  static async rolloutFoodToEmployees(
    data: Object,
    callback: (response: any) => void
  ) {
<<<<<<< HEAD
    // await recommendationEngine.generateNextDayRecommendations((data: any) => {
    //   console.log("generateNextDayRecommendation", data);
    // });
=======
    await recommendationEngine.generateNextDayRecommendation((data: any) => {
      console.log("generateNextDayRecommendation", data);
    });
>>>>>>> e10dfd21a8b093fc80a8046e1f240ed46a74aa27
  }
  static async showDiscardItems(
    data: Object,
    callback: (response: any) => void
  ) {}

  static async chefRollout(
    data: { [key: string]: number[] },
    callback: (response: any) => void
  ) {
    await RecommendationService.chefRollout(data, callback);
  }
}
export default Chef;
