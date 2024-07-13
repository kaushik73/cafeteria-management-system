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
import { IUserAndPreference } from "../../models/User";
import ReportService from "../../services/ReportService";
import { Log } from "../../models/Log";
import { recommendationEngine } from "../../engine";
import { DiscardMenuFeedback } from "../../models/DiscardMenuFeedback";

export default class Admin {
  static registerHandlers(socketService: SocketService, socket: Socket) {
    const handlers: { [event: string]: (data: any, callback: any) => void } = {
      showMenuItems: Admin.handleShowMenuItems,
      addMenuItem: Admin.handleAddMenuItem,
      updateMenuItem: Admin.handleUpdateMenuItem,
      deleteMenuItem: Admin.handleDeleteMenuItem,
      updateItemAvailability: Admin.handleUpdateItemAvailability,
      viewFeedbacks: Admin.viewFeedbacks,
      viewFeedbackReport: Admin.viewFeedbackReport,
      showDiscardItems: Admin.showDiscardItems,
      removeDiscardItem: Admin.removeDiscardItem,
      detailedFeedbackForDiscardMenu: Admin.detailedFeedbackForDiscardMenu,
      viewLog: Admin.viewLog,
    };

    for (const [event, handler] of Object.entries(handlers)) {
      socketService.registerEventHandler(socket, event, handler);
    }
  }

  private static async getUserDetailAndLogAction(action: string) {
    const userDetail: IUserAndPreference | null =
      await userDetailStore.getUserDetail();
    if (userDetail) {
      await LogService.logAction(`${userDetail.name} ${action}`);
    }
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
      await Admin.getUserDetailAndLogAction(
        `Added Menu Item: ${item.item_name}`
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
      const updatedMenu = Admin.createUpdatedMenu(item);
      if (Object.keys(updatedMenu).length === 0) {
        callback({ message: "No field to update" });
        return;
      }
      await MenuService.updateMenuItem(updatedMenu);
      const menuDetail: Menu = (await MenuService.getMenuDetailFromId(
        item.menu_id
      )) as Menu;
      await NotificationService.addNotification(
        "menuUpdate",
        `Menu item updated: ${menuDetail.item_name}`,
        menuDetail.menu_id
      );
      await Admin.getUserDetailAndLogAction(
        `Updated Menu Item: ${menuDetail.item_name}`
      );
      callback({ message: "Menu item updated" });
    } catch (error) {
      callback({ message: "Error updating menu item" });
      console.error("Error updating menu item:", error);
    }
  }

  private static createUpdatedMenu(item: Menu): { [key: string]: any } {
    const updatedMenu: { [key: string]: any } = {};
    if (item.menu_id) updatedMenu.menu_id = item.menu_id;
    if (item.item_name) updatedMenu.item_name = item.item_name;
    if (item.price) updatedMenu.price = item.price;
    if (item.availability_status !== undefined)
      updatedMenu.availability_status = item.availability_status;
    if (item.meal_type) updatedMenu.meal_type = item.meal_type;
    if (item.dietary_type) updatedMenu.dietary_type = item.dietary_type;
    if (item.spice_type) updatedMenu.spice_type = item.spice_type;
    if (item.cuisine_type) updatedMenu.cuisine_type = item.cuisine_type;
    if (item.sweet_tooth_type !== undefined)
      updatedMenu.sweet_tooth_type = item.sweet_tooth_type;
    return updatedMenu;
  }

  static async handleDeleteMenuItem(
    item: { menu_id: number },
    callback: (response: any) => void
  ) {
    try {
      const menuDetail: Menu = (await MenuService.getMenuDetailFromId(
        item.menu_id
      )) as Menu;
      await NotificationService.addNotification(
        "menuUpdate",
        `Deleted ${menuDetail.item_name} from ${menuDetail.meal_type}`,
        item.menu_id
      );
      await MenuService.deleteMenuItem(item.menu_id);
      await Admin.getUserDetailAndLogAction(
        `Deleted Menu Item: ${menuDetail.item_name}`
      );
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
      const result: ResultSetHeader = await MenuService.updateItemAvailability(
        data.menu_id,
        data.availability_status
      );
      const menuDetail: Menu = (await MenuService.getMenuDetailFromId(
        data.menu_id
      )) as Menu;
      const availabilityStatus = data.availability_status
        ? "available"
        : "not available";
      await NotificationService.addNotification(
        "menuUpdate",
        `Item ${menuDetail.item_name} is ${availabilityStatus} to order`,
        data.menu_id
      );
      await Admin.getUserDetailAndLogAction(
        `Updated Availability for Menu Item: ${menuDetail.item_name}`
      );
      callback({
        message:
          result.insertId == 1
            ? "Item availability updated"
            : "Error in Item availability updated",
      });
    } catch (error) {
      callback({ message: "Error updating item availability" });
      console.error("Error updating item availability:", error);
    }
  }

