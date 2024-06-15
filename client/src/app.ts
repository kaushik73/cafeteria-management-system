import { socketService } from "./services/SocketService";
import LoginUI from "./ui/LoginUI";

export async function main() {
  try {
    await socketService.connect();
    LoginUI.showLoginMenu();
  } catch (error) {
    console.error("Failed to connect to server:", error);
  }
}
