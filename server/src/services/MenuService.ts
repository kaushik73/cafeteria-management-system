// import { mealType } from "../common/contants";
import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { Menu } from "../models/Menu";
import SocketService from "./SocketService";
import DateService from "./DateService";

class MenuService {
  static async addMenuItem(item: Menu) {
    try {
      console.log("item", item);

      const result: any = await sqlDBOperations.insert("Menu", item);
      console.log("Menu Added : ", result);

      // Insert notification into the Notification table
      const notificationMessage = `added ${item.item_name} for ${item.meal_type}`;
      await this.addNotification(
        "menuUpdate",
        notificationMessage,
        result.insertId
        //defaultNewItemID
      );
      // await this.sendMenuUpdateNotification(notificationMessage);

      return result;
    } catch (error: any) {
      throw new Error("Error adding menu item: " + error.message);
    }
  }

  static async updateMenuItem(item: Menu) {
    try {
      const result: any = await sqlDBOperations.update("Menu", item, {
        menu_id: item.menu_id,
      });
      // Insert notification into the Notification table
      const notificationMessage = `Menu item updated: ${item.item_name}`;

      await this.addNotification(
        "menuUpdate",
        notificationMessage,
        result.insertId
      );

      // Notify all employees
      // await this.sendMenuUpdateNotification(notificationMessage);
      return result;
    } catch (error: any) {
      throw new Error("Error updating menu item: " + error.message);
    }
  }

  static async deleteMenuItem(itemID: number) {
    try {
      const result = await sqlDBOperations.delete("Menu", { menu_id: itemID });
      return result;
    } catch (error: any) {
      throw new Error("Error deleting data");
    }
  }

  static async getMenuIdFromName(item_name: string) {
    const itemID: any = await sqlDBOperations.selectOne("menu", {
      item_name,
    });
    return itemID;
  }

  static async addNotification(type: string, message: string, menuId: number) {
    const currentDate = DateService.getCurrentDate();
    console.log("addNotification", currentDate);

    const notification = {
      notification_type: type,
      message: message,
      notification_date: currentDate,
      menu_id: menuId,
    };

    try {
      await sqlDBOperations.insert("Notification", notification);
      console.log("Notification added successfully:", notification);
    } catch (error: any) {
      throw new Error("Error adding notification: " + error.message);
    }
  }
  // Notify all employees
  // static async sendMenuUpdateNotification(message: string) {
  //   try {
  //     console.log("Menu update notification sent:", message);
  //     SocketService.emitToRoom("employees", "menuUpdate", message);
  //   } catch (error: any) {
  //     throw new Error(
  //       "Error sending menu update notification: " + error.message
  //     );
  //   }
  // }
  static async showMenuItems(orderBy: Object) {
    try {
      const result = await sqlDBOperations.selectAll("Menu", {}, orderBy, {});
      return result;
    } catch (error: any) {
      throw new Error("Error showing menu item: " + error.message);
    }
  }

  static async updateItemAvailability(itemID: string, availability: boolean) {
    try {
      console.log("itemID, availability", itemID, availability);

      const result = await sqlDBOperations.update(
        "Menu",
        { availability_status: availability },
        { menu_id: itemID }
      );
      return result;
    } catch (error: any) {
      throw new Error("Error updating item availability: " + error.message);
    }
  }
}

export default MenuService;