  static async viewFeedbacks(
    data: { menu_id: number },
    callback: (response: { message: Feedback[] | string }) => void
  ) {
    try {
      const feedbacks: Feedback[] = await FeedbackService.viewFeedbacks(
        data.menu_id
      );
      await Admin.getUserDetailAndLogAction(
        `For Menu id : ${data.menu_id} viewed Feedback`
      );
      callback({ message: feedbacks });
    } catch (error) {
      console.error("Error getting Feedbacks:", error);
      callback({ message: "Error getting Feedbacks" });
    }
  }

  static async viewFeedbackReport(
    data: { fromInput: string; toInput: string },
    callback: (response: any) => void
  ) {
    try {
      const { fromInput: From, toInput: To } = data;
      const report = await ReportService.viewFeedbackReport(From, To);
      await Admin.getUserDetailAndLogAction(
        `Viewed Feedback Report from ${From} to ${To}`
      );
      callback({ message: report });
    } catch (error) {
      callback({ message: "Error fetching report" });
      console.error("Error fetching report:", error);
    }
  }

  static async showDiscardItems(
    data: {},
    callback: (response: { message: Menu[] | string }) => void
  ) {
    try {
      await recommendationEngine.setDiscardStatus();
      const discardMenu = await MenuService.getItemsToDiscard();
      await Admin.getUserDetailAndLogAction("Viewed Discard Items");
      callback({ message: discardMenu });
    } catch (error) {
      console.error("Error getting discard Items:", error);
      callback({ message: "Error getting discard Items" });
    }
  }

  static async removeDiscardItem(
    data: { menuIdArray: number[] },
    callback: (response: any) => void
  ) {
    try {
      for (const menuId of data.menuIdArray) {
        const menuDetail: Menu = (await MenuService.getMenuDetailFromId(
          menuId
        )) as Menu;
        if (menuDetail.is_discard) {
          await MenuService.deleteMenuItem(menuId);
          await NotificationService.addNotification(
            "menuUpdate",
            `Deleted ${menuDetail.item_name} from ${menuDetail.meal_type}`,
            menuId
          );
          await Admin.getUserDetailAndLogAction(
            `Removed Discard Item: ${menuDetail.item_name}`
          );
        } else {
          callback({ message: "Entered Menu ID is not in discard list" });
          return;
        }
      }
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
      for (const itemId of data.menuIdArray) {
        const menuItem: Menu = (await MenuService.getMenuDetailFromId(
          itemId
        )) as Menu;
        const questions = [
          `Q1. What did you not like about ${menuItem.item_name}?`,
          `Q2. How would you like ${menuItem.item_name} to taste?`,
          `Q3. Share your mom's recipe for ${menuItem.item_name}?`,
        ];
        for (const question of questions) {
          await Admin.handleAddToDiscardMenuFeedback(question, itemId);
        }
        await Admin.getUserDetailAndLogAction(
          `Requested detailed feedback for discard menu item: ${menuItem.item_name}`
        );
      }
      callback({ message: "Added to discard menu feedback" });
    } catch (error) {
      callback({ message: "Error detailedFeedbackForDiscardMenu" });
      console.error("Error detailedFeedbackForDiscardMenu:", error);
    }
  }

  static async handleAddToDiscardMenuFeedback(
    question: string,
    itemId: number
  ) {
    const discardMenuFeedback: DiscardMenuFeedback = {
      question,
      menu_id: itemId,
    };
    await FeedbackService.addToDiscardMenuFeedback(discardMenuFeedback);
  }

  static async viewLog(
    data: {},
    callback: (response: { message: Log[] | string }) => void
  ) {
    try {
      const logs: Log[] = await LogService.getLog();
      callback({ message: logs });
    } catch (error) {
      console.error("Error viewing logs:", error);
      callback({ message: "Error viewing logs" });
    }
  }
}
