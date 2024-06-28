import Table from "cli-table3";

export default class OutputService {
  static printMessage(message: any): void {
    console.log(`${message}\n`);
  }

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
    const headers = Object.keys(data[0]);

    const table = new Table({
      head: headers,
    });

    data.forEach((item) => {
      const row = headers.map((header) => item[header]);
      table.push(row);
    });

    console.log(table.toString());
  }
}
