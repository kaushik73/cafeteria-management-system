import * as readlineSync from "readline-sync";
import InputService from "../services/InputService";

jest.mock("readline-sync");

describe("InputService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("takeInputWithValidation", () => {
    it("should return user input when it is valid", () => {
      const question = "Enter something: ";
      const validInput = "validInput";
      const validator = (input: string) => input === validInput;

      (readlineSync.question as jest.Mock).mockImplementation((q: string) => {
        console.log(`Question asked: ${q}`); // Debugging
        return validInput;
      });

      const result = InputService.takeInputWithValidation(question, validator);
      console.log(`Result: ${result}`); // Debugging
      expect(result).toBe(validInput.toLowerCase());
    });

    it("should keep asking until input is valid", () => {
      const question = "Enter something: ";
      const validInput = "validInput";
      const invalidInput = "invalidInput";
      const validator = (input: string) => input === validInput;
      (readlineSync.question as jest.Mock)
        .mockReturnValueOnce(invalidInput)
        .mockReturnValueOnce(validInput);
      const result = InputService.takeInputWithValidation(question, validator);
      expect(result).toBe(validInput.toLowerCase());
      expect(readlineSync.question).toHaveBeenCalledTimes(2);
    });
  });

  describe("takeOptionalInputWithValidation", () => {
    it("should return empty input if provided", () => {
      const question = "Enter something (optional): ";
      const validator = (input: string) => input.length <= 10;

      (readlineSync.question as jest.Mock).mockReturnValue("");

      const result = InputService.takeOptionalInputWithValidation(
        question,
        validator
      );
      expect(result).toBe("");
    });
  });
});
