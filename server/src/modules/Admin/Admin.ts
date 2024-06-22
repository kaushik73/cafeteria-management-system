import { Socket } from "socket.io";
import MenuService from "../../services/MenuService";
import SocketService from "../../services/SocketService";
import FeedbackService from "../../services/FeedbackService";
import User from "../User/User";

export default class Admin {
  static registerHandlers(socketService: SocketService, socket: Socket) {
    console.log("in registerHandlers admin");

    socketService.registerEventHandler(
      socket,
      "addMenuItem",
      Admin.handleAddMenuItem
    );
    socketService.registerEventHandler(
      socket,
      "viewFeedbacks",
      Admin.viewFeedbacks
    );

    socketService.registerEventHandler(
      socket,
      "updateMenuItem",
      Admin.handleUpdateMenuItem
    );

    socketService.registerEventHandler(
      socket,
      "deleteMenuItem",
      Admin.handleDeleteMenuItem
    );

    socketService.registerEventHandler(
      socket,
      "showMenuItems",
      Admin.handleShowMenuItems
    );
    socketService.registerEventHandler(
      socket,
      "updateItemAvailability",
      Admin.handleUpdateItemAvailability
    );
  }

  static async handleShowMenuItems(
    data: Object,
    callback: (response: any) => void
  ) {
    User.handleShowMenuItems(data, callback);
  }

  static async handleAddMenuItem(data: any, callback: (response: any) => void) {
    try {
      await MenuService.addMenuItem(data);
      callback({ message: "Menu item added" });
    } catch (error) {
      callback({ message: "Error adding menu item" });
      console.error("Error adding menu item:", error);
    }
  }

  static async handleUpdateMenuItem(
    data: any,
    callback: (response: any) => void
  ) {
    try {
      await MenuService.updateMenuItem(data);
      callback({ message: "Menu item updated" });
    } catch (error) {
      callback({ message: "Error updating menu item" });
      console.error("Error updating menu item:", error);
    }
  }

  static async handleUpdateItemAvailability(
    data: any,
    callback: (response: any) => void
  ) {
    try {
      console.log("handleUpdateItemAvailability inside");

      const result = await MenuService.updateItemAvailability(
        data.itemID,
        data.availability
      );
      result == 1
        ? callback({ message: "Item availability updated" })
        : callback({ message: "Error in Item availability updated" });

      console.log(result, "result ");
    } catch (error) {
      callback({ message: "Error updating item availability" });
      console.error("Error updating item availability:", error);
    }
  }

  static async handleDeleteMenuItem(
    data: any,
    callback: (response: any) => void
  ) {
    try {
      const result = await MenuService.deleteMenuItem(data);
      console.log("result before callbaclk", result);

      callback({ message: "Menu item deleted" });
    } catch (error) {
      callback({ message: "Error deleting menu item" });
      console.error("Error deleting menu item:", error);
    }
  }

  static async viewFeedbacks(data: any, callback: (response: any) => void) {
    try {
      const feedbacks = await FeedbackService.viewFeedbacks(data);
      callback({ message: feedbacks });
    } catch (error) {
      callback({ message: "Error getting Feedbacks" });
      console.error("Error getting Feedbacks:", error);
    }
  }
}
