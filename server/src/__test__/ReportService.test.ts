import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import ReportService from "../services/ReportService";

jest.mock("../database/operations/sqlDBOperations");

describe("ReportService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("viewFeedbackReport", () => {
    it("should return feedback report for the given date range", async () => {
      const mockStartDate = "2023-01-01";
      const mockEndDate = "2024-10-10";

      const mockReport: any[] = [
        { feedbackId: 1, comments: "Great service", date: "2023-01-01" },
        { feedbackId: 2, comments: "Needs improvement", date: "2024-10-10" },
      ];

      const mockRows = [mockReport];

      (sqlDBOperations.runCustomQuery as jest.Mock).mockResolvedValue(mockRows);

      const result = await ReportService.viewFeedbackReport(
        mockStartDate,
        mockEndDate
      );

      const expectedQuery = `CALL FeedbackReport('${mockStartDate}', '${mockEndDate}')`;

      expect(sqlDBOperations.runCustomQuery).toHaveBeenCalledWith(
        expectedQuery
      );
      expect(result).toEqual(mockReport);
    });
  });
});
