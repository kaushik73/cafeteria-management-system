import CommonValidations from "../validations/CommonValidation";

describe("CommonValidations", () => {
  describe("validateMonth", () => {
    it("should return true for valid months", () => {
      expect(CommonValidations.validateMonth("1")).toBe(true);
      expect(CommonValidations.validateMonth("12")).toBe(true);
    });

    it("should return false for invalid months", () => {
      expect(CommonValidations.validateMonth("0")).toBe(false);
      expect(CommonValidations.validateMonth("13")).toBe(false);
      expect(CommonValidations.validateMonth("abc")).toBe(false);
    });
  });

  describe("validateYear", () => {
    it("should return true for valid years", () => {
      expect(CommonValidations.validateYear("1900")).toBe(true);
      expect(CommonValidations.validateYear("2024")).toBe(true);
    });

    it("should return false for invalid years", () => {
      expect(CommonValidations.validateYear("1800")).toBe(false);
      expect(CommonValidations.validateYear("10000")).toBe(false);
      expect(CommonValidations.validateYear("abc")).toBe(false);
    });
  });

  describe("validateUserID", () => {
    it("should return true for numeric EmployeeID", () => {
      expect(CommonValidations.validateUserID("12345")).toBe(true);
    });

    it("should return false for non-numeric EmployeeID", () => {
      expect(CommonValidations.validateUserID("abc123")).toBe(false);
      expect(CommonValidations.validateUserID("abc")).toBe(false);
    });
  });

  describe("validateOption", () => {
    it("should return true for numeric EmployeeID", () => {
      expect(CommonValidations.validateOption("12345")).toBe(true);
    });

    it("should return false for non-numeric EmployeeID", () => {
      expect(CommonValidations.validateOption("abc123")).toBe(false);
      expect(CommonValidations.validateOption("abc")).toBe(false);
    });
  });

  describe("validateDate", () => {
    it("should return true for valid dates", () => {
      expect(CommonValidations.validateDate("2024-08-11")).toBe(true);
      expect(CommonValidations.validateDate("1900-01-01")).toBe(true);
    });

    it("should return false for invalid dates", () => {
      expect(CommonValidations.validateDate("2024-13-11")).toBe(false);
      expect(CommonValidations.validateDate("2024-02-30")).toBe(false);
      expect(CommonValidations.validateDate("abc")).toBe(false);
    });
  });

  describe("validateRating", () => {
    it("should return true for valid ratings", () => {
      expect(CommonValidations.validateRating("1")).toBe(true);
      expect(CommonValidations.validateRating("5")).toBe(true);
    });

    it("should return false for invalid ratings", () => {
      expect(CommonValidations.validateRating("0")).toBe(false);
      expect(CommonValidations.validateRating("6")).toBe(false);
      expect(CommonValidations.validateRating("abc")).toBe(false);
    });
  });
});
