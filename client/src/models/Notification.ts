export interface Notification {
  notification_id: number;
  notification_type: "recommendation" | "menuUpdate" | "availabilityChange";
  message: string;
  notification_date: Date;
  menu_id?: number;
}
