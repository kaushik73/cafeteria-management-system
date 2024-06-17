import { Socket } from "socket.io";
import SocketService from "../../services/SocketService";
import NotificationService from "../../services/NotificationService";
import MenuService from "../../services/MenuService";
import FeedbackService from "../../services/FeedbackService";
import DateService from "../../services/DateService";
import { Menu } from "../../models/Menu";

class Employee {
  static registerHandlers(socketService: SocketService, socket: Socket) {
    console.log("in registerHandlers employee");

    socketService.registerEventHandler(
      socket,
      "seeNotifications",
      Employee.handleSeeNotifications
    );
    // socketService.registerEventHandler(
    //   socket,
    //   "giveFeedback",
    //   Employee.handleGiveFeedback
    // );
    socketService.registerEventHandler(
      socket,
      "giveFeedback",
      Employee.handleGiveFeedback
    );

    socketService.registerEventHandler(
      socket,
      "getMenuIdFromName",
      Employee.getMenuIdFromName
    );
    // same in admin
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

  static async getMenuIdFromName(
    data: string,
    callback: (response: any) => void
  ) {
    try {
      const result: Menu = await MenuService.getMenuIdFromName(data);
      console.log({ message: result.menu_id }, "itemID");

      callback({ message: result.menu_id });
    } catch (error) {
      callback({ message: "Error fetching itemID" });
      console.error("Error fetching itemID:", error);
    }
  }

  // same in admin
  static async handleShowMenuItems(
    data: Object,
    callback: (response: any) => void
  ) {
    try {
      console.log(data, "from handleShowMenuItems");

      const menuItems = await MenuService.showMenuItems(data);
      console.log({ message: menuItems });

      console.log("Before callback"); // Add this line
      // callback(menuItems);
      console.log("After callback"); // Add this line
      callback({ message: menuItems });
    } catch (error) {
      callback({ message: "Error getting menu items" });
      console.error("Error getting menu items:", error);
    }
  }
}
export default Employee;
