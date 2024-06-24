import { sqlDBOperations } from "../../database/operations/sqlDBOperations";
import { Menu } from "../../models/Menu";
import { engineFeedbackService } from "./EngineFeedbackService";
import { engineSentimentAnalysisService } from "./EngineSentimentAnalysisService";

class EngineMenuService {
  //  engine code start
  async getTopRatedMenuItems(mealType: string, limit: number): Promise<Menu[]> {
    const feedbacks = await engineFeedbackService.getAllFeedbacks();
    const sentimentResults =
      await engineSentimentAnalysisService.analyzeFeedbackSentiments(feedbacks);
    const menuFeedbackMap = engineFeedbackService.mapFeedbacksToMenuItems(
      feedbacks,
      sentimentResults
    );

    const sortedMenuIds = await this.sortMenuItemsByRatingSentiment(
      menuFeedbackMap,
      limit,
      mealType
    );
    return this.getMenuItems(mealType, sortedMenuIds);
  }

  //  todo : modify this for prefernce :
  private async sortMenuItemsByRatingSentiment(
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
        const type = await this.getMealType(entry.menuId);
        return type === mealType ? entry : null;
      })
    );

    const validEntries = filteredEntries.filter((entry) => entry !== null) as {
      menuId: number;
    }[];
    return validEntries.slice(0, limit).map((entry) => entry.menuId);
  }

  private async getMealType(menuId: number): Promise<string> {
    const mealType: any = await sqlDBOperations.selectOne("Menu", {
      menu_id: menuId,
    });
    return mealType.meal_type;
  }

  private async getMenuItems(
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

export const engineMenuService = new EngineMenuService();
