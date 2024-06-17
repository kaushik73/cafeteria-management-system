import * as readlineSync from "readline-sync";

export default class InputService {
  static takeInputWithValidation(
    question: string,
    validator?: (input: string) => boolean
  ): string {
    let userInput: string;

    do {
      userInput = readlineSync.question(question);
    } while (validator && !validator(userInput));

    return userInput.toLowerCase();
  }
}
