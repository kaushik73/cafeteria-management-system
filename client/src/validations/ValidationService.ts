export default class ValidationService {
  static validateMonth(input: any): boolean {
    const month = parseInt(input);
    return !isNaN(month) && month >= 1 && month <= 12;
  }

  static validateYear(input: any): boolean {
    const year = parseInt(input);
    return !isNaN(year) && year >= 1900 && year <= 9999;
  }

  static validateUserID(EmployeeID: string): boolean {
    return !isNaN(parseInt(EmployeeID));
  }

  static validateOption(EmployeeID: string): boolean {
    return !isNaN(parseInt(EmployeeID));
  }
  
}
