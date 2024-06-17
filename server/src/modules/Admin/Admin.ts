import { Socket } from "socket.io";
import MenuService from "../../services/MenuService";
import SocketService from "../../services/SocketService";
import NotificationService from "../../services/NotificationService";
import FeedbackService from "../../services/FeedbackService";

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
    // socketService.registerEventHandler(
    //   socket,
    //   "seeNotifications",
    //   Admin.handleSeeNotifications
    // );
  }

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

  static async viewFeedbacks(data: any, callback: (response: any) => void) {
    try {
      console.log("viewFeedbacks from server - Admnin.ts", data);

      const feedbacks = await FeedbackService.viewFeedbacks(data);
      callback({ message: feedbacks });
    } catch (error) {
      callback({ message: "Error getting Feedbacks" });
      console.error("Error getting Feedbacks:", error);
    }
  }

  static async handleDeleteMenuItem(
    data: any,
    callback: (response: any) => void
  ) {
    try {
      await MenuService.deleteMenuItem(data.itemID);
      callback({ message: "Menu item deleted" });
    } catch (error) {
      callback({ message: "Error deleting menu item" });
      console.error("Error deleting menu item:", error);
    }
  }
  // static async handleSeeNotifications(
  //   data: any,
  //   callback: (response: any) => void
  // ) {
  //   try {
  //     const notifications = await NotificationService.seeNotifications();
  //     callback(notifications);
  //   } catch (error) {
  //     callback({ message: "Error fetching notifications" });
  //     console.error("Error fetching notifications:", error);
  //   }
  // }

  //   socketService.registerEventHandler(
  //     "updateItemAvailability",
  //     async (socket, data, callback) => {
  //       try {
  //         await MenuService.updateItemAvailability(data.itemID, data.availability);
  //         callback({ message: "Item availability updated" });
  //       } catch (error) {
  //         callback({ message: "Error updating item availability" });
  //         console.error("Error updating item availability:", error);
  //       }
  //     }
  //   );

  //   socketService.registerEventHandler(
  //     "generateSalesReport",
  //     async (socket, data, callback) => {
  //       try {
  //         const report = await MenuService.generateSalesReport();
  //         callback(report);
  //       } catch (error) {
  //         callback({ message: "Error generating sales report" });
  //         console.error("Error generating sales report:", error);
  //       }
  //     }
  //   );
}
