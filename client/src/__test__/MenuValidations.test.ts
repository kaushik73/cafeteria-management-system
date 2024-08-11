import {
  validateMealType,
  validateDietaryType,
  validateSpiceType,
  validateCuisineType,
  validateInputLength,
  validatePrice,
  validateBoolean,
  validateMenuID,
} from "../validations/MenuValidations";
import {
  allowedCuisineTypes,
  allowedDietaryTypes,
  allowedMealTypes,
  allowedSpicyTypes,
} from "../models/Menu";

describe("Validation Functions", () => {
  it("should validate MealType correctly", () => {
    allowedMealTypes.forEach((type) => {
      expect(validateMealType(type)).toBe(true);
    });
    expect(validateMealType("invalidType")).toBe(false);
  });

  it("should validate DietaryType correctly", () => {
    allowedDietaryTypes.forEach((type) => {
      expect(validateDietaryType(type)).toBe(true);
    });
    expect(validateDietaryType("invalidType")).toBe(false);
  });

  it("should validate SpiceType correctly", () => {
    allowedSpicyTypes.forEach((type) => {
      expect(validateSpiceType(type)).toBe(true);
    });
    expect(validateSpiceType("invalidType")).toBe(false);
  });

  it("should validate CuisineType correctly", () => {
    allowedCuisineTypes.forEach((type) => {
      expect(validateCuisineType(type)).toBe(true);
    });
    expect(validateCuisineType("invalidType")).toBe(false);
  });

  it("should validate input length correctly", () => {
    expect(validateInputLength("Valid Input")).toBe(true);
    expect(validateInputLength("")).toBe(false);
  });

  it("should validate price correctly", () => {
    expect(validatePrice("10")).toBe(true);
    expect(validatePrice("0")).toBe(false);
    expect(validatePrice("-5")).toBe(false);
    expect(validatePrice("abc")).toBe(false);
  });

  it("should validate boolean values correctly", () => {
    expect(validateBoolean("yes")).toBe(true);
    expect(validateBoolean("no")).toBe(true);
    expect(validateBoolean("YES")).toBe(true);
    expect(validateBoolean("NO")).toBe(true);
    expect(validateBoolean("maybe")).toBe(false);
  });

  it("should validate MenuID correctly", () => {
    expect(validateMenuID("1")).toBe(true);
    expect(validateMenuID("0")).toBe(false);
    expect(validateMenuID("-1")).toBe(false);
    expect(validateMenuID("abc")).toBe(false);
  });
});
