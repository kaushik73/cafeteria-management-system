// Feedback.ts
import { IDatabaseOperations } from './IDatabaseOperations';

export default class Feedback {
  feedbackID: number;
  userID: number;
  menuItemID: number;
  comment: string;
  rating: number;
  date: Date;

  constructor(feedbackID: number, userID: number, menuItemID: number, comment: string, rating: number, date: Date) {
    this.feedbackID = feedbackID;
    this.userID = userID;
    this.menuItemID = menuItemID;
    this.comment = comment;
    this.rating = rating;
    this.date = date;
  }

  async submitFeedback(db: IDatabaseOperations): Promise<void> {
    await db.insert('Feedback', this);
  }

  async viewFeedback(db: IDatabaseOperations): Promise<Feedback[]> {
    return await db.selectAll<Feedback>('Feedback', { feedbackID: this.feedbackID });
  }
}
