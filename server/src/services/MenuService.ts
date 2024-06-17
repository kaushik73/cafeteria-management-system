// import { mealType } from "../common/contants";
import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { Menu } from "../models/Menu";
import SocketService from "./SocketService";
import DateService from "./DateService";

class MenuService {
  // constructor(){
  // private static dbOperation = new sqlDBOperations();
  // }
  static async addMenuItem(item: Menu) {
    try {
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

  static async updateMenuItem(item: any) {
    try {
      const result: any = await sqlDBOperations.update(
        "Menu",
        { menu_id: item.menu_id },
        item
      );
      // Insert notification into the Notification table
      const notificationMessage = `Menu item updated: ${item.name}`;

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

  static async deleteMenuItem(itemID: number) {
    try {
      const result = await sqlDBOperations.delete("Menu", { menu_id: itemID });
      return result;
    } catch (error: any) {
      throw new Error("Error deleting menu item: " + error.message);
    }
  }

  static async updateItemAvailability(itemID: number, availability: boolean) {
    try {
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

  static async generateSalesReport() {
    try {
      // Placeholder for generating sales report logic
      const report = { sales: 1000, itemsSold: 50 };
      return report;
    } catch (error: any) {
      throw new Error("Error generating sales report: " + error.message);
    }
  }
}

export default MenuService;
