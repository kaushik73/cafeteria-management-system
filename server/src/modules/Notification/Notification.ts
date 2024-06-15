// Notification.ts
import { IDatabaseOperations } from './IDatabaseOperations';

export default class Notification {
  notificationID: number;
  userID: number;
  message: string;
  date: Date;
  status: string;

  constructor(notificationID: number, userID: number, message: string, date: Date, status: string) {
    this.notificationID = notificationID;
    this.userID = userID;
    this.message = message;
    this.date = date;
    this.status = status;
  }

  async sendNotification(db: IDatabaseOperations): Promise<void> {
    await db.insert('Notification', this);
  }

  async receiveNotification(db: IDatabaseOperations): Promise<Notification[]> {
    return await db.selectAll<Notification>('Notification', { userID: this.userID });
  }
}
