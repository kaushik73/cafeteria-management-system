import { ResultSetHeader } from "mysql2";
import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { Menu } from "../models/Menu";

class MenuService {
  static async addMenuItem(item: Menu) {
    try {
      const result: ResultSetHeader = await sqlDBOperations.insert(
        "Menu",
        item
      );
      return result;
    } catch (error: any) {
      throw new Error("Error adding menu item: " + error.message);
    }
  }

  static async updateMenuItem(item: Partial<Menu>) {
    try {
      const result: ResultSetHeader = await sqlDBOperations.update(
        "Menu",
        item,
        {
          menu_id: item.menu_id,
        }
      );
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
      const Menu: Menu = (await sqlDBOperations.selectOne("menu", {
        menu_id: MenuId,
      })) as Menu;
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

  static async updatedUserPreference(data: any): Promise<Menu[]> {
    try {
      const updates: string[] = [];

      if (data.updatedPreference.cuisine_type) {
        updates.push(
          `cuisine_preference = '${data.updatedPreference.cuisine_type}'`
        );
      }
      if (data.updatedPreference.sweet_tooth_type !== undefined) {
        updates.push(
          `sweet_tooth = ${data.updatedPreference.sweet_tooth_type}`
        );
      }
      if (data.updatedPreference.dietary_type) {
        updates.push(
          `dietary_preference = '${data.updatedPreference.dietary_type}'`
        );
      }
      if (data.updatedPreference.spice_type) {
        updates.push(`spice_level = '${data.updatedPreference.spice_type}'`);
      }

      if (updates.length === 0) {
        throw new Error("No valid preferences to update");
      }

      const updateQuery = updates.join(", ");

      const updatedPreference: Menu[] = await sqlDBOperations.runCustomQuery(
        `UPDATE preference SET ${updateQuery} WHERE user_id = ${data.userDetail.user_id};`
      );

      return updatedPreference;
    } catch (error) {
      console.error("Error updating user preference:", error);
      throw new Error("Error updating user preference");
    }
  }

  static async isMenuIdExist(menuID: Number): Promise<boolean> {
    try {
      const menu = await sqlDBOperations.selectOne("Menu", { menu_id: menuID });
      return menu !== undefined && menu !== null;
    } catch (error) {
      console.error("Error checking if menu ID exists:", error);
      throw new Error("Error checking if menu ID exists");
    }
  }
}

export default MenuService;
