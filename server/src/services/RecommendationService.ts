import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { Recommendation } from "../models/Recommendation";
import DateService from "./DateService";

export default class RecommendationService {
  static async voteForRecommendedFood(
    data: any,
    callback: (response: any) => void
  ) {
    try {
      const nextDay = DateService.getNthPreviousDate(-1);
      const today = DateService.getNthPreviousDate(0);

      const recommendedFood: Recommendation[] =
        await sqlDBOperations.runCustomQuery(
          `select * from Recommendation where rollout_to_employee = true and recommendation_date between '${today}' and '${nextDay}'`
        );

      callback({ message: recommendedFood });
    } catch (error) {
      callback({ message: "Error in vote For Recommended Food" });
      console.error("error in vote For Recommended Food", error);
    }
  }

  static async viewRecommendedFood(data: any | void, callback: any) {
    const nextDay = DateService.getNthPreviousDate(-1);
    const today = DateService.getNthPreviousDate(0);
    const query = `select * from Recommendation where rollout_to_employee = true and recommendation_date between '${today}' and '${nextDay}'`;
    console.log(query);

    const recommendedFood: Recommendation[] =
      await sqlDBOperations.runCustomQuery(query);
    console.log({ viewRecommendedFood: recommendedFood });

    callback({ message: recommendedFood });
  }

  // not working
  static async chefRollout(
    data: { [key: string]: number[] },
    callback: (response: any) => void
  ) {
    console.log(data);
    try {
      const updatedRecommendations: Recommendation[] = [];

      for (const mealType of Object.keys(data)) {
        const recommendationIds = data[mealType];

        for (const recommendationId of recommendationIds) {
          await sqlDBOperations.update(
            "Recommendation",
            { rollout_to_employee: true },
            { recommendation_id: recommendationId }
          );

          // const allRecommendations: Recommendation[] =
          // await sqlDBOperations.selectAll("recommendation");
          // const MenuDetail = await MenuService.getMenuDetailFromId(
          //   allRecommendations.menu_id
          // );
          // const notificationMessage = `Chef Recommneded${MenuDetail.name} for ${allRecommendations.meal_type}`;
          // await NotificationService.addNotification(
          //   "recommendation",
          //   notificationMessage,
          //   1 // for now
          // );
        }
      }

      // console.log("Updated recommendations:", updatedRecommendations);
      callback("Chef Rolledout Success");
    } catch (error) {
      console.error("Error in chefRollout:", error);
      callback("Chef Rolledout Failed");
    }
  }
}
