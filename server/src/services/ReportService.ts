import { defaultItemValues } from "../common/contants";
import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { Notification } from "../models/Notification";
import DateService from "./DateService";
import { FeedbackReport, FeedbackRow } from "../common/types";

export default class ReportService {
  // private static dbOperation = new SqlOperation();

  //   static async generateReport(notification: Notification): Promise<any> {
  //     await this.dbOperation.insert("Notification", notification);
  //   }

  //   static async fetchViewFeedbackReport(from: Date, to: Date): Promise<FeedbackRow[]> {
  //     const query = "CALL MonthlyFeedbackReport(?, ?)";
  //     const rows = await this.dbOperation.fetchDatawithCustomQuery(query, [
  //       from,
  //       to,
  //     ]);
  //     return rows;
  //   }

  static async viewFeedbackReport(
    startDate: string,
    endDate: string
  ): Promise<FeedbackReport[]> {
    const query = `CALL FeedbackReport('${startDate}', '${endDate}')`;
    const [rows] = await sqlDBOperations.fetchDatawithCustomQuery(query);
    return rows;
  }

  //   static async getMonthlyFeedbackReport_OLD(
  //     month: number,
  //     year: number
  //   ): Promise<FeedbackReport[]> {
  //     const query = `
  //             SELECT m.item_name, AVG(f.rating) AS average_rating, COUNT(f.feedback_id) AS total_feedbacks
  //             FROM Feedback f
  //             JOIN Menu m ON f.menu_id = m.menu_id
  //             WHERE MONTH(f.feedback_date) = ? AND YEAR(f.feedback_date) = ?
  //             GROUP BY m.item_name
  //         `;
  //     const rows = await this.db.fetchDatawithCustomQuery(query, [month, year]);

  //     return rows.map((row: FeedbackRow) => ({
  //       ...row,
  //       average_rating: parseFloat(row.average_rating),
  //     }));
  //   }
}
