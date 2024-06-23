import { Socket } from "socket.io";
import MenuService from "../../services/MenuService";
import SocketService from "../../services/SocketService";
import FeedbackService from "../../services/FeedbackService";
import NotificationService from "../../services/NotificationService";
import { Menu } from "../../models/Menu";
import { ResultSetHeader } from "mysql2";
import LogService from "../../services/LogService";
import { Feedback } from "../../models/Feedback";
import userDetailStore from "../../store/userDetailStore";
import User from "../User/User";
import { IUser } from "../../models/User";
import ReportService from "../../services/ReportService";
import { Log } from "../../models/Log";
import { recommendationEngine } from "../../engine";
import { DiscardMenuFeedback } from "../../models/DiscardMenuFeedback";

export default class Admin {
  static registerHandlers(socketService: SocketService, socket: Socket) {
    socketService.registerEventHandler(
      socket,
      "showMenuItems",
      Admin.handleShowMenuItems
    );

    socketService.registerEventHandler(
      socket,
      "addMenuItem",
      Admin.handleAddMenuItem
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
      "updateItemAvailability",
      Admin.handleUpdateItemAvailability
    );

    socketService.registerEventHandler(
      socket,
      "viewFeedbacks",
      Admin.viewFeedbacks
    );
    socketService.registerEventHandler(
      socket,
      "viewFeedbackReport",
      Admin.viewFeedbackReport
    );

    socketService.registerEventHandler(
      socket,
      "showDiscardItems",
      Admin.showDiscardItems
    );

    socketService.registerEventHandler(
      socket,
      "removeDiscardItem",
      Admin.removeDiscardItem
    );
    socketService.registerEventHandler(
      socket,
      "detailedFeedbackForDiscardMenu",
      Admin.detailedFeedbackForDiscardMenu
    );
    socketService.registerEventHandler(socket, "viewLog", Admin.viewLog);
  }

  static async handleShowMenuItems(
    data: Object,
    callback: (response: any) => void
  ) {
    User.handleShowMenuItems(data, callback);
  }

  static async handleAddMenuItem(
    item: Menu,
    callback: (response: any) => void
  ) {
    try {
      const addedMenu: ResultSetHeader = await MenuService.addMenuItem(item);
      await NotificationService.addNotification(
        "menuUpdate",
        `added ${item.item_name} for ${item.meal_type}`,
        addedMenu.insertId
      );
      callback({ message: "Menu item added" });
    } catch (error) {
      callback({ message: "Error adding menu item" });
      console.error("Error adding menu item:", error);
    }
  }

  static async handleUpdateMenuItem(
    item: Menu,
    callback: (response: any) => void
  ) {
    try {
      const updatedMenu: ResultSetHeader = await MenuService.updateMenuItem(
        item
      );

      console.log("updatedMenu", updatedMenu);
      const MenuDetail: Menu = (await MenuService.getMenuDetailFromName(
        item.item_name
      )) as Menu;
      await NotificationService.addNotification(
        "menuUpdate",
        `Menu item updated: ${item.item_name}`,
        MenuDetail.menu_id
      );
      callback({ message: "Menu item updated" });
    } catch (error) {
      callback({ message: "Error updating menu item" });
      console.error("Error updating menu item:", error);
    }
  }

  static async handleDeleteMenuItem(
    item: { menu_id: number },
    callback: (response: any) => void
  ) {
    try {
      const MenuDetail: Menu = (await MenuService.getMenuDetailFromId(
        item.menu_id
      )) as Menu;
      await NotificationService.addNotification(
        "menuUpdate",
        `Deleted ${MenuDetail.item_name} from ${MenuDetail.meal_type}`,
        item.menu_id
      );
      const deletedMenu: ResultSetHeader = await MenuService.deleteMenuItem(
        item.menu_id
      );
      console.log("result before callback", deletedMenu);

      callback({ message: "Menu item deleted" });
    } catch (error) {
      callback({ message: "Error deleting menu item" });
      console.error("Error deleting menu item:", error);
    }
  }

