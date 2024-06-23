import { ResultSetHeader } from "mysql2";
import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { Menu } from "../models/Menu";

class MenuService {
  static async addMenuItem(item: Menu) {
    try {
      console.log("addMenuItem- item", item);

      const result: ResultSetHeader = await sqlDBOperations.insert(
        "Menu",
        item
      );
      console.log("Menu Added : ", result);
      return result;
    } catch (error: any) {
      throw new Error("Error adding menu item: " + error.message);
    }
  }

  static async updateMenuItem(item: Menu) {
    try {
      const result: ResultSetHeader = await sqlDBOperations.update(
        "Menu",
        item,
        {
          menu_id: item.menu_id,
        }
      );

      // Notify all employees
      // await this.sendMenuUpdateNotification(notificationMessage);
      return result;
    } catch (error: any) {
      throw new Error("Error updating menu item: " + error.message);
    }
  }

  static async deleteMenuItem(menuId: number) {
    try {
      const result: ResultSetHeader = await sqlDBOperations.delete("Menu", {
        menu_id: menuId,
      });
      return result;
    } catch (error: any) {
      throw new Error("Error deleting item");
    }
  }
  static async getMenuDetailFromId(MenuId: number): Promise<Menu | null> {
    try {
      console.log(MenuId, "MenuId");

      const Menu: Menu = (await sqlDBOperations.selectOne("menu", {
        menu_id: MenuId,
      })) as Menu;
      console.log({ message: Menu }, "MenuDetail");
      return Menu == null ? null : Menu;
    } catch (error) {
      console.error("Error fetching item detail:", error);
      throw new Error("Error fetching item detail");
    }
  }
  static async getMenuDetailFromName(menuName: string): Promise<Menu | null> {
    try {
      const Menu: Menu = (await sqlDBOperations.selectOne("menu", {
        item_name: menuName,
      })) as Menu;
      console.log({ message: Menu }, "MenuDetail");
      return Menu == null ? null : Menu;
    } catch (error) {
      console.error("Error fetching item detail:", error);
      throw new Error("Error fetching item detail");
    }
  }

  static async showMenuItems(orderBy: Object) {
    try {
      const result = await sqlDBOperations.selectAll("Menu", {}, orderBy, {});
      return result;
    } catch (error: any) {
      throw new Error("Error showing menu item: " + error.message);
    }
  }

  static async updateItemAvailability(
    itemID: number,
    availability: boolean
  ): Promise<ResultSetHeader> {
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

  // static removeDiscardItem() {
  //   // recommendationEngine.setDiscardStatus();
  //   await sqlDBOperations.delete('menu')
  // }

  static async getItemsToDiscard(): Promise<Menu[]> {
    try {
      const discardMenu: Menu[] = (await sqlDBOperations.selectAll("Menu", {
        is_discard: true,
      })) as Menu[];
      return discardMenu;
    } catch {
      throw new Error("Error getting discard Menu Items ");
    }
  }
}

export default MenuService;
