import * as readlineSync from "readline-sync";

export default class InputService {
  static takeInputWithValidation(
    question: string,
    validator?: (input: string) => boolean
  ): string {
    if (validator == null) {
      let userInput: string;
      userInput = readlineSync.question(question);
      return userInput;
    } else {
      let userInput: string;
      do {
        userInput = readlineSync.question(question);
      } while (!validator(userInput));
      return userInput;
    }
  }

  // static takeInput(question: string): string {
  //   let userInput: string;
  //   userInput = readlineSync.question(question);
  //   return userInput;
  // }
}
