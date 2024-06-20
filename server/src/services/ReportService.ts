import { defaultItemValues } from "../common/contants";
import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { Notification } from "../models/Notification";
import DateService from "./DateService";
import { FeedbackReport, FeedbackRow } from "../common/types";

export default class ReportService {
  static async viewFeedbackReport(
    startDate: string,
    endDate: string
  ): Promise<FeedbackReport[]> {
    const query = `CALL FeedbackReport('${startDate}', '${endDate}')`;
    const [rows] = await sqlDBOperations.runCustomQuery(query);
    return rows;
  }
}
