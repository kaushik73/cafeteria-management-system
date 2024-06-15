import { Feedback } from "../models/Feedback";
import SqlOperation from "../database/operations/sqlDBOperations";
import { FeedbackReport, FeedbackRow } from "../common/types";

class FeedbackService {
  private db: SqlOperation;

  constructor() {
    this.db = new SqlOperation();
  }

  async addFeedback(feedback: Feedback): Promise<void> {
    await this.db.insert("Feedback", feedback);
  }

  async getMonthlyFeedbackReport_OLD(
    month: number,
    year: number
  ): Promise<FeedbackReport[]> {
    const query = `
            SELECT m.item_name, AVG(f.rating) AS average_rating, COUNT(f.feedback_id) AS total_feedbacks
            FROM Feedback f
            JOIN Menu m ON f.menu_id = m.menu_id
            WHERE MONTH(f.feedback_date) = ? AND YEAR(f.feedback_date) = ?
            GROUP BY m.item_name
        `;
    const rows = await this.db.fetchDatawithCustomQuery(query, [month, year]);

    return rows.map((row: FeedbackRow) => ({
      ...row,
      average_rating: parseFloat(row.average_rating),
    }));
  }

  async fetchMonthlyFeedbackReport(
    month: number,
    year: number
  ): Promise<FeedbackRow[]> {
    const query = "CALL MonthlyFeedbackReport(?, ?)";
    const rows = await this.db.fetchDatawithCustomQuery(query, [month, year]);
    return rows;
  }

  async getMonthlyFeedbackReport(
    month: number,
    year: number
  ): Promise<FeedbackReport[]> {
    const rows = await this.fetchMonthlyFeedbackReport(month, year);

    return rows.map((row: FeedbackRow) => ({
      ...row,
      average_rating: parseFloat(row.average_rating),
    }));
  }
}

export const feedbackService = new FeedbackService();
