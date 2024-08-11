import DateService from "../services/DateService";

describe("DateService", () => {
  describe("getCurrentDate", () => {
    it("should return the current date in the correct format", () => {
      const mockDate = new Date(2024, 7, 11, 10, 30, 15); // August 11, 2024, 10:30:15
      jest
        .spyOn(global, "Date")
        .mockImplementation(() => mockDate as unknown as Date);

      const result = DateService.getCurrentDate();
      expect(result).toBe("2024-08-11 10:30:15");
    });
  });

  describe("getNthPreviousDate", () => {
    it("should return the date N days before the current date in the correct format", () => {
      const mockDate = new Date(2024, 7, 11, 10, 30, 15); // August 11, 2024, 10:30:15
      jest
        .spyOn(global, "Date")
        .mockImplementation(() => mockDate as unknown as Date);

      const result = DateService.getNthPreviousDate(5);
      expect(result).toBe("2024-08-06 10:30:15");
    });
  });

  describe("formatDateTime", () => {
    it("should return the formatted date and time string", () => {
      const date = new Date(2024, 7, 11, 10, 30, 15);
      const result = DateService.formatDateTime(date);
      expect(result).toBe("2024-08-11 10:30:15");
    });
  });

  describe("formatDate", () => {
    it("should return the formatted date string", () => {
      const date = new Date(2024, 7, 11);
      const result = DateService.formatDate(date);
      expect(result).toBe("2024-08-11");
    });
  });
});