  static async handleUpdateItemAvailability(
    data: { menu_id: number; availability_status: boolean },
    callback: (response: any) => void
  ) {
    try {
      console.log("handleUpdateItemAvailability inside");

      const result: ResultSetHeader = await MenuService.updateItemAvailability(
        data.menu_id,
        data.availability_status
      );
      const MenuDetail: Menu = (await MenuService.getMenuDetailFromId(
        data.menu_id
      )) as Menu;
      const avaialabityStatus = data.availability_status
        ? "available"
        : "not available";
      await NotificationService.addNotification(
        "menuUpdate",
        `Item ${MenuDetail.item_name} is ${avaialabityStatus} to order`,
        data.menu_id
      );

      result.insertId == 1
        ? callback({ message: "Item availability updated" })
        : callback({ message: "Error in Item availability updated" });

      console.log(result, "result ");
    } catch (error) {
      callback({ message: "Error updating item availability" });
      console.error("Error updating item availability:", error);
    }
  }

  static async viewFeedbacks(
    data: { menu_id: number },
    callback: (response: { message: Feedback[] }) => void
  ) {
    try {
      const feedbacks: Feedback[] = await FeedbackService.viewFeedbacks(
        data.menu_id
      );
      const userDetail: IUser | null = await userDetailStore.getUserDetail();

      const action = `For Menu id : ${data.menu_id} ${userDetail?.name} view Feedback`;
      const logOutput = await LogService.insertIntoLog(
        action,
        userDetail?.user_id as number
      );
      callback({ message: feedbacks });
    } catch (error) {
      console.error("Error getting Feedbacks:", error);
      throw new Error("Error getting Feedbacks");
    }
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

  static async removeDiscardItem(
    data: { menuIdArray: number[] },
    callback: (response: any) => void
  ) {
    try {
      data.menuIdArray.map((menuId) => {
        console.log(menuId);
        // todo : uncomment this to delete discard items
        // MenuService.deleteMenuItem(menuId);
      });
      callback({ message: "Discard Items Deleted Successfully" });
    } catch (error) {
      callback({ message: "Error removing discard Items" });
      console.error("Error removing discard Items:", error);
    }
  }

  static async detailedFeedbackForDiscardMenu(
    data: { menuIdArray: number[] },
    callback: (response: { message: string }) => void
  ) {
    try {
      data.menuIdArray.map(async (itemId) => {
        const menuItem: Menu = (await MenuService.getMenuDetailFromId(
          itemId
        )) as Menu;

        const question1 = `Q1. What did you not like about ${menuItem.item_name} ?`;
        const question2 = `Q2. How would you like ${menuItem.item_name} to taste ?`;
        const question3 = `Q3. Share your mom recipie for ${menuItem.item_name} ?`;
        await Admin.handleAddToDiscardMenuFeedback(question1, itemId);
        await Admin.handleAddToDiscardMenuFeedback(question2, itemId);
        await Admin.handleAddToDiscardMenuFeedback(question3, itemId);
        callback({ message: "added to discard menu feedback" });
      });
    } catch (error) {
      callback({ message: "Error detailedFeedbackForDiscardMenu" });
      console.error("Error detailedFeedbackForDiscardMenu:", error);
    }
  }

  static async handleAddToDiscardMenuFeedback(
    question: string,
    itemId: number
  ) {
    const DiscardMenuFeedback: DiscardMenuFeedback = {
      question: question,
      menu_id: itemId,
    };
    await FeedbackService.addToDiscardMenuFeedback(DiscardMenuFeedback);
  }

  static async viewLog(
    data: {},
    callback: (response: { message: Log[] }) => void
  ) {
    const logs: Log[] = await LogService.getLog();

    callback({ message: logs });
    try {
    } catch (error) {
      console.error("Error removing discard Items:", error);
      throw new Error("Error removing discard Items");
    }
  }
}
