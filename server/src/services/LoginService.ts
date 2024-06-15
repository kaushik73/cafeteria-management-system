

//   socket.on("getUserRole", async (employeeID: string) => {
//     try {
//       const result = await databaseOperation.selectOne("users", { employee_id: employeeID });
//       const role = result ? result.role : null;
//       socket.emit("userRole", { role });
//     } catch (error) {
//       socket.emit("error", "Internal server error");
//       console.error("Error retrieving user role:", error);
//     }
//   });
