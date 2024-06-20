import { Socket } from "socket.io";
import SocketService from "../../services/SocketService";
import ReportService from "../../services/ReportService";
import User from "../User/User";
import { recommendationEngine } from "../../engine";

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

  static async chefRollout(data: Object, callback: (response: any) => void) {
    await recommendationEngine.getNextDayRecommendation((data: any) => {
      callback("Chef Rolledout Success");
    });
  }
}
export default Chef;
