import Table from "cli-table3";

export default class OutputService {
  // Prints a simple message to the console
  static printMessage(message: any): void {
    console.log(message);
  }

  // Prints an array with each element on a new line
  static printArray(arr: any[]): void {
    arr.forEach((item, index) => {
      console.log(`[${index}]: ${item}`);
    });
  }

  static printTable(data: any[]): void {
    if (data.length === 0) {
      OutputService.printMessage("No data available to print.");
      return;
    }

    // Extract headers from the first object in the array
    const headers = Object.keys(data[0]);

    // Create table instance
    const table = new Table({
      head: headers,
    });

    // Add rows to the table
    data.forEach((item) => {
      const row = headers.map((header) => item[header]);
      table.push(row);
    });

    // Output the table
    console.log(table.toString());
  }
}

//  OutputService.printDynamicMessage("Hello, {0}! Your order ID is {1}.", userName, orderId);
