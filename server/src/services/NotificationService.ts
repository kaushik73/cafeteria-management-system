import { defaultItemValues } from "../common/contants";
import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { IUserAndPreference } from "../models/User";
import userDetailStore from "../store/userDetailStore";
import DateService from "./DateService";
import LogService from "./LogService";

export default class NotificationService {
  static async addNotification(
    type: string,
    message: string,
    menuId: number | null
  ) {
    const currentDate = DateService.getCurrentDate();
    const notification = {
      notification_type: type,
      message: message,
      notification_date: currentDate,
      menu_id: menuId,
    };

    try {
      await sqlDBOperations.insert("Notification", notification);
    } catch (error: any) {
      throw new Error("Error adding notification: " + error.message);
    }
  }

  static async seeNotifications(): Promise<any[]> {
    const expiryDays = defaultItemValues.notification_expiry;
    const expiryDate = DateService.getNthPreviousDate(expiryDays);
    const formatedExpiryDate = expiryDate.split(" ")[0];
    const data = await sqlDBOperations.selectAll(
      "Notification",
      {
        notification_date: formatedExpiryDate,
      },

      { notification_date: "desc" },
      { notification_date: ">" }
    );

    return data;
  }
}
