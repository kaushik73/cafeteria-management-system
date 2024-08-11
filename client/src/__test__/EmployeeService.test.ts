import EmployeeService from "../services/EmployeeService";
import InputService from "../services/InputService";
import OutputService from "../services/OutputService";
import { socketService } from "../services/SocketService";
import AuthService from "../services/AuthService";
import { loginUI } from "../ui/LoginUI";
import { IUser } from "../models/User";

jest.mock("../services/InputService");
jest.mock("../services/OutputService");
jest.mock("../services/SocketService");
jest.mock("../services/AuthService");
jest.mock("../services/LoginUI");

describe("EmployeeService", () => {
  const mockUserDetail: Partial<IUser> = {
    user_id: 101,
    role: "admin",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    EmployeeService.userDetail = mockUserDetail as any;
  });

  it("should display employee menu and return user choice", async () => {
    (InputService.takeInputWithValidation as jest.Mock).mockReturnValue("1");
    const choice = await EmployeeService.showEmployeeMenu(
      mockUserDetail as any
    );
    expect(OutputService.printMessage).toHaveBeenCalled();
    expect(choice).toBe("1");
  });
});

it("should give feedback", async () => {
  (InputService.takeInputWithValidation as jest.Mock)
    .mockReturnValueOnce("11")
    .mockReturnValueOnce("Nice food")
    .mockReturnValueOnce("4");

  (socketService.emitEvent as jest.Mock).mockImplementation(
    (event, data, callback) => {
      callback({ message: "Feedback submitted" });
    }
  );

  const message = await EmployeeService.giveFeedback();
  expect(socketService.emitEvent).toHaveBeenCalledWith(
    "giveFeedback",
    expect.objectContaining({
      menu_id: "11",
      comment: "Nice food",
      rating: 4,
    }),
    expect.any(Function)
  );
  expect(OutputService.printMessage).toHaveBeenCalledWith("Feedback submitted");
  expect(message).toBe("Feedback submitted");
});

it("should see notifications", async () => {
  (socketService.emitEvent as jest.Mock).mockImplementation(
    (event, data, callback) => {
      callback({
        message: [{ notification_type: "menuUpdate", message: "Menu Updated" }],
      });
    }
  );
});

it("should handle logout and redirect to login menu", async () => {
  await EmployeeService.handleLogOut();
  expect(AuthService.logOut).toHaveBeenCalled();
  expect(loginUI.showLoginMenu).toHaveBeenCalled();
});
