// import SqlOperation from "./database/operations/sqlDBOperations";
// // sql fnx uses : 
// (async () => {
//   const sqlOperation = new SqlOperation();

//   try {
//     // Insert a new user
//     const x = await sqlOperation.insert("users", {
//       first_name: "John",
//       last_name: "Doe",
//       email: "john.doe@example.com",
//     });

//     // Update the user with id 1
//     const y = await sqlOperation.update(
//       "users",
//       { id: 1 },
//       {
//         first_name: "Jane",
//         last_name: "Doe",
//         email: "jane.doe@example.com",
//       }
//     );
//     console.log("insert", x);
//     console.log("update", y);

//     // Select all users
//     const allUsers = await sqlOperation.selectAll("users");
//     console.log("All Users:", allUsers);

//     // Select a single user by id
//     const singleUser = await sqlOperation.selectOne("users", { id: 1 });
//     console.log("Single User:", singleUser);

//     // Delete the user with id 1
//    const z =  await sqlOperation.delete("users", { id: 1 });
//    console.log(z);
   
//   } catch (error) {
//     console.error("An error occurred:", error);
//   }
// })();




import { createServer } from "http";
import SocketService from "./socket/socket";


class ServerApp {
  private httpServer;
  private socketService;

  constructor() {
    this.httpServer = createServer();
    this.socketService = new SocketService(this.httpServer, "http://localhost:5500");
    this.configureSocket();
  }

  private async configureSocket() {
    await this.socketService.initialize();
    this.socketService.emitEventToRoom("testRoom", "Room-Event", { message: "Hello, room!" });
    this.socketService.broadcastEvent("Broadcast-Event", { message: "Hello, everyone!" });
  }

  public start(port: number) {
    this.httpServer.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

const serverApp = new ServerApp();
serverApp.start(3000);
