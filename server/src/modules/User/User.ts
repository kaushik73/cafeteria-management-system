import { Menu } from "../../models/Menu";
import MenuService from "../../services/MenuService";

export default class User {
  static async handleShowMenuItems(
    data: Object,
    callback: (response: any) => void
  ) {
    try {
      console.log(data, "from handleShowMenuItems");

      const menuItems = await MenuService.showMenuItems(data);
      console.log({ message: menuItems });

      callback({ message: menuItems });
    } catch (error) {
      callback({ message: "Error getting menu items" });
      console.error("Error getting menu items:", error);
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
}
