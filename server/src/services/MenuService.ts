import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { sentimentAnalysisService } from "../engine/services/SentimentAnalysisService";
import { Menu } from "../models/Menu";
import FeedbackService from "./FeedbackService";
import NotificationService from "./NotificationService";

class MenuService {
  static async addMenuItem(item: Menu) {
    try {
      console.log("item", item);

      const result: any = await sqlDBOperations.insert("Menu", item);
      console.log("Menu Added : ", result);

      const notificationMessage = `added ${item.item_name} for ${item.meal_type}`;
      await NotificationService.addNotification(
        "menuUpdate",
        notificationMessage,
        result.insertId
      );

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
      const notificationMessage = `Menu item updated: ${item.item_name}`;

      await NotificationService.addNotification(
        "menuUpdate",
        notificationMessage,
        result.insertId
      );
      return result;
    } catch (error: any) {
      throw new Error("Error updating menu item: " + error.message);
    }
  }

  static async deleteMenuItem(data: any) {
    try {
      const MenuDetail = await MenuService.getMenuDetailFromId(data.itemID);
      const notificationMessage = `Deleted ${MenuDetail.item_name} from ${MenuDetail.meal_type}`;
      // todo : make all tables on delete set null
      await NotificationService.addNotification(
        "menuUpdate",
        notificationMessage,
        data.itemID
      );
      const result: any = await sqlDBOperations.delete("Menu", {
        menu_id: data.itemID,
      });
      return result;
    } catch (error: any) {
      throw new Error("Error deleting data");
    }
  }

  static async getMenuDetailFromId(MenuId: string) {
    try {
      console.log(MenuId, "MenuId");

      const Menu: any = await sqlDBOperations.selectOne("menu", {
        menu_id: MenuId,
      });
      console.log({ message: Menu }, "MenuDetail");
      return Menu;
    } catch (error) {
      console.error("Error fetching itemID:", error);
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

  //  engine code start

  static async getTopRatedMenuItems(
    mealType: string,
    limit: number
  ): Promise<Menu[]> {
    const feedbacks = await FeedbackService.getAllFeedbacks();
    const sentimentResults =
      await sentimentAnalysisService.analyzeFeedbackSentiments(feedbacks);
    const menuFeedbackMap = FeedbackService.mapFeedbacksToMenuItems(
      feedbacks,
      sentimentResults
    );

    const sortedMenuIds =
      await MenuService.sortMenuItemsByRatingSentimentPreference(
        menuFeedbackMap,
        limit,
        mealType
      );
    return MenuService.getMenuItems(mealType, sortedMenuIds);
  }

  //  todo : modify this for prefernce :
  private static async sortMenuItemsByRatingSentimentPreference(
    menuFeedbackMap: {
      [key: number]: {
        totalRating: number;
        count: number;
        totalSentiment: number;
      };
    },
    limit: number,
    mealType: string
  ): Promise<number[]> {
    const menuEntries = Object.entries(menuFeedbackMap).map(
      ([menuId, stats]) => ({
        menuId: Number(menuId),
        avgRating: stats.totalRating / stats.count,
        avgSentiment: stats.totalSentiment / stats.count,
      })
    );

    menuEntries.sort(
      (a, b) => b.avgRating + b.avgSentiment - (a.avgRating + a.avgSentiment)
    );

    const filteredEntries = await Promise.all(
      menuEntries.map(async (entry) => {
        const type = await MenuService.getMealType(entry.menuId);
        return type === mealType ? entry : null;
      })
    );

    const validEntries = filteredEntries.filter((entry) => entry !== null) as {
      menuId: number;
    }[];
    return validEntries.slice(0, limit).map((entry) => entry.menuId);
  }

  private static async getMealType(menuId: number): Promise<string> {
    const mealType: any = await sqlDBOperations.selectOne("Menu", {
      menu_id: menuId,
    });
    return mealType.meal_type;
  }

  private static async getMenuItems(
    mealType: string,
    menuIds: number[]
  ): Promise<Menu[]> {
    return sqlDBOperations.selectAll(
      "Menu",
      { meal_type: mealType, menu_id: menuIds },
      {},
      { meal_type: "=", menu_id: "IN" }
    ) as Promise<Menu[]>;
  }
  //  engine code end
}

export default MenuService;
