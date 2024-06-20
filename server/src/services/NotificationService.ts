import { defaultItemValues } from "../common/contants";
import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { Notification } from "../models/Notification";
import { User } from "../models/Users";
import userDetailStore from "../store/userDetailStore";
import DateService from "./DateService";
import LogService from "./LogService";

export default class NotificationService {
  static async addNotificationOLD(notification: Notification): Promise<any> {
    await sqlDBOperations.insert("Notification", notification);
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

  static async seeNotifications(): Promise<any[]> {
    const expiryDays = defaultItemValues.notification_expiry;
    const expiryDate = DateService.getNthPreviousDate(expiryDays);
    const formatedExpiryDate = expiryDate.split(" ")[0];
    const userDetail: User | null = await userDetailStore.getUserDetail();
    const action = `${userDetail?.name} saw Notification`;
    const logOutput = await LogService.logAction(
      action,
      userDetail?.emp_id as number
    );
    const data = await sqlDBOperations.selectAll(
      "Notification",
      {
        notification_date: formatedExpiryDate,
      },

      { notification_date: "desc" },
      { notification_date: ">" }
    );
    console.log(data);

    return data;
  }
}
