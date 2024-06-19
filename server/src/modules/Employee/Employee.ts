import { Socket } from "socket.io";
import SocketService from "../../services/SocketService";
import NotificationService from "../../services/NotificationService";
import MenuService from "../../services/MenuService";
import FeedbackService from "../../services/FeedbackService";
import DateService from "../../services/DateService";
import { Menu } from "../../models/Menu";
import User from "../User/User";

class Employee {
  static registerHandlers(socketService: SocketService, socket: Socket) {
    console.log("in registerHandlers employee");

    socketService.registerEventHandler(
      socket,
      "seeNotifications",
      Employee.handleSeeNotifications
    );
    socketService.registerEventHandler(
      socket,
      "showMenuItems",
      Employee.handleShowMenuItems
    );
    socketService.registerEventHandler(
      socket,
      "giveFeedback",
      Employee.handleGiveFeedback
    );

    socketService.registerEventHandler(
      socket,
      "getMenuIdFromName",
      User.getMenuIdFromName
    );

    socketService.registerEventHandler(
      socket,
      "showMenuItems",
      Employee.handleShowMenuItems
    );
  }
  static async handleSeeNotifications(
    data: any,
    callback: (response: any) => void
  ) {
    try {
      const notifications = await NotificationService.seeNotifications();
      callback({ message: notifications });
    } catch (error) {
      callback({ message: "Error fetching notifications" });
      console.error("Error fetching notifications:", error);
    }
  }

  static async handleGiveFeedback(
    data: any,
    callback: (response: any) => void
  ) {
    try {
      const feedback_date = DateService.getCurrentDate();
      const updatedData = { feedback_date, ...data };
      console.log("handleGiveFeedback", updatedData);
      const feedback = await FeedbackService.giveFeedback(updatedData);
      console.log("message - feedback", { message: feedback });
      callback({ message: "Feedback Added" });
    } catch (error) {
      callback({ message: "Error giving feedback" });
      console.error("Error giving feedback:", error);
    }
  }

  static async handleShowMenuItems(
    data: any,
    callback: (response: any) => void
  ) {
    User.handleShowMenuItems(data, callback);
  }
}
export default Employee;
