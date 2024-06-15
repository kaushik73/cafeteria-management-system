import { defaultItemValues } from "../common/contants";
import SqlOperation from "../database/operations/sqlDBOperations";
import { Notification } from "../models/Notification";
import DateService from "./DateService";

export default class NotificationService {
  private static dbOperation = new SqlOperation();

  static async addNotification(notification: Notification): Promise<any> {
    await this.dbOperation.insert("Notification", notification);
  }
  static async seeNotifications(): Promise<any[]> {
    const expiryDays = defaultItemValues.notification_expiry;
    const expiryDate = DateService.getNthPreviousDate(expiryDays);
    const expiryDateISO = expiryDate.split(' ')[0];
        
    const data = await this.dbOperation.selectAll(
      "Notification",
      {
        notification_date: expiryDateISO,
      },

      { notification_date: "desc" },
      { condition: ">" }
    );
    return data;
  }
}