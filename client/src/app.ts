import { socketService } from "./services/SocketService";
import { loginUI } from "./ui/LoginUI";

export async function main() {
  try {
    await socketService.connect();
    loginUI.showLoginMenu();
  } catch (error) {
    console.error("Failed to connect to server:", error);
  }
}
