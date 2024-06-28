import OutputService from "./services/OutputService";
import { socketService } from "./services/SocketService";
import { loginUI } from "./ui/LoginUI";

export async function main() {
  const maxRetries = 3;
  let retries = 0;
  while (retries < maxRetries) {
    try {
      await socketService.connect();
      loginUI.showLoginMenu();
      return;
    } catch (error) {
      retries++;
      OutputService.printMessage(`Attempt ${retries} failed: ${error}`);
      if (retries === maxRetries) {
        OutputService.printMessage(
          "Maximum retry attempts reached. Logging out."
        );
        process.exit(1);
      }
    }
  }
}
