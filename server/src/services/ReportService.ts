import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { FeedbackReport } from "../models/Feedback";

export default class ReportService {
  //  need to work on this or storedProcedure
  static async viewFeedbackReport(
    startDate: string,
    endDate: string
  ): Promise<FeedbackReport[]> {
    const query = `CALL FeedbackReport('${startDate}', '${endDate}')`;
    const [rows] = await sqlDBOperations.runCustomQuery(query);
    return rows;
  }
}
