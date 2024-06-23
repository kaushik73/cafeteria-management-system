import { defaultItemValues } from "../common/contants";
import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { Menu } from "../models/Menu";
import { Notification } from "../models/Notification";
import { Preference } from "../models/Preference";
import { IUser } from "../models/User";
import userDetailStore from "../store/userDetailStore";
import DateService from "./DateService";
import LogService from "./LogService";

// class NotificationServiceOLD {
//   static async addNotification(type: string, message: string, menuId: number) {
//     const currentDate = DateService.getCurrentDate();
//     console.log("addNotification", currentDate);

//     const notification = {
//       notification_type: type,
//       message: message,
//       notification_date: currentDate,
//       menu_id: menuId,
//     };

//     try {
//       await sqlDBOperations.insert("Notification", notification);
//       console.log("Notification added successfully:", notification);
//     } catch (error: any) {
//       throw new Error("Error adding notification: " + error.message);
//     }
//   }

//   static async seeNotifications(): Promise<any[]> {
//     const expiryDays = defaultItemValues.notification_expiry;
//     const expiryDate = DateService.getNthPreviousDate(expiryDays);
//     const formatedExpiryDate = expiryDate.split(" ")[0];
//     const userDetail: User | null = await userDetailStore.getUserDetail();
//     const action = `${userDetail?.name} saw Notification`;
//     const logOutput = await LogService.insertIntoLog(
//       action,
//       userDetail?.emp_id as number
//     );
//     const data = await sqlDBOperations.selectAll(
//       "Notification",
//       {
//         notification_date: formatedExpiryDate,
//       },

//       { notification_date: "desc" },
//       { notification_date: ">" }
//     );

//     return data;
//   }
// }

// export default class NotificationServiceOLD2 {
//   static async addNotification(type: string, message: string, menuId: number) {
//     const currentDate = DateService.getCurrentDate();
//     console.log("addNotification", currentDate);

//     const notification = {
//       notification_type: type,
//       message: message,
//       notification_date: currentDate,
//       menu_id: menuId,
//     };

//     try {
//       await sqlDBOperations.insert("Notification", notification);
//       console.log("Notification added successfully:", notification);
//     } catch (error: any) {
//       throw new Error("Error adding notification: " + error.message);
//     }
//   }
//   static async viewNotifications(userId: number): Promise<Object> {
//     try {
//       const preferences = await NotificationService.getUserPreferences(userId);
//       const notifications = await NotificationService.getNotifications();

//       const sortedNotifications =
//         NotificationService.sortNotificationsByPreferences(
//           notifications,
//           preferences
//         );

//       return {
//         status: "success",
//         message: "Notifications retrieved successfully.",
//         notifications: sortedNotifications,
//       };
//     } catch (error) {
//       console.error("Error retrieving notifications:", error);
//       return {
//         status: "error",
//         message: "Error retrieving notifications.",
//       };
//     }
//   }

//   private static async getUserPreferences(userId: number): Promise<Preference> {
//     const preferences: Preference = (await sqlDBOperations.selectOne(
//       "Preference",
//       {
//         user_id: userId,
//       }
//     )) as Preference;
//     if (!preferences) throw new Error("Preferences not found");
//     return preferences;
//   }

//   private static async getNotifications(): Promise<Notification[]> {
//     const notifications: Notification[] = (await sqlDBOperations.selectAll(
//       "Notification",
//       {}
//     )) as Notification[];
//     return notifications;
//   }

//   private static sortNotificationsByPreferences(
//     notifications: Notification[],
//     preferences: Preference
//   ): Notification[] {
//     return notifications.sort((a, b) => {
//       const menuA = NotificationService.getMenuById(a.menu_id);
//       const menuB = NotificationService.getMenuById(b.menu_id);

//       const scoreA = NotificationService.calculatePreferenceScore(
//         menuA,
//         preferences
//       );
//       const scoreB = NotificationService.calculatePreferenceScore(
//         menuB,
//         preferences
//       );

//       return scoreB - scoreA;
//     });
//   }

//   private static async getMenuById(menuId: number): Promise<Menu> {
//     const menu = await sqlDBOperations.selectOne("Menu", { menu_id: menuId });
//     return menu as Menu;
//   }

//   private static calculatePreferenceScore(
//     menu: Menu,
//     preferences: Preference
//   ): number {
//     let score = 0;

//     if (menu.dietary_type === preferences.dietary_preference) score += 1;
//     if (menu.spice_type === preferences.spice_level) score += 1;
//     if (menu.cuisine_type === preferences.cuisine_preference) score += 1;
//     if (menu.sweet_tooth_type === preferences.sweet_tooth) score += 1;

//     return score;
//   }
// }

export default class NotificationService {
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
    const userDetail: IUser | null = await userDetailStore.getUserDetail();
    const action = `${userDetail?.name} saw Notification`;
    const logOutput = await LogService.insertIntoLog(
      action,
      userDetail?.user_id as number
    );
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

  //  not required start
  // async viewNotifications(userId: number): Promise<Object> {
  //   try {
  //     const preferences = await this.getUserPreferences(userId);
  //     const notifications = await this.getNotifications();

  //     const sortedNotifications = await this.sortNotificationsByPreferences(
  //       notifications,
  //       preferences
  //     );

  //     return {
  //       status: "success",
  //       message: "Notifications retrieved successfully.",
  //       notifications: sortedNotifications,
  //     };
  //   } catch (error) {
  //     console.error("Error retrieving notifications:", error);
  //     return {
  //       status: "error",
  //       message: "Error retrieving notifications.",
  //     };
  //   }
  // }

  // private async getUserPreferences(userId: number): Promise<Preference> {
  //   const preferences = await sqlDBOperations.selectOne("Preference", {
  //     user_id: userId,
  //   });
  //   if (!preferences) throw new Error("Preferences not found");
  //   return preferences as Preference;
  // }

  // private async getNotifications(): Promise<Notification[]> {
  //   const notifications = await sqlDBOperations.selectAll("Notification", {});
  //   return notifications as Notification[];
  // }

  // private async sortNotificationsByPreferences(
  //   notifications: Notification[],
  //   preferences: Preference
  // ): Promise<Notification[]> {
  //   const notificationWithMenus = await Promise.all(
  //     notifications.map(async (notification) => {
  //       const menu = notification.menu_id
  //         ? await NotificationService.getMenuById(notification.menu_id)
  //         : null;
  //       return { ...notification, menu };
  //     })
  //   );

  //   return notificationWithMenus.sort((a, b) => {
  //     const scoreA = a.menu
  //       ? NotificationService.calculatePreferenceScore(a.menu, preferences)
  //       : 0;
  //     const scoreB = b.menu
  //       ? NotificationService.calculatePreferenceScore(b.menu, preferences)
  //       : 0;

  //     return scoreB - scoreA;
  //   });
  // }

  // private static async getMenuById(menuId: number): Promise<Menu> {
  //   const menu = await sqlDBOperations.selectOne("Menu", { menu_id: menuId });
  //   return menu as Menu;
  // }

  // private static calculatePreferenceScore(
  //   menu: Menu,
  //   preferences: Preference
  // ): number {
  //   let score = 0;

  //   if (menu.dietary_type === preferences.dietary_preference) score += 1;
  //   if (menu.spice_type === preferences.spice_level) score += 1;
  //   if (menu.cuisine_type === preferences.cuisine_preference) score += 1;
  //   if (menu.sweet_tooth_type === preferences.sweet_tooth) score += 1;

  //   return score;
  // }

  //  not required end
}
