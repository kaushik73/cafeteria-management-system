import { io, Socket } from "socket.io-client";
import OutputService from "../services/OutputService";
import { socketService } from "../services/SocketService";

jest.mock("socket.io-client", () => ({
  io: jest.fn(),
}));
jest.mock("../services/OutputService");

const mockedIo = io as jest.MockedFunction<typeof io>;
const mockedOutputService = OutputService as jest.Mocked<typeof OutputService>;

describe("SocketService", () => {
  let socketService: any;
  let mockSocket: jest.Mocked<Socket>;

  beforeEach(() => {
    mockSocket = {
      on: jest.fn(),
      emit: jest.fn(),
      id: "test-socket-id",
    } as any;

    mockedIo.mockReturnValue(mockSocket);

    socketService = socketService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should call onEvent with the correct event name", () => {
    const callback = jest.fn();
    socketService.onEvent("testEvent", callback);

    (mockSocket.on as jest.Mock).mock.calls[0][1]({ testData: "data" });

    expect(callback).toHaveBeenCalledWith({ testData: "data" });
  });

  test("should call emitEvent with the correct data and callback", () => {
    const callback = jest.fn();
    socketService.emitEvent("testEvent", { data: "test" }, callback);

    (mockSocket.emit as jest.Mock).mock.calls[0][2]({ response: "response" });

    expect(callback).toHaveBeenCalledWith({ response: "response" });
  });
});
